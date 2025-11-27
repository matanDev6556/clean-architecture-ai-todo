import { LLMService } from '@todo/core';
import { z } from 'zod';

export class MockLLMService implements LLMService {
  async generateJson<T>(prompt: string, schema: z.ZodType<T, any, any>): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For mock, we'll return a generic response that matches common schemas
    // In a real mock, you might parse the prompt to tailor the response
    const mockData: any = {
      summary: 'Mock AI-generated summary',
      steps: ['Step 1: Mock step', 'Step 2: Another mock step'],
      risks: ['Mock risk consideration'],
      estimateHours: 2,
    };

    return schema.parse(mockData);
  }
}
