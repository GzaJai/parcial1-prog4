import { useState } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Plus, Pencil, Trash2, Tags, Info, Image as ImageIcon } from 'lucide-react';
import ImageUploader from '../components/common/ImageUploader';
import type { Categoria, CategoriaCreate } from '../types';
import { getImageUrl } from '../utils/format';

export default function Categorias() {
  const { categoriasQuery, createMutation, updateMutation, deleteMutation } = useCategorias();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Categoria | null>(null);
  const [formData, setFormData] = useState<CategoriaCreate>({ nombre: '', descripcion: '', imagen_url: '' });

  const columns = [
    { 
      header: 'IMAGEN', 
      accessor: (item: Categoria) => (
        <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          {item.imagen_url ? (
            <img src={getImageUrl(item.imagen_url)} className="w-full h-full object-cover" alt={item.nombre} />
          ) : (
            <Tags size={16} className="text-slate-400" />
          )}
        </div>
      )
    },
    { 
      header: 'NOMBRE DE CATEGORÍA', 
      accessor: (item: Categoria) => (
        <span className="font-bold text-slate-900 dark:text-slate-100">{item.nombre}</span>
      )
    },
    { 
      header: 'DESCRIPCIÓN', 
      accessor: (item: Categoria) => (
        <span className="text-slate-500 dark:text-slate-400 text-sm truncate max-w-[300px] block">
          {item.descripcion || 'Sin descripción'}
        </span>
      )
    },
    { 
      header: 'CÓDIGO', 
      accessor: (item: Categoria) => <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">CAT-{item.id.toString().padStart(3, '0')}</span> 
    }
  ];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ nombre: '', descripcion: '', imagen_url: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Categoria) => {
    setEditingItem(item);
    setFormData({ nombre: item.nombre, descripcion: item.descripcion || '', imagen_url: item.imagen_url || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData }, { onSuccess: () => setIsModalOpen(false) });
    } else {
      createMutation.mutate(formData, { onSuccess: () => setIsModalOpen(false) });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Categorías</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Organización lógica del catálogo de productos.</p>
        </div>
        <button 
          onClick={handleOpenCreate} 
          className="btn-cyan"
        >
          <Plus size={18} />
          Nueva Categoría
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={categoriasQuery.data || []} 
        isLoading={categoriasQuery.isLoading}
        actions={(item) => (
          <div className="flex items-center gap-2">
            <button onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" title="Editar"><Pencil size={18} /></button>
            <button onClick={() => { if(window.confirm('¿Desea eliminar esta categoría?')) deleteMutation.mutate(item.id); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Eliminar"><Trash2 size={18} /></button>
          </div>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre de la Categoría</label>
              <input 
                type="text" 
                required 
                placeholder="Ej: Bebidas, Entradas..."
                className="input-standard w-full" 
                value={formData.nombre} 
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} 
              />
            </div>
            
            <div>
              <ImageUploader 
                label="Imagen de la Categoría"
                onUploadSuccess={(url) => setFormData({ ...formData, imagen_url: url })}
              />
              {formData.imagen_url && (
                <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                  <div className="w-8 h-8 rounded overflow-hidden border border-slate-200">
                    <img src={getImageUrl(formData.imagen_url)} className="w-full h-full object-cover" alt="Actual" />
                  </div>
                  <span className="text-[10px] text-slate-400 truncate flex-1">{formData.imagen_url}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción (Opcional)</label>
              <textarea 
                className="input-standard w-full h-24 resize-none" 
                placeholder="Propósito de esta categoría..."
                value={formData.descripcion} 
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} 
              />
            </div>
            
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
              <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                Las imágenes ayudan a identificar las categorías rápidamente en el menú.
              </p>
            </div>
          </div>
          
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)} 
              className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-cyan px-10"
            >
              {editingItem ? 'Guardar Cambios' : 'Crear Categoría'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
