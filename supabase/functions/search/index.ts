// supabase/functions/search/index.ts
// Multi-framework semantic search supporting NDPA, CBN, SEC, NITDA
// Supports English, Hausa, Igbo, and Yoruba languages

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  handleCors,
  successResponse,
  errorResponse,
  parseJSONBody,
  validateRequiredFields,
  logRequest,
  logResponse,
  measurePerformance,
} from "../shared/cors.ts";
import { getEmbedding, isOpenAIAvailable } from "../shared/openai-client.ts";
import { hfClient } from "../shared/huggingface-client.ts";
import { aiService } from "../shared/ai-service.ts";
import type {
  SearchResult,
  Language,
  SearchRequest,
  ClauseQuery,
} from "../shared/types.ts";

// ============================================
// TYPES
// ============================================

interface SearchRequest {
  query: string;
  language?: Language;
  frameworks?: string[]; // Filter by specific frameworks
  sectors?: string[]; // Filter by sectors
  clauseTypes?: string[]; // Filter by clause types
  limit?: number;
  threshold?: number;
  includeSummaries?: boolean;
}

interface SearchResponse {
  results: SearchResult[];
  meta: {
    query: string;
    language: Language;
    total_results: number;
    processing_time_ms: number;
    frameworks_searched: string[];
    search_method: 'semantic' | 'keyword' | 'hybrid';
    filters_applied: Record<string, any>;
  };
}

// ============================================
// KEYWORD-BASED SEARCH (Fallback when no embeddings)
// ============================================

async function keywordSearch(
  supabase: any,
  query: string,
  options: {
    language?: Language;
    frameworks?: string[];
    sectors?: string[];
    clauseTypes?: string[];
    limit?: number;
  }
): Promise<SearchResult[]> {
  const {
    language = 'en',
    frameworks,
    sectors,
    clauseTypes,
    limit = 10,
  } = options;

  // Build search terms from query
  const searchTerms = query
    .toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 1)
    .map(term => `%${term}%`);

  if (searchTerms.length === 0) {
    return [];
  }

  // Build query conditions
  const conditions: string[] = [];
  const params: any[] = [];

  // Language-specific content search
  if (language === 'en') {
    conditions.push(`(cl.title ILIKE ANY($${params.length + 1}) OR cl.content ILIKE ANY($${params.length + 1}))`);
    params.push(searchTerms);
  } else if (['ha', 'ig', 'yo'].includes(language)) {
    // For local languages, search in translated content
    conditions.push(`
      (cl.title ILIKE ANY($${params.length + 1}) 
       OR cl.content ILIKE ANY($${params.length + 1})
       OR EXISTS (
         SELECT 1 FROM regulatory_clauses_translations t 
         WHERE t.clause_id = cl.id 
         AND t.language = $${params.length + 2}
         AND (t.title ILIKE ANY($${params.length + 1}) OR t.content ILIKE ANY($${params.length + 1}))
       ))
    `);
    params.push(searchTerms);
    params.push(language);
  }

  // Framework filter
  if (frameworks && frameworks.length > 0) {
    conditions.push(`cl.framework_name = ANY($${params.length + 1})`);
    params.push(frameworks);
  }

  // Sector filter
  if (sectors && sectors.length > 0) {
    conditions.push(`cl.affected_sectors && $${params.length + 1}`);
    params.push(sectors);
  }

  // Clause type filter
  if (clauseTypes && clauseTypes.length > 0) {
    conditions.push(`cl.clause_type = ANY($${params.length + 1})`);
    params.push(clauseTypes);
  }

  // Only current versions
  conditions.push('cl.is_current = true');

  const whereClause = conditions.length > 0 
    ? `WHERE ${conditions.join(' AND ')}`
    : '';

  // Calculate relevance score based on keyword matches
  const query = `
    SELECT 
      cl.id as section_id,
      cl.title,
      cl.content,
      cl.framework_name,
      cl.clause_type,
      r.name as regulator_name,
      (
        (CASE WHEN cl.title ILIKE $${params.length + 1} THEN 0.4 ELSE 0 END) +
        (CASE WHEN cl.content ILIKE $${params.length + 1} THEN 0.3 ELSE 0 END) +
        (0.1 * (
          SELECT COUNT(*) 
          FROM unnest(${params.length + 2}::text[]) t(term)
          WHERE cl.content ILIKE '%' || term || '%'
        ))
      ) as relevance
    FROM regulatory_clauses cl
    LEFT JOIN regulations reg ON cl.regulation_id = reg.id
    LEFT JOIN regulators r ON reg.regulator_id = r.id
    ${whereClause}
    ORDER BY relevance DESC
    LIMIT $${params.length + 3}
  `;

  params.push(`%${searchTerms[0].replace(/%/g, '')}%`); // Main search term
  params.push(searchTerms.map(t => t.replace(/%/g, ''))); // All terms array
  params.push(limit);

  const { data, error } = await supabase.rpc('execute_sql', { sql: query });

  // Fallback if RPC not available - use direct query
  if (error) {
    console.log('RPC not available, using direct query');
    
    let supabaseQuery = supabase
      .from('regulatory_clauses')
      .select(`
        id:section_id,
        title,
        content,
        framework_name,
        clause_type,
        regulations!inner(
          regulators!inner(name)
        )
      `)
      .eq('is_current', true)
      .or(`title.ilike.%${searchTerms[0].replace(/%/g, '')}%,content.ilike.%${searchTerms[0].replace(/%/g, '')}%`)
      .limit(limit);

    if (frameworks && frameworks.length > 0) {
      supabaseQuery = supabaseQuery.in('framework_name', frameworks);
    }

    const { data: directData } = await supabaseQuery;

    return (directData || []).map((row: any) => ({
      section_id: row.id || row.section_id,
      title: row.title || 'Untitled',
      content: row.content || '',
      relevance: 0.5,
      language: language,
      framework_name: row.framework_name,
      clause_type: row.clause_type,
      regulator: row.regulations?.regulators?.name || row.regulator_name,
    }));
  }

  return (data || []).map((row: any) => ({
    section_id: row.section_id,
    title: row.title || 'Untitled',
    content: row.content || '',
    relevance: Math.min(Math.round((row.relevance || 0.5) * 100), 100),
    language: language,
    framework_name: row.framework_name,
    clause_type: row.clause_type,
    regulator: row.regulator_name,
  }));
}

