// supabase/functions/parse-document/index.ts
// Parse regulatory documents (PDF, HTML, Text) and extract clauses
// Stores extracted clauses in regulatory_clauses table with embeddings

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  corsHeaders,
  handleCors,
  successResponse,
  errorResponse,
  typedErrorResponse,
  ErrorType,
  parseJSONBody,
  validateRequiredFields,
  logRequest,
  logResponse,
  measurePerformance,
} from "../shared/cors.ts";
import { getEmbedding, getChatCompletion, isOpenAIAvailable, classifyRegulatoryText } from "../shared/openai-client.ts";
import { hfClient } from "../shared/huggingface-client.ts";
import { aiService } from "../shared/ai-service.ts";

// ============================================
// TYPES
// ============================================

interface ParseDocumentRequest {
  documentUrl: string;
  regulatorId: string;
  documentType?: 'act' | 'regulation' | 'guideline' | 'circular' | 'framework' | 'notice';
  frameworkName?: string;
  title?: string;
  autoClassify?: boolean;
  generateEmbeddings?: boolean;
  language?: string;
}

interface ExtractedClause {
  clause_number: string;
  title: string;
  content: string;
  clause_type: string;
  keywords: string[];
  affected_sectors: string[];
}

interface ParseResult {
  success: boolean;
  documentId?: string;
  clausesExtracted: number;
  clausesStored: number;
  embeddingsGenerated: number;
  processingTimeMs: number;
  errors?: string[];
}

// ============================================
// DOCUMENT PARSING FUNCTIONS
// ============================================

/**
 * Fetch document from URL
 */
