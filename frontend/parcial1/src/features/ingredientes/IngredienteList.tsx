import { Pencil, Trash2, AlertTriangle, Salad } from 'lucide-react';
import { Table, TableHeader, TableRow, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import { Badge } from '../../components/ui/Input';
import type { Ingrediente } from '../../types';

interface IngredienteListProps {
  data: Ingrediente[];
  onEdit: (item: Ingrediente) => void;
  onDelete: (id: number) => void;
}

export default function IngredienteList({ data, onEdit, onDelete }: IngredienteListProps) {
  const columns = ['Ingrediente', 'Estado', 'Código', 'Acciones'];

  return (
    <Table>
      <TableHeader columns={columns} />
      <tbody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-xl border-2 transition-all ${
                  item.es_alergeno 
                    ? 'bg-amber-500 text-white border-amber-400 shadow-lg shadow-amber-500/20' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                }`}>
                  <Salad size={18} />
                </div>
                <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                  {item.nombre}
                </span>
              </div>
            </TableCell>
            
            <TableCell>
              {item.es_alergeno ? (
                <Badge variant="warning" icon={<AlertTriangle size={12} />}>
                  Alérgeno
                </Badge>
              ) : (
                <Badge variant="default">
                  Seguro
                </Badge>
              )}
            </TableCell>
            
            <TableCell>
              <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ING-{item.id.toString().padStart(3, '0')}
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
