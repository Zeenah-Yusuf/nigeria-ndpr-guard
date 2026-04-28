// supabase/functions/shared/ai-client.ts
// Unified AI client supporting both OpenAI and HuggingFace
// OpenAI is used for embeddings, HuggingFace for free NLP tasks

// ============================================
// TYPES
// ============================================

export interface EmbeddingResult {
  embedding: number[];
  model: string;
  dimensions: number;
}

export interface ClassificationResult {
  clause_type: string;
  confidence: number;
  keywords: string[];
  sectors: string[];
  summary: string;
}

export interface ComplianceCheck {
  isCompliant: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  missingRequirements: string[];
  recommendations: string[];
  relevantClauses: string[];
}

// ============================================
// OPENAI CLIENT
// ============================================

class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = Deno.env.get('OPENAI_API_KEY') || '';
    if (!this.apiKey) {
      console.warn('⚠️  OPENAI_API_KEY not set. OpenAI features disabled.');
    }
  }

  /**
   * Generate embeddings using OpenAI
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: text.substring(0, 8000), // OpenAI token limit
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${response.status} - ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      return {
        embedding: data.data[0].embedding,
        model: 'text-embedding-3-small',
        dimensions: 1536,
      };
    } catch (error) {
      console.error('OpenAI embedding failed:', error);
      throw error;
    }
  }

  /**
   * Generate batch embeddings
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: texts.map(t => t.substring(0, 8000)),
          encoding_format: 'float',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI batch embedding error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.map((d: any) => d.embedding);
    } catch (error) {
      console.error('OpenAI batch embedding failed:', error);
      throw error;
    }
  }

  /**
   * Generate chat completion (GPT-4o-mini for cost efficiency)
   */
  async generateCompletion(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.apiKey) throw new Error('OpenAI API key not configured');

    const messages: any[] = [];
    
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini', // Cheapest GPT-4 model
          messages,
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        // Fallback to GPT-3.5 if GPT-4o-mini not available
        return this.generateCompletionFallback(prompt, systemPrompt);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI completion failed:', error);
      return this.generateCompletionFallback(prompt, systemPrompt);
    }
  }

  /**
   * Fallback to basic response if AI fails
   */
  private async generateCompletionFallback(prompt: string, systemPrompt?: string): Promise<string> {
    // Return a basic response based on prompt analysis
    if (prompt.includes('summarize')) {
      return prompt.substring(0, 200) + '...';
    }
    if (prompt.includes('compliance')) {
      return 'Unable to analyze compliance at this moment. Please review the regulatory requirements manually.';
    }
    return 'I apologize, but I am unable to process this request at the moment. Please try again later.';
  }
}

// ============================================
// HUGGINGFACE CLIENT
// ============================================

class HuggingFaceClient {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co';

  constructor() {
    this.apiKey = Deno.env.get('HF_API_KEY') || '';
    if (!this.apiKey) {
      console.warn('⚠️  HF_API_KEY not set. HuggingFace features disabled.');
    }
  }

