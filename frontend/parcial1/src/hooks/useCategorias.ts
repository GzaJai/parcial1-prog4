import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriaService } from '../services/categoriaService';
import type { CategoriaCreate, CategoriaUpdate } from '../types';

export function useCategorias() {
  const queryClient = useQueryClient();

  const categoriasQuery = useQuery({
    queryKey: ['categorias'],
    queryFn: categoriaService.getAll,
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
