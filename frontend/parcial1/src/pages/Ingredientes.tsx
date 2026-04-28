import { useState } from 'react';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { Plus, Pencil, Trash2, AlertTriangle, FileText, Leaf, Droplets, Biohazard } from 'lucide-react';
import type { Ingrediente, IngredienteCreate } from '../types';
import { useIngredientes } from '../hooks/useIngredientes';

export default function Ingredientes() {
  const { ingredientesQuery, createMutation, updateMutation, deleteMutation } = useIngredientes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingrediente | null>(null);
  const [formData, setFormData] = useState<IngredienteCreate>({ nombre: '', es_alergeno: false });

  const columns = [
    { 
      header: 'CÓDIGO', 
      accessor: (item: Ingrediente) => <span className="font-mono text-slate-500 dark:text-slate-400 uppercase">ING-{item.id.toString().padStart(3, '0')}</span> 
    },
    { 
      header: 'NOMBRE', 
      accessor: (item: Ingrediente) => (
        <span className={`font-bold ${item.es_alergeno ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-200'}`}>
          {item.nombre}
        </span>
      )
    },
    { 
      header: 'ALÉRGENO', 
      accessor: (item: Ingrediente) => (
        <div className="flex items-center gap-2">
          {item.es_alergeno ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-tight">
              <AlertTriangle size={10} />
              SI
            </div>
          ) : (
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">NO</span>
          )}
        </div>
      )
    }
  ];

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({ nombre: '', es_alergeno: false });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Ingrediente) => {
    setEditingItem(item);
    setFormData({ nombre: item.nombre, es_alergeno: item.es_alergeno });
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-3 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Directorio de Ingredientes</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Gestión de materias primas y declaraciones de alérgenos.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="btn-cyan group"
          >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
            Nuevo Ingrediente
          </button>
        </div>

        <DataTable 
          columns={columns} 
          data={ingredientesQuery.data || []} 
          isLoading={ingredientesQuery.isLoading}
          actions={(item) => (
            <div className="flex items-center gap-2">
              <button onClick={() => handleOpenEdit(item)} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"><Pencil size={16} /></button>
              <button onClick={() => { if(window.confirm('¿Eliminar ingrediente?')) deleteMutation.mutate(item.id); }} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
            </div>
          )}
        />
      </div>

      <aside className="space-y-6">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-6 rounded-xl">
          <h2 className="text-xs font-bold text-amber-700 dark:text-amber-500 tracking-widest uppercase mb-6 flex items-center gap-2">
            <AlertTriangle size={14} />
            Estado de Seguridad
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Total Registrados</span>
              <span className="text-sm text-slate-900 dark:text-white font-mono">{ingredientesQuery.data?.length || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">Alérgenos Detectados</span>
              <span className="text-sm text-red-500 font-mono font-bold">
                {ingredientesQuery.data?.filter(i => i.es_alergeno).length || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 text-slate-400">
            <FileText size={20} />
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">Reporte de Alérgenos</p>
              <p className="text-[10px] uppercase tracking-tighter mt-1 text-slate-500">Descargar planilla técnica (.csv)</p>
            </div>
          </div>
        </div>
      </aside>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Nombre del Ingrediente</label>
            <input
              type="text"
              required
              className="input-standard"
              placeholder="Ej: Harina de Trigo"
              value={formData.nombre}
              onChange={e => setFormData({ ...formData, nombre: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-950/50 rounded-lg border border-slate-100 dark:border-slate-800">
            <input
              type="checkbox"
              id="es_alergeno"
              className="w-4 h-4 accent-brand"
              checked={formData.es_alergeno}
              onChange={e => setFormData({ ...formData, es_alergeno: e.target.checked })}
            />
            <label htmlFor="es_alergeno" className="text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
              Declarar como alérgeno
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-cyan">
              {editingItem ? 'Guardar Cambios' : 'Crear Ingrediente'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
