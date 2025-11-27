import { PrismaClient, Task as PrismaTask } from '@prisma/client';
import { TaskRepository, Task, TaskCreationParams } from '@todo/core';

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  private mapToEntity(pTask: PrismaTask): Task {
    return {
      ...pTask,
      status: pTask.status as 'open' | 'done',
      notes: pTask.notes ?? undefined,
      enhancedDescription: pTask.enhancedDescription ?? undefined,
      priority: pTask.priority ?? undefined,
      dueDate: pTask.dueDate ?? undefined,
    };
  }

  async create(dto: TaskCreationParams): Promise<Task> {
    const pTask = await this.prisma.task.create({
      data: {
        title: dto.title,
        notes: dto.notes,
        priority: dto.priority,
        dueDate: dto.dueDate,
        status: 'open',
      },
    });
    return this.mapToEntity(pTask);
  }

  async findById(id: string): Promise<Task | null> {
    const pTask = await this.prisma.task.findUnique({ where: { id } });
    return pTask ? this.mapToEntity(pTask) : null;
  }

  async findAll(filter?: { status?: string; priority?: number; search?: string }): Promise<Task[]> {
    const where: any = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.priority) where.priority = filter.priority;
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search } },
        { notes: { contains: filter.search } },
      ];
    }

    const pTasks = await this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return pTasks.map(this.mapToEntity);
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const pTask = await this.prisma.task.update({
      where: { id },
      data: {
        ...updates,
        status: updates.status, // Ensure type compatibility if needed
      },
    });
    return this.mapToEntity(pTask);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.task.delete({ where: { id } });
  }
}
