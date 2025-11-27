import { TaskRepository } from '../../domain/ports/task-repository.interface';
import { LLMService } from '../../domain/ports/llm-provider.interface';
import { TaskCreationParams, Task } from '../../domain/entities/task.entity';
import { LLMResponseSchema } from '../../application/dtos/llm-response.schema';
import ENHANCE_TASK_PROMPT from '../prompts/task-enhancement.prompt';

export class CreateTaskUseCase {
  constructor(
    private taskRepo: TaskRepository,
    private llmService?: LLMService
  ) {}

  async execute(dto: TaskCreationParams, autoEnhance: boolean = false): Promise<Task> {
    let enhancedDescription: string | undefined;

    if (autoEnhance && this.llmService) {
      try {
        const prompt = ENHANCE_TASK_PROMPT(dto.title, dto.notes);
        const enhancement = await this.llmService.generateJson(prompt, LLMResponseSchema);
        enhancedDescription = JSON.stringify(enhancement);
      } catch (error) {
        console.warn('Failed to auto-enhance task:', error);
      }
    }

    return this.taskRepo.create({
      ...dto,
      enhancedDescription,
      isAiGenerated: !!enhancedDescription,
    });
  }
}
