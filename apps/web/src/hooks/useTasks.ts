import { useState, useEffect } from 'react';
import { Task, CreateTaskDTO } from '../types';
import { taskService } from '../services/task.service';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async (filter?: { status?: string; search?: string }) => {
    setLoading(true);
    try {
      const data = await taskService.fetchTasks(filter);
      setTasks(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (dto: CreateTaskDTO) => {
    try {
      await taskService.createTask(dto);
      await fetchTasks(); // Refresh list
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(id, updates);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const enhanceTask = async (id: string) => {
    try {
      await taskService.enhanceTask(id);
      await fetchTasks();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask, enhanceTask };
}
