import { describe, it, expect, vi } from 'vitest';
import { CreateTaskUseCase } from './create-task.usecase';
import { TaskRepository } from '../../domain/ports/task-repository.interface';

const mockRepo = {
  create: vi.fn((t) => Promise.resolve({ ...t, id: '1', createdAt: new Date(), updatedAt: new Date(), status: 'open' })),
} as unknown as TaskRepository;

describe('CreateTaskUseCase', () => {
  it('should create a task', async () => {
    const useCase = new CreateTaskUseCase(mockRepo);
    const result = await useCase.execute({ title: 'Test Task' });
    
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Task' }));
    expect(result.id).toBe('1');
  });

  it('should auto-enhance task if requested', async () => {
    const mockLLM = {
      generateJson: vi.fn().mockResolvedValue({ 
        summary: 'Enhanced',
        steps: ['Step 1'],
        risks: ['Risk 1'],
        estimateHours: 2
      }),
    };
    const useCase = new CreateTaskUseCase(mockRepo, mockLLM as any);
    
    await useCase.execute({ title: 'Task' }, true);
    
    expect(mockLLM.generateJson).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ 
      enhancedDescription: expect.any(String),
      isAiGenerated: true
    }));
  });
});
