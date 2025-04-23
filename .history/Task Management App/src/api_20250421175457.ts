import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

export interface Task {
  _id?: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export const fetchTasks = () => API.get<Task[]>('/tasks');
export const createTask = (task: Task) => API.post<Task>('/tasks', task);
export const updateTask = (id: string, task: Partial<Task>) => API.patch(`/tasks/${id}`, task);
export const deleteTask = (id: string) => API.delete(`/tasks/${id}`);