// ============================================
// SEMANTIC SEARCH (Using embeddings)
// ============================================

async function semanticSearch(
  supabase: any,
  queryEmbedding: number[],
  options: {
    language?: Language;
    frameworks?: string[];
    sectors?: string[];
    clauseTypes?: string[];
    limit?: number;
    threshold?: number;
  }
): Promise<SearchResult[]> {
  const {
    language = 'en',
    frameworks,
    sectors,
    clauseTypes,
    limit = 10,
    threshold = 0.6,
  } = options;

  try {
    // Try using the match_clauses RPC function
    const { data, error } = await supabase.rpc('match_regulatory_clauses', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: limit,
      language_filter: language,
      framework_filter: frameworks || null,
      sector_filter: sectors || null,
      clause_type_filter: clauseTypes || null,
    });

    if (error) {
      console.error('RPC error, falling back to direct query:', error);
      throw error;
    }

    return (data || []).map((row: any) => ({
      section_id: row.section_id || row.id,
      title: row.title || 'Untitled',
      content: row.content || '',
      relevance: Math.round((row.similarity || row.relevance || 0.5) * 100),
      language: language,
      framework_name: row.framework_name,
      clause_type: row.clause_type,
      regulator: row.regulator_name || row.regulator,
    }));
  } catch (rpcError) {
    // Fallback: Direct vector search using cosine similarity
    console.log('Using direct vector search...');
    
    let query = supabase
      .from('regulatory_clauses')
      .select(`
        id,
        title,
        content,
        framework_name,
        clause_type,
        regulations!inner(
          regulators!inner(name)
        )
      `)
      .eq('is_current', true)
      .not('content_embedding', 'is', null)
      .limit(limit);

    // Apply filters
    if (frameworks && frameworks.length > 0) {
      query = query.in('framework_name', frameworks);
    }
    if (clauseTypes && clauseTypes.length > 0) {
      query = query.in('clause_type', clauseTypes);
    }
    if (sectors && sectors.length > 0) {
      query = query.contains('affected_sectors', sectors);
    }

    const { data, error } = await query;

    if (error || !data) {
      console.error('Direct query failed:', error);
      return [];
    }

    // Calculate cosine similarity manually
    const results = data.map((row: any) => {
      const similarity = cosineSimilarity(queryEmbedding, row.content_embedding);
      return {
        section_id: row.id,
        title: row.title,
        content: row.content,
        relevance: Math.round(similarity * 100),
        language: language,
        framework_name: row.framework_name,
        clause_type: row.clause_type,
        regulator: row.regulations?.regulators?.name,
      };
    });

    // Filter by threshold and sort
    return results
      .filter(r => r.relevance >= threshold * 100)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit);
  }
}

