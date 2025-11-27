import { CreateTaskDTO as CoreCreateTaskDTO, LLMResponseDTO } from '@todo/core';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  enhancedDescription?: string;
  isAiGenerated?: boolean;
  status: 'open' | 'done';
  priority?: number;
  dueDate?: string;
  createdAt: string;
}

export type CreateTaskDTO = CoreCreateTaskDTO;
export type LLMResponse = LLMResponseDTO;
