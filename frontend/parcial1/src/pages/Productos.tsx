import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { useIngredientes } from '../hooks/useIngredientes';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Plus, Pencil, Trash2, Eye, Package, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import type { Producto, ProductoCreate } from '../types';
import { Link } from 'react-router-dom';

export default function Productos() {
  const queryClient = useQueryClient();
  const { productosQuery, createMutation, updateMutation, deleteMutation } = useProductos();
  const { categoriasQuery } = useCategorias();
  const { ingredientesQuery } = useIngredientes();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductoCreate>({ 
    nombre: '', 
    descripcion: '', 
    precio_base: 0, 
    imagenes_url: [], 
    stock_cantidad: 0, 
    disponible: true, 
    categoria_ids: [], 
    ingrediente_ids: [] 
  });

  const columns = [
    { 
      header: 'ID', 
      accessor: (item: Producto) => <span className="font-mono text-slate-500 dark:text-slate-400">#{item.id}</span> 
    },
    { 
      header: 'PRODUCTO', 
      accessor: (item: Producto) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
            {item.imagenes_url?.[0] ? (
              <img src={item.imagenes_url[0]} className="w-full h-full object-cover" alt={item.nombre} />
            ) : (
              <Package size={16} className="text-slate-400" />
            )}
          </div>
          <Link 
            to={`/productos/${item.id}`} 
            className="font-bold text-slate-900 dark:text-slate-100 hover:text-brand transition-colors truncate max-w-[200px]"
          >
            {item.nombre}
          </Link>
        </div>
      )
    },
    { 
      header: 'CATEGORÍA', 
      accessor: (item: Producto) => (
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
          {item.categorias?.[0]?.nombre || 'Sin categoría'}
        </span>
      )
    },
    { 
      header: 'PRECIO', 
      accessor: (item: Producto) => <span className="font-mono font-bold text-slate-700 dark:text-slate-300">${item.precio_base}</span>
    },
    { 
      header: 'STOCK', 
      accessor: (item: Producto) => (
        <div className="flex items-center gap-2">
          <span className={`font-mono font-bold ${item.stock_cantidad < 5 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
            {item.stock_cantidad}
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${item.disponible ? 'bg-brand' : 'bg-red-500'}`} />
        </div>
      )
    }
  ];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setServerError(null);
    setFormData({ nombre: '', descripcion: '', precio_base: 0, imagenes_url: [], stock_cantidad: 0, disponible: true, categoria_ids: [], ingrediente_ids: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Producto) => {
    setEditingItem(item);
    setServerError(null);
    setFormData({ 
      nombre: item.nombre, 
      descripcion: item.descripcion, 
      precio_base: Number(item.precio_base),
      imagenes_url: item.imagenes_url || [],
      stock_cantidad: item.stock_cantidad,
      disponible: item.disponible,
      categoria_ids: item.categorias?.map(c => c.id) || [],
      ingrediente_ids: item.ingredientes?.map(i => i.id) || [] 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Mapear el precio a número y asegurar que categoria_ids sea un array válido
    const submissionData = {
      ...formData,
      precio_base: Number(formData.precio_base)
    };

    const mutationOptions = {
      onSuccess: () => {
        setIsModalOpen(false);
        queryClient.invalidateQueries({ queryKey: ['productos'] });
      },
      onError: (err: any) => {
        if (err.response?.status === 422) {
          setServerError("Error de validación: Verifique que todos los campos obligatorios estén completos.");
        } else {
          setServerError("Ocurrió un error al guardar el producto. Verifique la conexión.");
        }
      }
    };

    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: submissionData }, mutationOptions);
    } else {
      createMutation.mutate(submissionData, mutationOptions);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Gestión de Productos</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Administración central de inventario, precios y stock.</p>
        </div>
        <button onClick={handleOpenCreate} className="btn-cyan">
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      <DataTable 
        columns={columns} 
        data={productosQuery.data || []} 
        isLoading={productosQuery.isLoading}
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Link title="Ver Detalle" to={`/productos/${item.id}`} className="p-2 text-slate-400 hover:text-brand transition-colors"><Eye size={18} /></Link>
            <button title="Editar" onClick={() => handleOpenEdit(item)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Pencil size={18} /></button>
            <button title="Eliminar" onClick={() => { if(window.confirm('¿Eliminar producto?')) deleteMutation.mutate(item.id, { onSuccess: () => queryClient.invalidateQueries({ queryKey: ['productos'] }) }); }} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
          </div>
        )}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Producto' : 'Crear Nuevo Producto'}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {serverError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold">
              <AlertTriangle size={18} />
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda: Info Básica */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Información del Producto</label>
                <input
                  type="text"
                  required
                  className="input-standard w-full mb-3"
                  placeholder="Nombre comercial"
                  value={formData.nombre}
                  onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                />
                <textarea
                  className="input-standard w-full h-24 resize-none"
                  placeholder="Descripción técnica o comercial..."
                  value={formData.descripcion}
                  onChange={e => setFormData({ ...formData, descripcion: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Precio ($)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    className="input-standard font-mono w-full"
                    value={formData.precio_base}
                    onChange={e => setFormData({ ...formData, precio_base: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    className="input-standard font-mono w-full"
                    value={formData.stock_cantidad}
                    onChange={e => setFormData({ ...formData, stock_cantidad: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Relaciones e Imagen */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Imagen y Categoría</label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="url"
                      className="input-standard w-full pl-10"
                      placeholder="URL de la imagen"
                      value={formData.imagenes_url?.[0] || ''}
                      onChange={e => setFormData({ ...formData, imagenes_url: e.target.value ? [e.target.value] : [] })}
                    />
                  </div>
                  {formData.imagenes_url?.[0] && (
                    <div className="w-11 h-11 rounded border border-slate-200 overflow-hidden shrink-0">
                      <img src={formData.imagenes_url[0]} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                </div>

                <select
                  required
                  className="input-standard w-full appearance-none"
                  value={formData.categoria_ids?.[0] || ''}
                  onChange={e => setFormData({ ...formData, categoria_ids: e.target.value ? [Number(e.target.value)] : [] })}
                >
                  <option value="">Seleccione Categoría</option>
                  {categoriasQuery.data?.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Ingredientes</label>
                <div className="max-h-32 overflow-y-auto p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 grid grid-cols-1 gap-1">
                  {ingredientesQuery.data?.map(i => (
                    <label key={i.id} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer hover:text-brand transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-900">
                      <input
                        type="checkbox"
                        className="w-3.5 h-3.5 rounded border-slate-300 dark:border-slate-700 text-brand"
                        checked={formData.ingrediente_ids?.includes(i.id)}
                        onChange={e => {
                          const ids = formData.ingrediente_ids || [];
                          if (e.target.checked) {
                            setFormData({ ...formData, ingrediente_ids: [...ids, i.id] });
                          } else {
                            setFormData({ ...formData, ingrediente_ids: ids.filter(id => id !== i.id) });
                          }
                        }}
                      />
                      <span className="truncate">{i.nombre}</span>
                      {i.es_alergeno && <AlertTriangle size={10} className="text-amber-500 shrink-0" />}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-cyan px-10">
              {editingItem ? 'Guardar Cambios' : 'Crear Producto'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
