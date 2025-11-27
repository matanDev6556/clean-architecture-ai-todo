import { Request, Response } from 'express';
import { 
  CreateTaskUseCase, 
  ListTasksUseCase, 
  EnhanceTaskUseCase, 
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CreateTaskSchema
} from '@todo/core';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private listTasksUseCase: ListTasksUseCase,
    private enhanceTaskUseCase: EnhanceTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  create = async (req: Request, res: Response) => {
    try {
      const validatedData = CreateTaskSchema.parse(req.body);
      const { autoEnhance, ...taskData } = validatedData;
      
      const task = await this.createTaskUseCase.execute(
        { 
          ...taskData, 
          dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined 
        },
        autoEnhance
      );
      res.status(201).json(task);
    } catch (error) {
      // Zod error handling could be improved here, but for now generic error
      res.status(400).json({ error: (error as Error).message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const { status, priority, search } = req.query;
      const tasks = await this.listTasksUseCase.execute({
        status: status as string,
        priority: priority ? Number(priority) : undefined,
        search: search as string,
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  enhance = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const task = await this.enhanceTaskUseCase.execute(id);
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const task = await this.updateTaskUseCase.execute(id, req.body);
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
  }

  delete = async (req: Request, res: Response) => {
      try {
          const { id } = req.params;
          await this.deleteTaskUseCase.execute(id);
          res.status(204).send();
      } catch (error) {
          res.status(500).json({ error: (error as Error).message });
      }
  }
}
