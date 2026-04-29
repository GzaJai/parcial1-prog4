import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProductos } from '../../hooks/useProductos';
import { useCategorias } from '../../hooks/useCategorias';
import { useIngredientes } from '../../hooks/useIngredientes';
import Input from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import Button from '../../components/ui/Button';
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
  const { categoriasQuery } = useCategorias(); // Sin parámetros = todos
  const { ingredientesQuery } = useIngredientes(); // Sin parámetros = todos
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
      onError: () => {
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
            label="Categorías"
            multiple
            value={formData.categoria_ids}
            onChange={(val) => setFormData({ ...formData, categoria_ids: val })}
            options={categoriasQuery.data?.items.map(c => ({ value: c.id, label: c.nombre })) || []}
            error={categoriasQuery.isError ? "Error al cargar categorías" : undefined}
          />

          <Select 
            label="Ingredientes"
            multiple
            value={formData.ingrediente_ids}
            onChange={(val) => setFormData({ ...formData, ingrediente_ids: val })}
            options={ingredientesQuery.data?.items.map(i => ({ 
              value: i.id, 
              label: i.es_alergeno ? `⚠️ ${i.nombre}` : i.nombre 
            })) || []}
            error={ingredientesQuery.isError ? "Error al cargar ingredientes" : undefined}
          />

          <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
            <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Seleccione todas las categorías e ingredientes que componen este producto. Los ingredientes marcados con ⚠️ son considerados alérgenos.
            </p>
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
