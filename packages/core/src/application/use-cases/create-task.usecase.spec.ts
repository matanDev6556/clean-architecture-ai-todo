import { describe, it, expect, vi } from 'vitest';
import { CreateTaskUseCase } from './create-task.usecase';
import { TaskRepository } from '../ports/task-repository.interface';

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
      enhanceDescription: vi.fn().mockResolvedValue({ summary: 'Enhanced' }),
    };
    const useCase = new CreateTaskUseCase(mockRepo, mockLLM as any);
    
    await useCase.execute({ title: 'Task' }, true);
    
    expect(mockLLM.enhanceDescription).toHaveBeenCalled();
    expect(mockRepo.create).toHaveBeenCalledWith(expect.objectContaining({ 
      enhancedDescription: JSON.stringify({ summary: 'Enhanced' }) 
    }));
  });
});
