import { Pencil, Trash2, Eye, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Input';
import { getImageUrl } from '../../utils/format';
import type { Producto } from '../../types';

interface ProductoListProps {
  data: Producto[];
  onEdit: (item: Producto) => void;
  onDelete: (id: number) => void;
}

export default function ProductoList({ data, onEdit, onDelete }: ProductoListProps) {
  const navigate = useNavigate();
  const columns = ['Producto', 'Categoría', 'Precio', 'Stock', 'Acciones'];

  return (
    <Table>
      <TableHeader columns={columns} />
      <tbody>
        {data.map((item) => (
          <TableRow 
            key={item.id} 
            onClick={() => navigate(`/productos/${item.id}`)}
            className="cursor-pointer"
          >
            <TableCell>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                  {item.imagenes_url?.[0] ? (
                    <img src={getImageUrl(item.imagenes_url[0])} className="w-full h-full object-cover" alt={item.nombre} />
                  ) : (
                    <Package size={20} className="text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-slate-900 dark:text-white hover:text-brand transition-colors text-base tracking-tight">
                    {item.nombre}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">ID: #{item.id}</span>
                </div>
              </div>
            </TableCell>
            
            <TableCell>
              <Badge variant="default">
                {item.categorias?.[0]?.nombre || 'Sin categoría'}
              </Badge>
            </TableCell>
            
            <TableCell className="font-mono font-black text-slate-900 dark:text-slate-100">
              ${item.precio_base}
            </TableCell>
            
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.disponible ? 'bg-brand shadow-[0_0_8px_rgba(6,182,212,0.4)]' : 'bg-red-500 shadow-lg shadow-red-500/20'}`} />
                  <span className={`font-mono font-bold ${item.stock_cantidad < 5 ? 'text-red-500' : 'text-slate-600 dark:text-slate-400'}`}>
                    {item.stock_cantidad} uds
                  </span>
                </div>
                {!item.disponible && <span className="text-[9px] font-bold text-red-500 uppercase tracking-tighter">No disponible</span>}
              </div>
            </TableCell>
            
            <TableCell>
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <Link 
                  to={`/productos/${item.id}`}
                  className="p-2 text-slate-400 hover:text-brand transition-all hover:scale-110"
                  title="Ver Detalle"
                >
                  <Eye size={18} />
                </Link>
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto" 
                  onClick={() => onEdit(item)}
                  title="Editar"
                >
                  <Pencil size={18} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" 
                  onClick={() => onDelete(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
