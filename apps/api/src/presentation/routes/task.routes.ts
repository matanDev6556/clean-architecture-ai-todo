// apps/api/src/routes/task.routes.ts
import { Router } from 'express';
import { TaskController } from '../presentation/controllers/task.controller'; 

export const createTaskRouter = (controller: TaskController) => {
  const router = Router();

  router.post('/', controller.create);
  router.get('/', controller.list);
  router.patch('/:id', controller.update);
  router.delete('/:id', controller.delete);
  
  // Custom Actions
  router.post('/:id/enhance', controller.enhance);

  return router;
};