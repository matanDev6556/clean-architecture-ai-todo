import { Task, TaskCreationParams } from '../domain/entities/task.entity';

export interface TaskRepository {
  create(task: TaskCreationParams): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(filter?: { status?: string; priority?: number; search?: string }): Promise<Task[]>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
}
