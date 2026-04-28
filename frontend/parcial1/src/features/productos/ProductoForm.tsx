import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProductos } from '../../hooks/useProductos';
import { useCategorias } from '../../hooks/useCategorias';
import { useIngredientes } from '../../hooks/useIngredientes';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Input'; // Oops, Badge was in Input.tsx, I'll fix that later or just import from there
import ImageUploader from '../../components/shared/ImageUploader';
import { getImageUrl } from '../../utils/format';
import { AlertTriangle, X, Info } from 'lucide-react';
import type { Producto, ProductoCreate } from '../../types';

interface ProductoFormProps {
  initialData?: Producto | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductoForm({ initialData, onSuccess, onCancel }: ProductoFormProps) {
  const queryClient = useQueryClient();
  const { categoriasQuery } = useCategorias(1, 1000); // Fetch all for select
  const { ingredientesQuery } = useIngredientes(1, 1000); // Fetch all for select
  const { createMutation, updateMutation } = useProductos();
  
  const [formData, setFormData] = useState<ProductoCreate>({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    precio_base: Number(initialData?.precio_base) || 0,
    imagenes_url: initialData?.imagenes_url || [],
    stock_cantidad: initialData?.stock_cantidad || 0,
    disponible: initialData?.disponible ?? true,
    categoria_ids: initialData?.categorias?.map(c => c.id) || [],
    ingrediente_ids: initialData?.ingredientes?.map(i => i.id) || []
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const submissionData = {
      ...formData,
      precio_base: Number(formData.precio_base),
      stock_cantidad: Number(formData.stock_cantidad)
    };

    const options = {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['productos'] });
        onSuccess();
      },
      onError: (err: any) => {
        setServerError("Ocurrió un error al guardar el producto. Verifique los datos.");
      }
    };

    if (initialData) {
      updateMutation.mutate({ id: initialData.id, data: submissionData }, options);
    } else {
      createMutation.mutate(submissionData, options);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {serverError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-xs font-bold">
          <AlertTriangle size={18} />
          {serverError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Input 
            label="Nombre del Producto"
            required
            placeholder="Ej: Hamburguesa Clásica"
            value={formData.nombre}
            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
          />
          
          <Input 
            label="Descripción"
            isTextArea
            placeholder="Detalles del producto, ingredientes principales..."
            value={formData.descripcion}
            onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input 
              label="Precio ($)"
              type="number"
              step="0.01"
              required
              value={formData.precio_base}
              onChange={e => setFormData({ ...formData, precio_base: Number(e.target.value) })}
            />
            <Input 
              label="Stock"
              type="number"
              required
              value={formData.stock_cantidad}
              onChange={e => setFormData({ ...formData, stock_cantidad: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <ImageUploader 
              label="Añadir Imagen"
              onUploadSuccess={(url) => setFormData({ ...formData, imagenes_url: [...(formData.imagenes_url || []), url] })}
            />
            {formData.imagenes_url && formData.imagenes_url.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.imagenes_url.map((url, idx) => (
                  <div key={idx} className="relative w-12 h-12 rounded-xl overflow-hidden border border-slate-200 group shadow-sm">
                    <img src={getImageUrl(url)} className="w-full h-full object-cover" alt="Gallery" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, imagenes_url: formData.imagenes_url?.filter((_, i) => i !== idx) })}
                      className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Select 
            label="Categoría"
            required
            value={formData.categoria_ids?.[0] || ''}
            onChange={e => setFormData({ ...formData, categoria_ids: e.target.value ? [Number(e.target.value)] : [] })}
            options={categoriasQuery.data?.map(c => ({ value: c.id, label: c.nombre })) || []}
          />

          <div>
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-3 ml-1">
              Ingredientes
            </label>
            <div className="max-h-40 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-1 gap-2 custom-scrollbar">
              {ingredientesQuery.data?.map(i => (
                <label key={i.id} className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:bg-white dark:hover:bg-slate-900 p-2 rounded-xl border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition-all group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-lg border-slate-300 dark:border-slate-700 text-brand focus:ring-brand"
                    checked={formData.ingrediente_ids?.includes(i.id)}
                    onChange={e => {
                      const ids = formData.ingrediente_ids || [];
                      setFormData({ 
                        ...formData, 
                        ingrediente_ids: e.target.checked ? [...ids, i.id] : ids.filter(id => id !== i.id) 
                      });
                    }}
                  />
                  <span className="flex-1 font-medium group-hover:text-slate-900 dark:group-hover:text-slate-100">{i.nombre}</span>
                  {i.es_alergeno && (
                    <AlertTriangle size={12} className="text-amber-500 shrink-0" />
                  )}
                </label>
              ))}
            </div>
          </div>
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
          className="px-12"
        >
          {initialData ? 'Guardar Cambios' : 'Crear Producto'}
        </Button>
      </div>
    </form>
  );
}
