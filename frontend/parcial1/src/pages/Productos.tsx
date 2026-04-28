import { useState } from 'react';
import { useProductos } from '../hooks/useProductos';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { PageLoader, ErrorMessage } from '../components/shared/States';
import Pagination from '../components/ui/Pagination';
import ProductoForm from '../features/productos/ProductoForm';
import ProductoList from '../features/productos/ProductoList';
import { Plus } from 'lucide-react';
import type { Producto } from '../types';

export default function Productos() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { productosQuery, deleteMutation } = useProductos(page, limit);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Producto | null>(null);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Producto) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('¿Desea eliminar este producto?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <header className="flex items-center justify-between bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Inventario</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Gestión de productos, precios y existencias.</p>
        </div>
        <Button variant="cyan" onClick={handleOpenCreate} leftIcon={<Plus size={18} />}>
          Nuevo Producto
        </Button>
      </header>

      {productosQuery.isLoading ? (
        <PageLoader message="Cargando catálogo..." />
      ) : productosQuery.isError ? (
        <ErrorMessage message="Ocurrió un error al cargar los productos. Verifique la conexión con el servidor." />
      ) : (
        <>
          <ProductoList 
            data={productosQuery.data?.items || []} 
            onEdit={handleOpenEdit} 
            onDelete={handleDelete} 
          />
          
          <Pagination 
            currentPage={page}
            totalItems={productosQuery.data?.total || 0}
            limit={limit}
            onPageChange={setPage}
            isLoading={productosQuery.isFetching}
          />
        </>
      )}

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingItem ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <ProductoForm 
          initialData={editingItem} 
          onSuccess={() => setIsModalOpen(false)} 
          onCancel={() => setIsModalOpen(false)} 
        />
      </Modal>
    </div>
  );
}
