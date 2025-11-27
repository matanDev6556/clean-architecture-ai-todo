import { TaskRepository } from '../ports/task-repository.interface';
import { Task } from '../entities/task.entity';

export class UpdateTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}

  async execute(id: string, updates: Partial<Task>): Promise<Task> {
    return this.taskRepo.update(id, updates);
  }
}
