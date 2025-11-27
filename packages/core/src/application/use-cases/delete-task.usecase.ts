import { TaskRepository } from '../ports/task-repository.interface';

export class DeleteTaskUseCase {
  constructor(private taskRepo: TaskRepository) {}

  async execute(id: string): Promise<void> {
    return this.taskRepo.delete(id);
  }
}
