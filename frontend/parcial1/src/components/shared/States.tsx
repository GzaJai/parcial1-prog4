import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

// --- Full Page Loader ---
export function PageLoader({ message = "Cargando datos..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-slate-100 dark:border-slate-800 rounded-full" />
        <div className="absolute inset-0 w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
      <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse tracking-wide uppercase">
        {message}
      </p>
    </div>
  );
}

// --- Error Message Component ---
export function ErrorMessage({ message, title = "Ocurrió un error" }: { message: string, title?: string }) {
  return (
    <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/30 rounded-3xl flex items-start gap-4 animate-in shake duration-500">
      <div className="p-2 bg-red-500 rounded-xl text-white">
        <AlertCircle size={20} />
      </div>
      <div>
        <h3 className="font-black text-red-900 dark:text-red-400 text-sm uppercase tracking-tight">{title}</h3>
        <p className="text-red-600 dark:text-red-500/80 text-sm mt-1">{message}</p>
      </div>
    </div>
  );
}
