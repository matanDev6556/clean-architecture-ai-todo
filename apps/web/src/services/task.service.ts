import { Task, CreateTaskDTO } from '../types';

const API_URL = 'http://localhost:3000/api';

export const taskService = {
  async fetchTasks(filter?: { status?: string; search?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);
    
    const res = await fetch(`${API_URL}/tasks?${params}`);
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete task');
  },

  async enhanceTask(id: string): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}/enhance`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to enhance task');
    return res.json();
  },
};
