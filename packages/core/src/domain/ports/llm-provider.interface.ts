import { z } from 'zod';

export interface LLMService {
  generateJson<T>(prompt: string, schema: z.ZodType<T, any, any>): Promise<T>;
}
