import api from './api';
import type { Ingrediente, IngredienteCreate, IngredienteUpdate } from '../types';

export const ingredienteService = {
  getAll: async () => {
    const { data } = await api.get<Ingrediente[]>('/ingredientes/');
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
