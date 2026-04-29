import React from 'react';

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-x-auto rounded-[2.5rem] border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm shadow-sm">
      <table className="w-full text-left border-collapse">
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ columns }: { columns: string[] }) {
  return (
    <thead className="bg-slate-50 dark:bg-slate-950/50">
      <tr>
        {columns.map((col, i) => (
          <th key={i} className="px-8 py-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] border-b border-slate-100 dark:border-slate-800">
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TableRow({ children, className = '', ...props }: React.HTMLAttributes<HTMLTableRowElement> & { children: React.ReactNode }) {
  return (
    <tr 
      className={`group border-b border-slate-50 dark:border-slate-800/50 last:border-none hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-8 py-5 text-sm font-medium ${className}`}>
      {children}
    </td>
  );
}
