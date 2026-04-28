import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productoService } from '../services/productoService';
import type { ProductoUpdate } from '../types';

export function useProductos(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient();
  const offset = (page - 1) * limit;

  const productosQuery = useQuery({
    queryKey: ['productos', page, limit],
    queryFn: () => productoService.getAll(offset, limit, true),
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
      queryClient.invalidateQueries({ queryKey: ['producto'] });
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
