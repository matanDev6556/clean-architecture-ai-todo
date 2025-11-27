import { TaskRepository, Task, TaskCreationParams } from '@todo/core';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Map<string, Task> = new Map();

  async create(dto: TaskCreationParams): Promise<Task> {
    const id = Math.random().toString(36).substring(7);
    const task: Task = {
      id,
      title: dto.title,
      notes: dto.notes,
      enhancedDescription: dto.enhancedDescription,
      isAiGenerated: dto.isAiGenerated,
      priority: dto.priority,
      dueDate: dto.dueDate,
      status: 'open',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.set(id, task);
    return task;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) || null;
  }

  async findAll(filter?: { status?: string; priority?: number; search?: string }): Promise<Task[]> {
    let allTasks = Array.from(this.tasks.values());

    if (filter) {
      if (filter.status) {
        allTasks = allTasks.filter((t) => t.status === filter.status);
      }
      if (filter.priority) {
        allTasks = allTasks.filter((t) => t.priority === filter.priority);
      }
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        allTasks = allTasks.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            t.notes?.toLowerCase().includes(searchLower)
        );
      }
    }

    return allTasks.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const task = this.tasks.get(id);
    if (!task) throw new Error(`Task ${id} not found`);

    const updatedTask = { ...task, ...updates, updatedAt: new Date() };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    this.tasks.delete(id);
  }
}
