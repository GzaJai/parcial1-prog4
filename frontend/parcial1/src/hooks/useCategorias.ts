import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';
import type { CategoriaUpdate } from '../types';

export function useCategorias(page: number = 1, limit: number = 10) {
  const queryClient = useQueryClient();
  const offset = (page - 1) * limit;

  const categoriasQuery = useQuery({
    queryKey: ['categorias', page, limit],
    queryFn: () => categoriaService.getAll(offset, limit),
  });

  const createMutation = useMutation({
    mutationFn: categoriaService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoriaUpdate }) => 
      categoriaService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: categoriaService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] });
    },
  });

  return {
    categoriasQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
