import axios from 'axios';
import { Job, JobFormData } from '../types/job';

const api = axios.create({
  baseURL: '/api/jobs',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const jobApi = {
  getAll: async (): Promise<Job[]> => {
    const { data } = await api.get('');
    return data;
  },

  getById: async (id: number): Promise<Job> => {
    const { data } = await api.get(`/${id}`);
    return data;
  },

  create: async (job: JobFormData): Promise<Job> => {
    const { data } = await api.post('', job);
    return data;
  },

  update: async (job: JobFormData): Promise<Job> => {
    const { data } = await api.put('', job);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/${id}`);
  },

  getByStatus: async (status: string): Promise<Job[]> => {
    const { data } = await api.get(`/status/${status}`);
    return data;
  },
}; 