import { useState } from 'react';
import { useCategorias } from '../hooks/useCategorias';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PageLoader, ErrorMessage } from '../components/shared/States';
import CategoriaForm from '../features/categorias/CategoriaForm';
import CategoriaList from '../features/categorias/CategoriaList';
import { Plus } from 'lucide-react';
import type { Categoria } from '../types';

export default function Categorias() {
  const { categoriasQuery, deleteMutation } = useCategorias();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Categoria | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Categoria) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Desea eliminar esta categoría?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Categorías</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Organización estratégica del catálogo.</p>
        </div>
        <Button variant="cyan" onClick={handleOpenCreate} leftIcon={<Plus size={18} />}>
          Nueva Categoría
        </Button>
      </header>

      {categoriasQuery.isLoading ? (
        <PageLoader message="Cargando categorías..." />
      ) : categoriasQuery.isError ? (
        <ErrorMessage message="No se pudieron cargar las categorías. Verifique la conexión." />
      ) : (
        <CategoriaList 
          data={categoriasQuery.data || []} 
          onEdit={handleOpenEdit} 
          onDelete={handleDelete} 
        />
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Categoría' : 'Nueva Categoría'}
      >
        <CategoriaForm 
          initialData={editingItem} 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
