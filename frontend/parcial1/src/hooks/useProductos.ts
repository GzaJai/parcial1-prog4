import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/productoService';
import type { Producto, ProductoCreate, ProductoUpdate } from '../types';

export function useProductos() {
  const queryClient = useQueryClient();

  const productosQuery = useQuery({
    queryKey: ['productos'],
    queryFn: () => productoService.getAll(true),
  });

  const createMutation = useMutation({
    mutationFn: productoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProductoUpdate }) => 
      productoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['producto'] }); // Invalidate detail view too
    },
  });

  const deleteMutation = useMutation({
    mutationFn: productoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  return {
    productosQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
