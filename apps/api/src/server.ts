import express from 'express';
import cors from 'cors';
import { CompositionRoot } from './config/composition-root';
import { createTaskRouter } from './presentation/routes/task.routes';
import { errorHandler } from './presentation/middlewares/error-handler';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize Composition Root
const { taskController } = CompositionRoot.getInstance();

// Routes
app.use('/api/tasks', createTaskRouter(taskController));

// Error handling middleware (must be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
