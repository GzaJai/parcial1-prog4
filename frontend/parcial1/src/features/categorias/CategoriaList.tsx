import React from 'react';
import { Pencil, Trash2, Tags } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { getImageUrl } from '../../utils/format';
import type { Categoria } from '../../types';

interface CategoriaListProps {
  data: Categoria[];
  onEdit: (item: Categoria) => void;
  onDelete: (id: number) => void;
}

export default function CategoriaList({ data, onEdit, onDelete }: CategoriaListProps) {
  const columns = ['Imagen', 'Nombre', 'Descripción', 'Código', 'Acciones'];

  return (
    <Table>
      <TableHeader columns={columns} />
      <tbody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shadow-sm">
                {item.imagen_url ? (
                  <img src={getImageUrl(item.imagen_url)} className="w-full h-full object-cover" alt={item.nombre} />
                ) : (
                  <Tags size={16} className="text-slate-400" />
                )}
              </div>
            </TableCell>
            <TableCell className="font-bold text-slate-900 dark:text-slate-100">
              {item.nombre}
            </TableCell>
            <TableCell className="text-slate-500 dark:text-slate-400 max-w-xs truncate">
              {item.descripcion || 'Sin descripción'}
            </TableCell>
            <TableCell>
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                CAT-{item.id.toString().padStart(3, '0')}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto" 
                  onClick={() => onEdit(item)}
                  title="Editar"
                >
                  <Pencil size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  className="p-2 h-auto text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10" 
                  onClick={() => onDelete(item.id)}
                  title="Eliminar"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
}