  /**
   * Generate embeddings using HuggingFace (free alternative)
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (!this.apiKey) throw new Error('HuggingFace API key not configured');

    const model = 'sentence-transformers/all-MiniLM-L6-v2';
    
    try {
      const response = await fetch(
        `${this.baseUrl}/pipeline/feature-extraction/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.substring(0, 1000),
            options: { wait_for_model: true },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HF API error: ${response.status}`);
      }

      const embedding = await response.json();
      
      return {
        embedding: Array.isArray(embedding) ? embedding : embedding[0],
        model: model,
        dimensions: 384,
      };
    } catch (error) {
      console.error('HuggingFace embedding failed:', error);
      throw error;
    }
  }

  /**
   * Summarize text using BART model
   */
  async summarizeText(text: string): Promise<string> {
    if (!this.apiKey) {
      return text.substring(0, 200) + '...';
    }

    const model = 'facebook/bart-large-cnn';
    
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.substring(0, 1024),
            parameters: {
              max_length: 150,
              min_length: 30,
              do_sample: false,
            },
          }),
        }
      );

      if (!response.ok) {
        return text.substring(0, 200) + '...';
      }

      const result = await response.json();
      
      // Handle different response formats
      if (Array.isArray(result) && result[0]?.summary_text) {
        return result[0].summary_text;
      }
      if (result.summary_text) {
        return result.summary_text;
      }
      
      return text.substring(0, 200) + '...';
    } catch (error) {
      console.error('Summarization failed:', error);
      return text.substring(0, 200) + '...';
    }
  }

  /**
   * Classify text using zero-shot classification
   */
  async classifyText(
    text: string,
    labels: string[]
  ): Promise<{ label: string; score: number }[]> {
    if (!this.apiKey) return [];

    const model = 'facebook/bart-large-mnli';
    
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text.substring(0, 500),
            parameters: {
              candidate_labels: labels,
              multi_label: false,
            },
          }),
        }
      );

      if (!response.ok) {
        return [{ label: labels[0] || 'general', score: 0.5 }];
      }

      const result = await response.json();
      
      // Handle different response formats
      if (result.labels && result.scores) {
        return result.labels.map((label: string, i: number) => ({
          label,
          score: result.scores[i],
        }));
      }
      
      return [{ label: labels[0] || 'general', score: 0.5 }];
    } catch (error) {
      console.error('Classification failed:', error);
      return [{ label: labels[0] || 'general', score: 0.5 }];
    }
  }

  /**
   * Detect regulatory keywords
   */
  private extractKeywords(text: string): string[] {
    const regulatoryKeywords = [
      'data protection', 'privacy', 'consent', 'security', 'encryption',
      'breach', 'notification', 'compliance', 'audit', 'assessment',
      'penalty', 'fine', 'sanction', 'license', 'registration',
      'customer', 'consumer', 'investor', 'risk', 'capital',
      'reporting', 'disclosure', 'transparency', 'governance',
      'anti-money laundering', 'KYC', 'due diligence', 'monitoring',
      'data subject', 'personal data', 'processing', 'controller',
      'processor', 'impact assessment', 'transfer', 'cross-border',
      'sensitive data', 'biometric', 'genetic', 'health data',
      'financial data', 'payment', 'transaction', 'fraud',
      'cybersecurity', 'incident response', 'business continuity',
    ];

    const lowerText = text.toLowerCase();
    return regulatoryKeywords.filter(kw => lowerText.includes(kw));
  }

  /**
   * Detect affected sectors from text
   */
  private detectSectors(text: string): string[] {
    const sectorPatterns: Record<string, RegExp> = {
      fintech: /financ|bank|payment|lending|insurance|invest|capital|money|loan|credit|debit|wallet|crypto/i,
      healthtech: /health|medical|patient|hospital|pharma|clinical|doctor|nurse|treatment|diagnosis|therapy/i,
      ecommerce: /ecommerce|online retail|marketplace|consumer|shop|store|cart|checkout|delivery|order/i,
      edtech: /education|school|university|student|teacher|learning|course|training|academic|curriculum/i,
      agritech: /agriculture|farm|crop|livestock|food|harvest|soil|irrigation|fertilizer/i,
      enterprise: /enterprise|business|corporate|company|organization|workforce|employee|productivity/i,
      social_media: /social media|content|platform|user generated|influencer|streaming|post|share/i,
    };

    const lowerText = text.toLowerCase();
    const detectedSectors: string[] = [];

    for (const [sector, pattern] of Object.entries(sectorPatterns)) {
      if (pattern.test(lowerText)) {
        detectedSectors.push(sector);
      }
    }

    return detectedSectors.length > 0 ? detectedSectors : ['general'];
  }

  /**
   * Question answering using HuggingFace
   */
  async answerQuestion(context: string, question: string): Promise<string> {
    if (!this.apiKey) return 'Unable to answer at this moment.';

    const model = 'deepset/roberta-base-squad2';
    
    try {
      const response = await fetch(
        `${this.baseUrl}/models/${model}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: {
              question,
              context: context.substring(0, 1000),
            },
          }),
        }
      );

      if (!response.ok) {
        return 'Unable to find answer in the provided context.';
      }

      const result = await response.json();
      
      if (result.answer && result.score > 0.3) {
        return result.answer;
      }
      
      return 'Unable to find a confident answer in the regulatory text.';
    } catch (error) {
      console.error('Question answering failed:', error);
      return 'Error processing question. Please try again.';
    }
  }

  /**
   * Named Entity Recognition for regulatory texts
   */
  async extractEntities(text: string): Promise<{
    organizations: string[];
    dates: string[];
    amounts: string[];
    references: string[];
  }> {
    // Use regex patterns for common regulatory entities
    const organizations: string[] = [];
    const dates: string[] = [];
    const amounts: string[] = [];
    const references: string[] = [];

    // Extract Naira amounts
    const nairaRegex = /(?:₦|NGN|Naira)\s*([\d,]+(?:\.\d{2})?)/gi;
    let match;
    while ((match = nairaRegex.exec(text)) !== null) {
      amounts.push(match[0]);
    }

    // Extract dates
    const dateRegex = /\d{1,2}(?:st|nd|rd|th)?\s+(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/gi;
    while ((match = dateRegex.exec(text)) !== null) {
      dates.push(match[0]);
    }

    // Extract regulatory references
    const refRegex = /(?:Section|Part|Article|Regulation|Act)\s+\d+[A-Z]?/gi;
    while ((match = refRegex.exec(text)) !== null) {
      references.push(match[0]);
    }

    // Extract organization names
    const orgRegex = /(?:CBN|NDPC|NITDA|SEC|NAICOM|PENCOM|NCC|FRCN)\b/gi;
    while ((match = orgRegex.exec(text)) !== null) {
      if (!organizations.includes(match[0])) {
        organizations.push(match[0]);
      }
    }

    return { organizations, dates, amounts, references };
  }
}

// ============================================
// MAIN AI CLIENT - COMBINES BOTH SERVICES
// ============================================

export class AIClient {
  private openai: OpenAIClient;
  private huggingface: HuggingFaceClient;
  private useOpenAI: boolean;

  constructor() {
    this.openai = new OpenAIClient();
    this.huggingface = new HuggingFaceClient();
    // Use OpenAI if available, fallback to HuggingFace
    this.useOpenAI = !!Deno.env.get('OPENAI_API_KEY');
    
    console.log(`🤖 AI Client initialized`);
    console.log(`   - OpenAI: ${this.useOpenAI ? '✅ Available' : '❌ Not configured'}`);
    console.log(`   - HuggingFace: ${Deno.env.get('HF_API_KEY') ? '✅ Available' : '❌ Not configured'}`);
  }

  /**
   * Generate embedding (prefer OpenAI, fallback to HuggingFace)
   */
  async generateEmbedding(text: string): Promise<EmbeddingResult> {
    if (this.useOpenAI) {
      try {
        return await this.openai.generateEmbedding(text);
      } catch (error) {
        console.log('OpenAI embedding failed, trying HuggingFace...');
      }
    }
    
    return await this.huggingface.generateEmbedding(text);
  }

  /**
   * Generate batch embeddings
   */
  async generateBatchEmbeddings(texts: string[]): Promise<number[][]> {
    if (this.useOpenAI) {
      try {
        return await this.openai.generateBatchEmbeddings(texts);
      } catch (error) {
        console.log('OpenAI batch embedding failed, processing individually...');
      }
    }
    
    // HuggingFace doesn't support batch, process one by one
    const embeddings: number[][] = [];
    for (const text of texts) {
      const result = await this.huggingface.generateEmbedding(text);
      embeddings.push(result.embedding);
    }
    return embeddings;
  }

  /**
   * Summarize regulatory text
   */
  async summarizeText(text: string): Promise<string> {
    if (this.useOpenAI) {
      const prompt = `Summarize the following regulatory text in 2-3 sentences, highlighting key obligations or requirements:\n\n${text.substring(0, 2000)}`;
      try {
        return await this.openai.generateCompletion(prompt);
      } catch (error) {
        console.log('OpenAI summarization failed, trying HuggingFace...');
      }
    }
    
    return await this.huggingface.summarizeText(text);
  }

  /**
   * Classify regulatory text
   */
  async classifyRegulatoryText(text: string): Promise<ClassificationResult> {
    const clauseTypes = [
      'obligation', 'penalty', 'definition', 'procedure',
      'principle', 'requirement', 'prohibition', 'right', 'exception'
    ];

    let classification: { label: string; score: number }[];

    if (this.useOpenAI) {
      const prompt = `Classify the following regulatory text into one of these categories: ${clauseTypes.join(', ')}. Also identify key compliance keywords and affected business sectors. Return as JSON with fields: clause_type, keywords (array), sectors (array).\n\nText: ${text.substring(0, 500)}`;
      
      try {
        const response = await this.openai.generateCompletion(prompt);
        const parsed = JSON.parse(response);
        
        return {
          clause_type: parsed.clause_type || 'general',
          confidence: 0.8,
          keywords: parsed.keywords || this.extractKeywords(text),
          sectors: parsed.sectors || this.detectSectors(text),
          summary: await this.summarizeText(text),
        };
      } catch (error) {
        console.log('OpenAI classification failed, using HuggingFace...');
      }
    }

    // Fallback to HuggingFace
    const hfClassification = await this.huggingface.classifyText(text, clauseTypes);
    
    return {
      clause_type: hfClassification[0]?.label || 'general',
      confidence: hfClassification[0]?.score || 0.5,
      keywords: this.extractKeywords(text),
      sectors: this.detectSectors(text),
      summary: await this.summarizeText(text),
    };
  }

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    const keywords = [
      'data protection', 'privacy', 'consent', 'security', 'encryption',
      'breach', 'notification', 'compliance', 'audit', 'assessment',
      'penalty', 'fine', 'sanction', 'license', 'registration',
      'customer', 'consumer', 'investor', 'risk', 'capital',
      'reporting', 'disclosure', 'transparency', 'governance',
      'anti-money laundering', 'KYC', 'due diligence', 'monitoring'
    ];

    const lowerText = text.toLowerCase();
    return keywords.filter(kw => lowerText.includes(kw));
  }

  /**
   * Detect affected sectors
   */
  private detectSectors(text: string): string[] {
    const sectorPatterns: Record<string, RegExp> = {
      fintech: /financ|bank|payment|lending|insurance|invest|capital/i,
      healthtech: /health|medical|patient|hospital|pharma|clinical/i,
      ecommerce: /ecommerce|online retail|marketplace|consumer/i,
      edtech: /education|school|university|student|teacher|learning/i,
      agritech: /agriculture|farm|crop|livestock|food|harvest/i,
      enterprise: /enterprise|business|corporate|company|organization/i,
      social_media: /social media|content|platform|user generated/i,
    };

    const lowerText = text.toLowerCase();
    const sectors = Object.entries(sectorPatterns)
      .filter(([_, pattern]) => pattern.test(lowerText))
      .map(([sector]) => sector);

    return sectors.length > 0 ? sectors : ['general'];
  }

  /**
   * Answer regulatory questions
   */
  async answerRegulatoryQuestion(question: string, context: string): Promise<string> {
    if (this.useOpenAI) {
      const prompt = `Based on the following regulatory text, answer this question:\n\nQuestion: ${question}\n\nRegulatory Text: ${context.substring(0, 2000)}\n\nAnswer in simple, clear language.`;
      
      try {
        return await this.openai.generateCompletion(prompt);
      } catch (error) {
        console.log('OpenAI Q&A failed, trying HuggingFace...');
      }
    }
    
    return await this.huggingface.answerQuestion(context, question);
  }

  /**
   * Check compliance status
   */
  async checkCompliance(
    businessDescription: string,
    sector: string,
    applicableClauses: string[]
  ): Promise<ComplianceCheck> {
    if (this.useOpenAI) {
      const prompt = `Analyze compliance for a ${sector} business with this description: "${businessDescription}"

Applicable regulatory requirements:
${applicableClauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

Return a JSON object with:
- isCompliant: boolean
- riskLevel: "low" | "medium" | "high" | "critical"
- missingRequirements: string[]
- recommendations: string[]
- relevantClauses: string[] (indices of most relevant clauses)`;

      try {
        const response = await this.openai.generateCompletion(prompt);
        const parsed = JSON.parse(response);
        return {
          isCompliant: parsed.isCompliant || false,
          riskLevel: parsed.riskLevel || 'medium',
          missingRequirements: parsed.missingRequirements || [],
          recommendations: parsed.recommendations || [],
          relevantClauses: parsed.relevantClauses || [],
        };
      } catch (error) {
        console.error('Compliance check failed:', error);
      }
    }

    // Basic fallback compliance check
    const keywords = this.extractKeywords(businessDescription);
    const missingRequirements: string[] = [];
    
    const requiredKeywords = ['data protection', 'consent', 'security', 'privacy'];
    for (const kw of requiredKeywords) {
      if (!keywords.includes(kw)) {
        missingRequirements.push(`No mention of ${kw} found`);
      }
    }

    return {
      isCompliant: missingRequirements.length === 0,
      riskLevel: missingRequirements.length > 3 ? 'high' : 'medium',
      missingRequirements,
      recommendations: ['Review regulatory requirements carefully', 'Implement missing security measures'],
      relevantClauses: applicableClauses.slice(0, 3),
    };
  }

  /**
   * Extract entities from regulatory text
   */
  async extractEntities(text: string) {
    return await this.huggingface.extractEntities(text);
  }
}

// ============================================
// EXPORT SINGLETON INSTANCE
// ============================================

// Create and export a singleton instance
export const aiClient = new AIClient();