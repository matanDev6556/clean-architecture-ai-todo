import { TaskRepository } from '../../domain/ports/task-repository.interface';
import { LLMService } from '../../domain/ports/llm-provider.interface';
import { Task } from '../../domain/entities/task.entity';
import { LLMResponseSchema } from '../../application/dtos/llm-response.schema';
import ENHANCE_TASK_PROMPT from '../prompts/task-enhancement.prompt';

export class EnhanceTaskUseCase {
  constructor(
    private taskRepo: TaskRepository,
    private llmService: LLMService
  ) {}

  async execute(taskId: string): Promise<Task> {
    const task = await this.taskRepo.findById(taskId);
    if (!task) {
      throw new Error(`Task with id ${taskId} not found`);
    }

    const prompt = ENHANCE_TASK_PROMPT(task.title, task.notes);
    const enhancement = await this.llmService.generateJson(prompt, LLMResponseSchema);
    
    return this.taskRepo.update(taskId, {
      enhancedDescription: JSON.stringify(enhancement),
      isAiGenerated: true,
    });
  }
}
