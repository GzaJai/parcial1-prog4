import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ingredienteService } from '../services/ingredienteService';
import type { IngredienteCreate, IngredienteUpdate } from '../types';

export function useIngredientes() {
  const queryClient = useQueryClient();

  const ingredientesQuery = useQuery({
    queryKey: ['ingredientes'],
    queryFn: ingredienteService.getAll,
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
