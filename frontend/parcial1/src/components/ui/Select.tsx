import React from 'react';

// --- Select Component ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

export function Select({ label, options, error, className = '', ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative">
        <select
          className={`w-full bg-white dark:bg-slate-950 border-2 rounded-xl px-4 py-2.5 text-sm appearance-none transition-all focus:outline-none focus:ring-4 focus:ring-brand/10 text-slate-900 dark:text-white ${
            error 
              ? 'border-red-500' 
              : 'border-slate-100 dark:border-slate-800 focus:border-brand'
          } ${className}`}
          {...props}
        >
          <option value="">Seleccione una opción</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          ▼
        </div>
      </div>
      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{error}</p>}
    </div>
  );
}
