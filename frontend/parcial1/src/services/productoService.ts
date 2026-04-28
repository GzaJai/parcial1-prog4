import api from './api';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types';

export const productoService = {
  getAll: async (disponible: boolean = true) => {
    const { data } = await api.get<Producto[]>('/productos/', {
      params: { disponible },
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
