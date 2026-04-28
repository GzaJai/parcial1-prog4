import api from './api';
import type { Categoria, CategoriaCreate, CategoriaUpdate } from '../types';

export const categoriaService = {
  getAll: async () => {
    const { data } = await api.get<Categoria[]>('/categorias/');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Categoria>(`/categorias/${id}`);
    return data;
  },
  create: async (categoria: CategoriaCreate) => {
    const { data } = await api.post<Categoria>('/categorias/', categoria);
    return data;
  },
  update: async (id: number, categoria: CategoriaUpdate) => {
    const { data } = await api.patch<Categoria>(`/categorias/${id}`, categoria);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/categorias/${id}`);
  },
};
