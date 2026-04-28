import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCategorias } from '../../hooks/useCategorias';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/shared/ImageUploader';
import { getImageUrl } from '../../utils/format';
import type { Categoria, CategoriaCreate } from '../../types';

interface CategoriaFormProps {
  initialData?: Categoria | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoriaForm({ initialData, onSuccess, onCancel }: CategoriaFormProps) {
  const queryClient = useQueryClient();
  const { createMutation, updateMutation } = useCategorias();
  
  const [formData, setFormData] = useState<CategoriaCreate>({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    imagen_url: initialData?.imagen_url || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const options = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categorias'] });
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input 
          label="Nombre de la Categoría"
          required
          placeholder="Ej: Bebidas, Entradas..."
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
        />
        
        <ImageUploader 
          label="Imagen de la Categoría"
          onUploadSuccess={(url) => setFormData({ ...formData, imagen_url: url })}
        />
        
        {formData.imagen_url && (
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
              <img src={getImageUrl(formData.imagen_url)} className="w-full h-full object-cover" alt="Actual" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">URL de imagen actual</p>
              <p className="text-[10px] text-slate-500 truncate">{formData.imagen_url}</p>
            </div>
          </div>
        )}

        <Input 
          label="Descripción (Opcional)"
          isTextArea
          placeholder="Describa el propósito de esta categoría..."
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
        />
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
        <Button variant="ghost" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button 
          variant="cyan" 
          type="submit" 
          isLoading={createMutation.isPending || updateMutation.isPending}
        >
          {initialData ? 'Guardar Cambios' : 'Crear Categoría'}
        </Button>
      </div>
    </form>
  );
}
