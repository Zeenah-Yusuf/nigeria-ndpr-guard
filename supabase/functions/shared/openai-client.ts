// supabase/functions/shared/openai-client.ts
// OpenAI client helper for Supabase Edge Functions
// KEEP THIS FILE - It's your primary AI service

import OpenAI from "https://esm.sh/openai@4";

let openaiInstance: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiInstance) {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }
    openaiInstance = new OpenAI({ apiKey });
  }
  return openaiInstance;
}

export async function getChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  options?: { temperature?: number; maxTokens?: number; jsonResponse?: boolean }
): Promise<string> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Most cost-effective GPT-4 model
      messages,
      temperature: options?.temperature ?? 0.3,
      max_tokens: options?.maxTokens ?? 800,
      response_format: options?.jsonResponse ? { type: 'json_object' } : undefined,
    });
    
    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI chat completion error:', error);
    throw error;
  }
}

export async function getEmbedding(text: string): Promise<number[]> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000), // Respect token limits
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('OpenAI embedding error:', error);
    throw error;
  }
}

// ============================================
// NEW ADDITIONS TO YOUR EXISTING CLIENT
// ============================================

/**
 * Generate multiple embeddings in batch (more efficient)
 */
export async function getBatchEmbeddings(texts: string[]): Promise<number[][]> {
  const openai = getOpenAIClient();
  
  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: texts.map(t => t.substring(0, 8000)),
    });
    
    return response.data.map(d => d.embedding);
  } catch (error) {
    console.error('OpenAI batch embedding error:', error);
    throw error;
  }
}

/**
 * Classify regulatory text using GPT-4o-mini
 */
export async function classifyRegulatoryText(text: string): Promise<{
  clause_type: string;
  confidence: number;
  keywords: string[];
  sectors: string[];
}> {
  const prompt = `You are a Nigerian regulatory compliance expert. Analyze this text and return a JSON object:

{
  "clause_type": "obligation|penalty|definition|procedure|principle|requirement|prohibition|right|exception|general",
  "keywords": ["keyword1", "keyword2"],
  "sectors": ["fintech", "healthtech", "ecommerce", "edtech", "agritech", "enterprise", "social_media"]
}

Text to analyze: ${text.substring(0, 1500)}`;

  try {
    const response = await getChatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.1, jsonResponse: true }
    );
    
    const parsed = JSON.parse(response);
    return {
      clause_type: parsed.clause_type || 'general',
      confidence: 0.9, // GPT-4o-mini is highly confident for classification
      keywords: parsed.keywords || [],
      sectors: parsed.sectors || ['general'],
    };
  } catch (error) {
    console.error('Classification failed:', error);
    return {
      clause_type: 'general',
      confidence: 0,
      keywords: [],
      sectors: [],
    };
  }
}

/**
 * Summarize regulatory text
 */
export async function summarizeRegulatoryText(text: string): Promise<string> {
  const prompt = `Summarize the following Nigerian regulatory text in 2-3 clear, simple sentences. Focus on key obligations and requirements:\n\n${text.substring(0, 2000)}`;

  try {
    return await getChatCompletion(
      [{ role: 'user', content: prompt }],
      { temperature: 0.3, maxTokens: 200 }
    );
  } catch (error) {
    console.error('Summarization failed:', error);
    return text.substring(0, 200) + '...';
  }
}

/**
 * Check if OpenAI is available
 */
export function isOpenAIAvailable(): boolean {
  try {
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    return !!apiKey;
  } catch {
    return false;
  }
}