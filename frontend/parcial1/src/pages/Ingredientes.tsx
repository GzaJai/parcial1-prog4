import { useState } from 'react';
import { useIngredientes } from '../hooks/useIngredientes';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PageLoader, ErrorMessage } from '../components/shared/States';
import IngredienteForm from '../features/ingredientes/IngredienteForm';
import IngredienteList from '../features/ingredientes/IngredienteList';
import { Plus } from 'lucide-react';
import type { Ingrediente } from '../types';
import Pagination from '../components/ui/Pagination';

export default function Ingredientes() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { ingredientesQuery, deleteMutation } = useIngredientes(page, limit);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Ingrediente | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Ingrediente) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Desea eliminar este ingrediente?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center justify-between bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Ingredientes</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Control de composición alimentaria y alérgenos.</p>
        </div>
        <Button variant="cyan" onClick={handleOpenCreate} leftIcon={<Plus size={18} />}>
          Nuevo Ingrediente
        </Button>
      </header>

      {ingredientesQuery.isLoading ? (
        <PageLoader message="Cargando composición..." />
      ) : ingredientesQuery.isError ? (
        <ErrorMessage message="No se pudo recuperar la lista de ingredientes. Reintente en unos momentos." />
      ) : (
        <>
          <IngredienteList 
            data={ingredientesQuery.data?.items || []} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
          
          <Pagination 
            currentPage={page}
            totalItems={ingredientesQuery.data?.total || 0}
            limit={limit}
            onPageChange={setPage}
            isLoading={ingredientesQuery.isFetching}
          />
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Ingrediente' : 'Nuevo Ingrediente'}
      >
        <IngredienteForm 
          initialData={editingItem} 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
