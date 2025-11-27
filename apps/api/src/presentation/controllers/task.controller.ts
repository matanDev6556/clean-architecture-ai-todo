import { Request, Response, NextFunction } from 'express';
import { 
  CreateTaskUseCase, 
  ListTasksUseCase, 
  EnhanceTaskUseCase, 
  UpdateTaskUseCase,
  DeleteTaskUseCase,
  CreateTaskSchema,
  ValidationError
} from '@todo/core';

export class TaskController {
  constructor(
    private createTaskUseCase: CreateTaskUseCase,
    private listTasksUseCase: ListTasksUseCase,
    private enhanceTaskUseCase: EnhanceTaskUseCase,
    private updateTaskUseCase: UpdateTaskUseCase,
    private deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, priority, search } = req.query;
      const tasks = await this.listTasksUseCase.execute({
        status: status as string,
        priority: priority ? Number(priority) : undefined,
        search: search as string,
      });
      res.json(tasks);
    } catch (error) {
      next(error);
    }
  };

  enhance = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('Task ID is required');
      }

      const task = await this.enhanceTaskUseCase.execute(id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('Task ID is required');
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        throw new ValidationError('Update data is required');
      }

      const task = await this.updateTaskUseCase.execute(id, req.body);
      res.json(task);
    } catch (error) {
      next(error);
    }
  }

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      
      if (!id) {
        throw new ValidationError('Task ID is required');
      }

      await this.deleteTaskUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
