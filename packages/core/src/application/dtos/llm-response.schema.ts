import { z } from 'zod';

export const LLMResponseSchema = z.object({
  summary: z.string(),
  steps: z.array(z.string()),
  risks: z.array(z.string()),
  estimateHours: z.number(),
});

export type LLMResponseDTO = z.infer<typeof LLMResponseSchema>;
