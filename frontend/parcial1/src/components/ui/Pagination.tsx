import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalItems, 
  limit, 
  onPageChange,
  isLoading 
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / limit);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-8 py-4 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-[2rem] shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Mostrando {Math.min((currentPage - 1) * limit + 1, totalItems)} - {Math.min(currentPage * limit, totalItems)} de {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="p-2 h-auto rounded-xl"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
        >
          <ChevronLeft size={18} />
        </Button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              disabled={isLoading}
              className={`w-8 h-8 rounded-xl text-[10px] font-black transition-all ${
                currentPage === page
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <Button
          variant="ghost"
          className="p-2 h-auto rounded-xl"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
}
