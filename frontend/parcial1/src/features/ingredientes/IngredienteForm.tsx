import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useIngredientes } from '../../hooks/useIngredientes';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { AlertTriangle, Info } from 'lucide-react';
import type { Ingrediente, IngredienteCreate } from '../../types';

interface IngredienteFormProps {
  initialData?: Ingrediente | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function IngredienteForm({ initialData, onSuccess, onCancel }: IngredienteFormProps) {
  const queryClient = useQueryClient();
  const { createMutation, updateMutation } = useIngredientes();
  
  const [formData, setFormData] = useState<IngredienteCreate>({
    nombre: initialData?.nombre || '',
    es_alergeno: initialData?.es_alergeno || false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['ingredientes'] });
        onSuccess();
      }
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: formData }, options);
    } else {
      createMutation.mutate(formData, options);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <Input 
          label="Nombre del Ingrediente"
          required
          placeholder="Ej: Gluten, Leche, Tomate..."
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        
        <div 
          onClick={() => setFormData({ ...formData, es_alergeno: !formData.es_alergeno })}
          className={`p-6 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center gap-4 group ${
            formData.es_alergeno 
              ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30' 
              : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
          }`}
        >
          <div className={`p-3 rounded-2xl transition-all ${
            formData.es_alergeno ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'bg-white dark:bg-slate-900 text-slate-400 group-hover:scale-110'
          }`}>
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className={`font-black text-sm uppercase tracking-tight ${formData.es_alergeno ? 'text-amber-900 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>
              Marcar como Alérgeno
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Este ingrediente aparecerá resaltado con advertencias en la visualización de productos.
            </p>
          </div>
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            formData.es_alergeno ? 'border-amber-500 bg-amber-500' : 'border-slate-200 dark:border-slate-800'
          }`}>
            {formData.es_alergeno && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl">
          <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-700 dark:text-blue-400 leading-relaxed font-medium">
            La correcta identificación de alérgenos es crítica para la seguridad alimentaria de los clientes.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          variant="cyan" 
          type="submit" 
          isLoading={createMutation.isPending || updateMutation.isPending}
          className="px-10"
        >
          {initialData ? 'Guardar Cambios' : 'Registrar Ingrediente'}
        </Button>
      </div>
    </form>
  );
}
