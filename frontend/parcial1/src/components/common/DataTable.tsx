import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: (item: T) => ReactNode;
  isLoading?: boolean;
}

export default function DataTable<T extends { id: number | string }>({ 
  columns, 
  data, 
  actions,
  isLoading 
}: DataTableProps<T>) {
  return (
    <div className="glass-card transition-colors">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-right">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter">Cargando datos...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-xs text-slate-500 dark:text-slate-400 italic">
                  No se encontraron registros.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  {columns.map((col, i) => (
                    <td key={i} className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                      {typeof col.accessor === 'function' 
                        ? col.accessor(item) 
                        : (item[col.accessor] as ReactNode)}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {actions(item)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination */}
      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-900/30">
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
          Mostrando {data.length} de {data.length} entradas
        </span>
        <div className="flex gap-2">
          <button disabled className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed">
            <ChevronLeft size={14} />
          </button>
          <button disabled className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 opacity-50 cursor-not-allowed">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
