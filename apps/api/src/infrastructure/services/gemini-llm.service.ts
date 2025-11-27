import { GoogleGenerativeAI } from '@google/generative-ai';
import { LLMService } from '@todo/core';
import { z } from 'zod';

export class GeminiLLMService implements LLMService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel(
        { 
            model: 'gemini-2.0-flash' ,
            generationConfig: {
            responseMimeType: "application/json", 
      }});
  }

  async generateJson<T>(prompt: string, schema: z.ZodType<T, any, any>): Promise<T> {
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
     
      const json = JSON.parse(text);
      
      // Validate with Zod
      return schema.parse(json);
    } catch (error) {
      console.error('Gemini API Error:', error);

      throw new Error('Failed to generate JSON with AI');
    }
  }
}