// ============================================
// COSINE SIMILARITY CALCULATOR
// ============================================

function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    return 0;
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ============================================
// HYBRID SEARCH (Combines semantic + keyword)
// ============================================

async function hybridSearch(
  supabase: any,
  query: string,
  queryEmbedding: number[],
  options: any
): Promise<SearchResult[]> {
  // Run both searches in parallel
  const [semanticResults, keywordResults] = await Promise.all([
    semanticSearch(supabase, queryEmbedding, options).catch(() => []),
    keywordSearch(supabase, query, options).catch(() => []),
  ]);

  // Combine and deduplicate results
  const resultMap = new Map<string, SearchResult>();

  // Add semantic results (weighted higher)
  for (const result of semanticResults) {
    resultMap.set(result.section_id, {
      ...result,
      relevance: Math.round(result.relevance * 0.7), // 70% weight
    });
  }

  // Add keyword results
  for (const result of keywordResults) {
    if (resultMap.has(result.section_id)) {
      // Boost existing result
      const existing = resultMap.get(result.section_id)!;
      existing.relevance = Math.min(
        100,
        existing.relevance + Math.round(result.relevance * 0.3) // 30% weight
      );
    } else {
      resultMap.set(result.section_id, {
        ...result,
        relevance: Math.round(result.relevance * 0.3),
      });
    }
  }

  // Sort by relevance and return top results
  return Array.from(resultMap.values())
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, options.limit || 10);
}

// ============================================
// LOCAL LANGUAGE SUPPORT
// ============================================

const LANGUAGE_MAP: Record<string, string> = {
  en: 'English',
  ha: 'Hausa',
  ig: 'Igbo',
  yo: 'Yoruba',
};

function getTranslatedQuery(query: string, language: Language): string {
  // Simple keyword translation for common regulatory terms
  const translations: Record<string, Record<string, string>> = {
    ha: {
      'data': 'bayanai',
      'privacy': 'sirri',
      'protection': 'kariya',
      'consent': 'yarda',
      'security': 'tsaro',
      'breach': 'keta',
      'policy': 'manufa',
      'right': 'hakki',
    },
    ig: {
      'data': 'data',
      'privacy': 'nzuzo',
      'protection': 'nchebe',
      'consent': 'nkwado',
      'security': 'nche',
      'breach': 'mmebi',
      'policy': 'iwu',
      'right': 'ikike',
    },
    yo: {
      'data': 'data',
      'privacy': 'asiri',
      'protection': 'idaabobo',
      'consent': 'igbanilaaye',
      'security': 'aabo',
      'breach': 'irufin',
      'policy': 'ofin',
      'right': 'ẹtọ',
    },
  };

  if (language === 'en' || !translations[language]) {
    return query;
  }

  const langTranslations = translations[language];
  let translatedQuery = query.toLowerCase();
  
  for (const [english, local] of Object.entries(langTranslations)) {
    translatedQuery = translatedQuery.replace(new RegExp(english, 'gi'), local);
  }

  return translatedQuery;
}

// ============================================
// MAIN SEARCH FUNCTION
// ============================================

