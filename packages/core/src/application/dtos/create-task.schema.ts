import { z } from 'zod';

export const CreateTaskSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  notes: z.string()
    .max(2000, 'Notes must be less than 2000 characters')
    .optional(),
  autoEnhance: z.boolean().optional(),
  priority: z.number()
    .int('Priority must be an integer')
    .min(1, 'Priority must be between 1 and 3')
    .max(3, 'Priority must be between 1 and 3')
    .optional(),
  dueDate: z.string()
    .datetime('Invalid date format, expected ISO 8601')
    .optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
