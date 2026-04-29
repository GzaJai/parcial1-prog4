import api from './api';
import type { Producto, ProductoCreate, ProductoUpdate, PaginatedResponse } from '../types';

export const productoService = {
  getAll: async (offset: number = 0, limit?: number, disponible: boolean = true) => {
    const { data } = await api.get<PaginatedResponse<Producto>>('/productos/', {
      params: { offset, limit, disponible },
    });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<Producto>(`/productos/${id}`);
    return data;
  },
  create: async (producto: ProductoCreate) => {
    const { data } = await api.post<Producto>('/productos/', producto);
    return data;
  },
  update: async (id: number, producto: ProductoUpdate) => {
    const { data } = await api.patch<Producto>(`/productos/${id}`, producto);
    return data;
  },
  delete: async (id: number) => {
    await api.delete(`/productos/${id}`);
  },
};
