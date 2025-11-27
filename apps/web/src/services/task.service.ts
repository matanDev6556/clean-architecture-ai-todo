import { Task, CreateTaskDTO } from '../types';

const API_URL = 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    let errorDetails;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
      errorDetails = errorData.details;
    } catch {
      // If JSON parsing fails, use default message
    }

    throw new ApiError(errorMessage, response.status, errorDetails);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

export const taskService = {
  async fetchTasks(filter?: { status?: string; search?: string }): Promise<Task[]> {
    const params = new URLSearchParams();
    if (filter?.status) params.append('status', filter.status);
    if (filter?.search) params.append('search', filter.search);
    
    const response = await fetch(`${API_URL}/tasks?${params}`);
    return handleResponse<Task[]>(response);
  },

  async createTask(dto: CreateTaskDTO): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    return handleResponse<Task>(response);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return handleResponse<Task>(response);
  },

  async deleteTask(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<void>(response);
  },

  async enhanceTask(id: string): Promise<Task> {
    const response = await fetch(`${API_URL}/tasks/${id}/enhance`, {
      method: 'POST',
    });
    return handleResponse<Task>(response);
  },
};
