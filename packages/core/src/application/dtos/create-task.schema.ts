import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  notes: z.string().optional(),
  autoEnhance: z.boolean().optional(),
  priority: z.number().min(1).max(3).optional(),
  dueDate: z.string().datetime().optional(), // Expect ISO string
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
