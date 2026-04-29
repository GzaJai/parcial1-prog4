import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredienteService } from '../services/ingredienteService';
import type { IngredienteUpdate } from '../types';

export function useIngredientes(page?: number, limit?: number) {
  const queryClient = useQueryClient();
  const offset = page && limit ? (page - 1) * limit : 0;

  const ingredientesQuery = useQuery({
    queryKey: ['ingredientes', page, limit],
    queryFn: () => ingredienteService.getAll(offset, limit),
  });

  const createMutation = useMutation({
    mutationFn: ingredienteService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: IngredienteUpdate }) =>
      ingredienteService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ingredienteService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
    },
  });

  return {
    ingredientesQuery,
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
