import { 
  CreateTaskUseCase, 
  ListTasksUseCase, 
  EnhanceTaskUseCase, 
  UpdateTaskUseCase, 
  DeleteTaskUseCase 
} from '@todo/core';
import { TaskController } from '../presentation/controllers/task.controller';
import { InMemoryTaskRepository } from '../infrastructure/repositories/in-memory-task.repository';
import { GeminiLLMService } from '../infrastructure/services/gemini-llm.service';
import { MockLLMService } from '../infrastructure/services/mock-llm.service';
import { config } from 'dotenv';

// Ensure env vars are loaded
config();

export class CompositionRoot {
  private static instance: CompositionRoot;
  
  public taskController: TaskController;

  private constructor() {
    // 1. Instantiate Adapters (Infrastructure)
    const taskRepo = new InMemoryTaskRepository();
    
    const apiKey = process.env.GEMINI_API_KEY;
    const llmService = apiKey 
      ? new GeminiLLMService(apiKey) 
      : new MockLLMService();

    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found, using MockLLMService');
    } else {
      console.log('Using GeminiLLMService');
    }

    // 2. Instantiate Use Cases (Application)
    const createTaskUseCase = new CreateTaskUseCase(taskRepo, llmService);
    const listTasksUseCase = new ListTasksUseCase(taskRepo);
    const enhanceTaskUseCase = new EnhanceTaskUseCase(taskRepo, llmService);
    const updateTaskUseCase = new UpdateTaskUseCase(taskRepo);
    const deleteTaskUseCase = new DeleteTaskUseCase(taskRepo);

    // 3. Instantiate Controllers (Presentation)
    this.taskController = new TaskController(
      createTaskUseCase,
      listTasksUseCase,
      enhanceTaskUseCase,
      updateTaskUseCase,
      deleteTaskUseCase
    );
  }

  public static getInstance(): CompositionRoot {
    if (!CompositionRoot.instance) {
      CompositionRoot.instance = new CompositionRoot();
    }
    return CompositionRoot.instance;
  }
}