async function fetchDocument(url: string): Promise<{ text: string; contentType: string }> {
  console.log(`📥 Fetching document from: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'RegTrack-Document-Parser/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    let text = '';
    
    if (contentType.includes('pdf')) {
      text = await parsePDFContent(uint8Array);
    } else if (contentType.includes('html') || contentType.includes('text')) {
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(uint8Array);
      if (contentType.includes('html')) {
        text = stripHtmlTags(text);
      }
    } else {
      // Try to decode as text anyway
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(uint8Array);
    }

    console.log(`✅ Document fetched: ${text.length} characters`);
    return { text, contentType };
  } catch (error) {
    console.error('❌ Document fetch failed:', error);
    throw error;
  }
}

/**
 * Parse PDF content (basic text extraction)
 */
async function parsePDFContent(data: Uint8Array): Promise<string> {
  // Basic PDF text extraction without external dependencies
  const decoder = new TextDecoder('utf-8');
  let text = decoder.decode(data);
  
  // Remove PDF binary markers and extract readable text
  text = text
    .replace(/[^\x20-\x7E\x0A\x0D\u00A0-\u00FF]/g, ' ')  // Keep printable chars
    .replace(/\s+/g, ' ')                                    // Normalize whitespace
    .trim();
  
  // If text extraction failed, return meaningful message
  if (text.length < 100) {
    console.warn('⚠️ PDF text extraction limited, attempting alternative parsing...');
    // Try to extract text between stream/endstream markers
    const streamRegex = /stream\s+(.*?)\s+endstream/gs;
    const matches = text.matchAll(streamRegex);
    const parts: string[] = [];
    for (const match of matches) {
      if (match[1]) parts.push(match[1]);
    }
    if (parts.length > 0) {
      text = parts.join('\n');
    }
  }
  
  return text;
}

/**
 * Strip HTML tags from text
 */
function stripHtmlTags(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ============================================
// CLAUSE EXTRACTION FUNCTIONS
// ============================================

/**
 * Extract clauses from regulatory text using AI or regex
 */
async function extractClauses(
  text: string,
  regulatorId: string,
  frameworkName: string,
  autoClassify: boolean
): Promise<ExtractedClause[]> {
  console.log('🔍 Extracting clauses from text...');
  
  // First, try AI-powered extraction
  if (isOpenAIAvailable() && autoClassify) {
    try {
      return await extractClausesWithAI(text, regulatorId, frameworkName);
    } catch (error) {
      console.error('AI clause extraction failed, using pattern matching:', error);
    }
  }
  
  // Fallback: Pattern-based extraction
  return extractClausesWithPatterns(text, frameworkName);
}

/**
 * AI-powered clause extraction
 */
async function extractClausesWithAI(
  text: string,
  regulatorId: string,
  frameworkName: string
): Promise<ExtractedClause[]> {
  // Process in chunks (OpenAI token limit)
  const maxChunkSize = 4000;
  const chunks: string[] = [];
  
  for (let i = 0; i < text.length; i += maxChunkSize) {
    chunks.push(text.substring(i, i + maxChunkSize));
  }
  
  console.log(`📦 Processing ${chunks.length} chunks...`);
  
  const allClauses: ExtractedClause[] = [];
  
  for (let i = 0; i < Math.min(chunks.length, 5); i++) { // Limit to 5 chunks to manage costs
    const chunk = chunks[i];
    
    const prompt = `Extract regulatory clauses from the following Nigerian ${frameworkName} regulatory text.

Return a JSON array of clauses. Each clause should have:
- clause_number: Section/Article/Regulation number (e.g., "Section 24", "Article 3.1", "Regulation 5")
- title: Brief title of the clause
- content: The full text of the clause
- clause_type: One of ["obligation", "penalty", "definition", "procedure", "requirement", "prohibition", "right", "general"]
- keywords: Array of relevant compliance keywords

Text to analyze:
${chunk.substring(0, 3000)}

Return ONLY valid JSON array.`;

    try {
      const response = await getChatCompletion(
        [{ role: 'user', content: prompt }],
        { temperature: 0.1, jsonResponse: true, maxTokens: 2000 }
      );
      
      const parsed = JSON.parse(response);
      if (Array.isArray(parsed)) {
        // Classify each clause's sectors
        const classifiedClauses = await Promise.all(
          parsed.map(async (clause: any) => {
            const classification = await classifyRegulatoryText(
              `${clause.title}. ${clause.content}`
            ).catch(() => ({
              clause_type: clause.clause_type || 'general',
              keywords: clause.keywords || [],
              sectors: ['general'],
            }));
            
            return {
              clause_number: clause.clause_number || `Section ${allClauses.length + 1}`,
              title: clause.title || 'Untitled',
              content: clause.content || '',
              clause_type: classification.clause_type || clause.clause_type || 'general',
              keywords: classification.keywords || clause.keywords || [],
              affected_sectors: classification.sectors || ['general'],
            };
          })
        );
        
        allClauses.push(...classifiedClauses);
      }
    } catch (error) {
      console.error(`Chunk ${i + 1} extraction failed:`, error);
    }
    
    // Small delay between chunks
    if (i < chunks.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return allClauses;
}

/**
 * Pattern-based clause extraction (fallback)
 */
function extractClausesWithPatterns(text: string, frameworkName: string): ExtractedClause[] {
  console.log('📝 Using pattern-based extraction...');
  
  const clauses: ExtractedClause[] = [];
  
  // Nigerian regulatory document patterns
  const patterns = [
    // Sections (NDPA, CBN, etc.)
    {
      regex: /(?:Section|SECTION)\s+(\d+[A-Z]?(?:\(\d+\))?)[.:\s-]+([^\n]+)((?:(?!Section\s+\d+)[\s\S])*?)(?=(?:Section|SECTION)\s+\d+|$)/gi,
      prefix: 'Section',
    },
    // Articles (NITDA)
    {
      regex: /(?:Article|ARTICLE)\s+(\d+\.?\d*)[.:\s-]+([^\n]+)((?:(?!Article\s+\d+)[\s\S])*?)(?=(?:Article|ARTICLE)\s+\d+|$)/gi,
      prefix: 'Article',
    },
    // Regulations (CBN, SEC)
    {
      regex: /(?:Regulation|REGULATION)\s+(\d+[A-Z]?)[.:\s-]+([^\n]+)((?:(?!Regulation\s+\d+)[\s\S])*?)(?=(?:Regulation|REGULATION)\s+\d+|$)/gi,
      prefix: 'Regulation',
    },
    // Rules (SEC)
    {
      regex: /(?:Rule|RULE)\s+(\d+\.?\d*)[.:\s-]+([^\n]+)((?:(?!Rule\s+\d+)[\s\S])*?)(?=(?:Rule|RULE)\s+\d+|$)/gi,
      prefix: 'Rule',
    },
    // Parts
    {
      regex: /(?:Part|PART)\s+(\w+)[.:\s-]+([^\n]+)((?:(?!Part\s+\w+)[\s\S])*?)(?=(?:Part|PART)\s+\w+|$)/gi,
      prefix: 'Part',
    },
  ];
  
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern.regex);
    
    for (const match of matches) {
      const number = match[1];
      const title = match[2]?.trim() || 'Untitled';
      const content = match[3]?.trim() || '';
      
      if (content.length > 50) { // Minimum content length
        const clauseType = detectClauseType(title + ' ' + content);
        const keywords = aiService.extractKeywords(content);
        const sectors = aiService.detectSectors(content);
        
        clauses.push({
          clause_number: `${pattern.prefix} ${number}`,
          title: title.substring(0, 200),
          content: content.substring(0, 5000),
          clause_type: clauseType,
          keywords: keywords,
          affected_sectors: sectors,
        });
      }
    }
    
    if (clauses.length > 0) break; // Stop after finding matches with first pattern
  }
  
  // If no clauses found with patterns, create one clause from the whole text
  if (clauses.length === 0 && text.length > 100) {
    clauses.push({
      clause_number: 'General',
      title: `${frameworkName} Document`,
      content: text.substring(0, 5000),
      clause_type: 'general',
      keywords: aiService.extractKeywords(text),
      affected_sectors: aiService.detectSectors(text),
    });
  }
  
  console.log(`✅ Pattern extraction found ${clauses.length} clauses`);
  return clauses;
}

/**
 * Detect clause type from content
 */
function detectClauseType(text: string): string {
  const lowerText = text.toLowerCase();
  
  if (/penalty|fine|sanction|offence|punish|liable to|conviction|imprisonment/i.test(lowerText)) {
    return 'penalty';
  }
  if (/shall\s+not|must\s+not|prohibited|shall\s+be\s+an\s+offence/i.test(lowerText)) {
    return 'prohibition';
  }
  if (/shall\s+|must\s+|required\s+to|obligation|duty\s+to/i.test(lowerText)) {
    return 'obligation';
  }
  if (/mean|means|definition|defined\s+as|interpret|construed/i.test(lowerText)) {
    return 'definition';
  }
  if (/procedure|process|step|method|manner|how\s+to/i.test(lowerText)) {
    return 'procedure';
  }
  if (/right\s+of|right\s+to|entitled\s+to|data\s+subject\s+right/i.test(lowerText)) {
    return 'right';
  }
  if (/principle|shall\s+be\s+guided|fundamental/i.test(lowerText)) {
    return 'principle';
  }
  
  return 'general';
}

// ============================================
// MAIN FUNCTION
// ============================================

serve(async (req: Request) => {
  // Handle CORS
  const corsPreflight = handleCors(req);
  if (corsPreflight) return corsPreflight;

  // Performance tracking
  const perf = measurePerformance();
  perf.start();

  // Log request
  logRequest('parse-document', req);

  try {
    // Parse and validate request
    const body = await parseJSONBody(req);
    const validationError = validateRequiredFields(body, ['documentUrl', 'regulatorId']);
    if (validationError) {
      return errorResponse(validationError, 400);
    }

    const {
      documentUrl,
      regulatorId,
      documentType = 'regulation',
      frameworkName = 'NDPA',
      title,
      autoClassify = true,
      generateEmbeddings = true,
    } = body as ParseDocumentRequest;

    console.log(`📄 Parsing document for framework: ${frameworkName}`);
    console.log(`📡 URL: ${documentUrl}`);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const errors: string[] = [];

    // Step 1: Fetch and parse document
    let documentText: string;
    try {
      const { text } = await fetchDocument(documentUrl);
      documentText = text;
    } catch (error) {
      return errorResponse(`Failed to fetch document: ${error.message}`, 400);
    }

    // Step 2: Create regulation entry
    const documentHash = await generateHash(documentText);
    
    const { data: regulation, error: regError } = await supabase
      .from('regulations')
      .upsert({
        regulator_id: regulatorId,
        title: title || `${frameworkName} Document ${new Date().toISOString().split('T')[0]}`,
        short_title: title || frameworkName,
        document_type: documentType,
        framework_name: frameworkName,
        source_url: documentUrl,
        file_hash: documentHash,
        status: 'active',
        effective_date: new Date().toISOString().split('T')[0],
      }, {
        onConflict: 'regulator_id, title, version',
      })
      .select('id')
      .single();

    if (regError) {
      return errorResponse('Failed to create regulation entry', 500, regError);
    }

    console.log(`✅ Regulation created: ${regulation.id}`);

    // Step 3: Extract clauses
    const clauses = await extractClauses(documentText, regulatorId, frameworkName, autoClassify);
    console.log(`📋 Extracted ${clauses.length} clauses`);

    // Step 4: Store clauses in database
    let clausesStored = 0;
    let embeddingsGenerated = 0;

    for (const clause of clauses) {
      try {
        // Check for duplicate
        const { data: existing } = await supabase
          .from('regulatory_clauses')
          .select('id')
          .eq('regulation_id', regulation.id)
          .eq('clause_number', clause.clause_number)
          .eq('is_current', true)
          .single();

        if (existing) {
          console.log(`⏭️ Skipping duplicate: ${clause.clause_number}`);
          continue;
        }

        // Insert clause
        const { data: newClause, error: clauseError } = await supabase
          .from('regulatory_clauses')
          .insert({
            regulation_id: regulation.id,
            clause_number: clause.clause_number,
            title: clause.title,
            content: clause.content,
            clause_type: clause.clause_type,
            keywords: clause.keywords,
            affected_sectors: clause.affected_sectors,
            framework_name: frameworkName,
            version: 1,
            is_current: true,
          })
          .select('id')
          .single();

        if (clauseError) {
          errors.push(`Failed to store clause ${clause.clause_number}: ${clauseError.message}`);
          continue;
        }

        clausesStored++;

        // Generate embedding if requested
        if (generateEmbeddings && isOpenAIAvailable() && newClause) {
          try {
            const embeddingText = `${clause.title}. ${clause.content}`;
            const embedding = await getEmbedding(embeddingText);
            
            await supabase
              .from('regulatory_clauses')
              .update({ content_embedding: embedding })
              .eq('id', newClause.id);
            
            embeddingsGenerated++;
          } catch (embError) {
            errors.push(`Embedding failed for ${clause.clause_number}: ${embError.message}`);
          }
        }
      } catch (error) {
        errors.push(`Error processing clause ${clause.clause_number}: ${error.message}`);
      }
    }

    const processingTime = perf.end();

    const result: ParseResult = {
      success: true,
      documentId: regulation.id,
      clausesExtracted: clauses.length,
      clausesStored,
      embeddingsGenerated,
      processingTimeMs: Math.round(processingTime),
      errors: errors.length > 0 ? errors : undefined,
    };

    logResponse('parse-document', 200, result);
    return successResponse(result);

  } catch (error) {
    console.error('Parse document error:', error);
    logResponse('parse-document', 500, { error: error.message });
    return errorResponse(error.message, 500);
  }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Generate a simple hash for document deduplication
 */
async function generateHash(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text.substring(0, 1000));
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}