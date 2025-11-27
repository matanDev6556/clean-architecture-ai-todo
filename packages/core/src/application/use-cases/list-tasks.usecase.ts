import { TaskRepository } from '../ports/task-repository.interface';
import { Task } from '../entities/task.entity';

export class ListTasksUseCase {
  constructor(private taskRepo: TaskRepository) {}

  async execute(filter?: { status?: string; priority?: number; search?: string }): Promise<Task[]> {
    return this.taskRepo.findAll(filter);
  }
}
