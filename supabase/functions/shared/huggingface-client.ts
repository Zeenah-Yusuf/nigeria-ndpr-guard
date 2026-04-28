// supabase/functions/shared/ai-service.ts
// Unified AI service that intelligently uses both OpenAI and HuggingFace
// OpenAI for complex tasks, HuggingFace for free simple tasks

import { getChatCompletion, getEmbedding, classifyRegulatoryText, summarizeRegulatoryText, isOpenAIAvailable } from './openai-client.ts';
import { hfClient } from './huggingface-client.ts';

export class AIService {
  private useOpenAI: boolean;
  private useHuggingFace: boolean;

  constructor() {
    this.useOpenAI = isOpenAIAvailable();
    this.useHuggingFace = hfClient.isConfigured();
    
    console.log('🤖 AI Service Status:');
    console.log(`   OpenAI: ${this.useOpenAI ? '✅' : '❌'}`);
    console.log(`   HuggingFace: ${this.useHuggingFace ? '✅' : '❌'}`);
  }

  /**
   * Get embedding (uses OpenAI as primary)
   */
  async getEmbedding(text: string): Promise<number[]> {
    if (this.useOpenAI) {
      return await getEmbedding(text);
    }
    throw new Error('No embedding service available. Configure OPENAI_API_KEY.');
  }

  /**
   * Summarize text (tries OpenAI first, falls back to HuggingFace free)
   */
  async summarizeText(text: string): Promise<string> {
    if (this.useOpenAI) {
      try {
        return await summarizeRegulatoryText(text);
      } catch (error) {
        console.log('OpenAI summarization failed, trying HuggingFace...');
      }
    }
    
    if (this.useHuggingFace) {
      try {
        return await hfClient.summarizeText(text);
      } catch (error) {
        console.log('HuggingFace summarization failed');
      }
    }
    
    // Ultimate fallback
    return text.substring(0, 200) + '...';
  }

  /**
   * Classify regulatory text
   */
  async classifyText(text: string): Promise<{
    clause_type: string;
    keywords: string[];
    sectors: string[];
  }> {
    if (this.useOpenAI) {
      try {
        return await classifyRegulatoryText(text);
      } catch (error) {
        console.log('OpenAI classification failed, using pattern matching...');
      }
    }
    
    // Free pattern matching as fallback
    return {
      clause_type: 'general',
      keywords: this.useHuggingFace ? hfClient.extractKeywords(text) : [],
      sectors: this.useHuggingFace ? hfClient.detectSectors(text) : ['general'],
    };
  }

  /**
   * Get keywords (FREE pattern matching)
   */
  extractKeywords(text: string): string[] {
    return hfClient.extractKeywords(text);
  }

  /**
   * Get sectors (FREE pattern matching)
   */
  detectSectors(text: string): string[] {
    return hfClient.detectSectors(text);
  }

  /**
   * Extract entities (FREE regex-based)
   */
  extractEntities(text: string) {
    return hfClient.extractEntities(text);
  }

  /**
   * Generate compliance report using OpenAI
   */
  async generateComplianceReport(
    companyInfo: any,
    applicableClauses: any[],
    sector: string
  ): Promise<string> {
    if (!this.useOpenAI) {
      return 'OpenAI API key required for report generation.';
    }

    const systemPrompt = `You are a Nigerian regulatory compliance expert. Generate a detailed compliance report in JSON format.`;
    
    const userPrompt = `
Company: ${companyInfo.name}
Sector: ${sector}
Size: ${companyInfo.size}

Applicable Regulations:
${applicableClauses.map((c, i) => `${i + 1}. [${c.framework_name}] ${c.title}: ${c.content.substring(0, 200)}`).join('\n')}

Generate a JSON compliance report with:
{
  "overallRiskLevel": "low|medium|high|critical",
  "summary": "brief summary",
  "findings": [
    {
      "clause": "clause reference",
      "status": "compliant|non_compliant|needs_review",
      "risk": "low|medium|high",
      "recommendation": "what to do"
    }
  ],
  "nextSteps": ["step 1", "step 2"]
}`;

    try {
      const response = await getChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        { temperature: 0.3, maxTokens: 1500, jsonResponse: true }
      );
      
      return response;
    } catch (error) {
      console.error('Report generation failed:', error);
      throw error;
    }
  }

  /**
   * Answer regulatory questions
   */
  async answerQuestion(question: string, context: string): Promise<string> {
    if (this.useOpenAI) {
      const systemPrompt = `You are RegTrack AI, a Nigerian regulatory compliance assistant. Answer questions based on the provided regulatory context. Be clear, concise, and accurate. If the context doesn't contain the answer, say so.`;
      
      try {
        return await getChatCompletion([
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context: ${context.substring(0, 2000)}\n\nQuestion: ${question}` }
        ]);
      } catch (error) {
        console.log('OpenAI Q&A failed, trying HuggingFace...');
      }
    }
    
    if (this.useHuggingFace) {
      try {
        const result = await hfClient.answerQuestion(context, question);
        if (result.score > 0.3) {
          return result.answer;
        }
      } catch (error) {
        console.log('HuggingFace Q&A failed');
      }
    }
    
    return 'I am unable to answer this question at the moment. Please try again later.';
  }
}

// Export singleton
export const aiService = new AIService();