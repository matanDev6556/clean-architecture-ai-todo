export type TaskStatus = 'open' | 'done';

export interface Task {
  id: string;
  title: string;
  notes?: string;
  enhancedDescription?: string;
  isAiGenerated?: boolean;
  status: TaskStatus;
  priority?: number; // 1 (high) .. 3 (low)
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCreationParams {
  title: string;
  notes?: string;
  enhancedDescription?: string;
  isAiGenerated?: boolean;
  priority?: number;
  dueDate?: Date;
}
