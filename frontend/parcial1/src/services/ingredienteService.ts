import api from './api';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate, PaginatedResponse } from '../types';

export const ingredienteService = {
  getAll: async (offset: number = 0, limit: number = 10) => {
    const { data } = await api.get<PaginatedResponse<Ingrediente>>('/ingredientes/', {
      params: { offset, limit },
    });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Ingrediente>(`/ingredientes/${id}`);
    return data;
  },
  create: async (ingrediente: IngredienteCreate) => {
    const { data } = await api.post<Ingrediente>('/ingredientes/', ingrediente);
    return data;
  },
  update: async (id: number, ingrediente: IngredienteUpdate) => {
    const { data } = await api.patch<Ingrediente>(`/ingredientes/${id}`, ingrediente);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/ingredientes/${id}`);
  },
};