serve(async (req: Request) => {
  // Handle CORS
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  // Performance tracking
  const perf = measurePerformance();
  perf.start();

  // Log request
  logRequest('search', req);

  try {
    // Parse request
    const body = await parseJSONBody(req);
    
    const {
      query,
      language = 'en',
      frameworks,
      sectors,
      clauseTypes,
      limit = 10,
      threshold = 0.6,
      includeSummaries = false,
    } = body as SearchRequest;

    // Validate query
    if (!query || query.trim().length < 2) {
      logResponse('search', 400, { error: 'Query too short' });
      return successResponse({
        results: [],
        meta: {
          query: query || '',
          language,
          total_results: 0,
          processing_time_ms: 0,
          frameworks_searched: frameworks || ['all'],
          search_method: 'none',
          filters_applied: { frameworks, sectors, clauseTypes },
        },
      });
    }

    // Initialize Supabase
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Process language-specific query
    const searchQuery = language !== 'en' 
      ? getTranslatedQuery(query.trim(), language)
      : query.trim();

    let results: SearchResult[] = [];
    let searchMethod: 'semantic' | 'keyword' | 'hybrid' = 'keyword';

    const searchOptions = {
      language,
      frameworks,
      sectors,
      clauseTypes,
      limit,
      threshold,
    };

    // ============================================
    // ATTEMPT SEMANTIC SEARCH FIRST
    // ============================================
    
    if (isOpenAIAvailable()) {
      try {
        console.log('🔍 Attempting semantic search...');
        const queryEmbedding = await getEmbedding(searchQuery);
        
        // Use hybrid search for better results
        results = await hybridSearch(supabase, searchQuery, queryEmbedding, searchOptions);
        searchMethod = 'hybrid';
        
        console.log(`✅ Semantic search found ${results.length} results`);
      } catch (semanticError) {
        console.error('Semantic search failed, using keyword search:', semanticError);
        results = await keywordSearch(supabase, searchQuery, searchOptions);
        searchMethod = 'keyword';
      }
    } else if (hfClient.isConfigured()) {
      // Try HuggingFace embeddings as fallback
      try {
        console.log('🔍 Attempting HuggingFace semantic search...');
        const hfEmbedding = await hfClient.generateEmbedding(searchQuery);
        results = await semanticSearch(supabase, hfEmbedding.embedding, searchOptions);
        searchMethod = 'semantic';
      } catch (hfError) {
        console.error('HuggingFace search failed, using keyword search:', hfError);
        results = await keywordSearch(supabase, searchQuery, searchOptions);
        searchMethod = 'keyword';
      }
    } else {
      // No AI available, use keyword search
      console.log('ℹ️  No AI service available, using keyword search');
      results = await keywordSearch(supabase, searchQuery, searchOptions);
      searchMethod = 'keyword';
    }

    // ============================================
    // ENRICH RESULTS WITH SUMMARIES (Optional)
    // ============================================
    
    if (includeSummaries && results.length > 0) {
      try {
        const summaries = await Promise.all(
          results.slice(0, 5).map(async (result) => {
            try {
              const summary = await aiService.summarizeText(result.content);
              return { ...result, summary };
            } catch {
              return result;
            }
          })
        );
        results = summaries;
      } catch (summaryError) {
        console.error('Summary generation failed:', summaryError);
      }
    }

    // ============================================
    // BUILD RESPONSE METADATA
    // ============================================
    
    const processingTime = perf.end();
    
    const frameworksSearched = frameworks || 
      [...new Set(results.map(r => r.framework_name).filter(Boolean))] as string[];

    const response: SearchResponse = {
      results,
      meta: {
        query: query.trim(),
        language,
        total_results: results.length,
        processing_time_ms: Math.round(processingTime),
        frameworks_searched: frameworksSearched,
        search_method: searchMethod,
        filters_applied: {
          frameworks: frameworks || 'all',
          sectors: sectors || 'all',
          clauseTypes: clauseTypes || 'all',
          threshold,
          language,
        },
      },
    };

    logResponse('search', 200, {
      resultCount: results.length,
      searchMethod,
      processingTime: `${processingTime.toFixed(0)}ms`,
    });

    return successResponse(response);

  } catch (error) {
    console.error('Search error:', error);
    logResponse('search', 500, { error: error.message });
    
    // Return graceful fallback
    return successResponse({
      results: [],
      meta: {
        query: '',
        language: 'en',
        total_results: 0,
        processing_time_ms: 0,
        frameworks_searched: [],
        search_method: 'error',
        filters_applied: {},
        error: error instanceof Error ? error.message : 'Search failed',
      },
    });
  }
});