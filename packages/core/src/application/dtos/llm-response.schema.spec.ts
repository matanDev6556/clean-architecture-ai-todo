import { describe, it, expect } from 'vitest';
import { LLMResponseSchema } from './llm-response.schema';

describe('LLMResponseSchema', () => {
  it('should validate a correct response', () => {
    const validResponse = {
      summary: 'A valid summary',
      steps: ['Step 1', 'Step 2'],
      risks: ['Risk 1'],
      estimateHours: 5,
    };

    const result = LLMResponseSchema.safeParse(validResponse);
    expect(result.success).toBe(true);
  });

  it('should fail if required fields are missing', () => {
    const invalidResponse = {
      summary: 'Missing fields',
      // steps missing
      // risks missing
      estimateHours: 5,
    };

    const result = LLMResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((i) => i.path.includes('steps'))).toBe(true);
      expect(result.error.issues.some((i) => i.path.includes('risks'))).toBe(true);
    }
  });

  it('should fail if types are incorrect', () => {
    const invalidResponse = {
      summary: 123, // Should be string
      steps: 'Not an array', // Should be array
      risks: [1, 2], // Should be string array
      estimateHours: '5', // Should be number
    };

    const result = LLMResponseSchema.safeParse(invalidResponse);
    expect(result.success).toBe(false);
  });
});
