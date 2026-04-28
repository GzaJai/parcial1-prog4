import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

export default function Input({ label, error, isTextArea, className = '', ...props }: InputProps) {
  const Component = isTextArea ? 'textarea' : 'input';
  
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <Component
        className={`w-full bg-white dark:bg-slate-950 border-2 rounded-xl px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-4 focus:ring-brand/10 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-700 ${
          error 
            ? 'border-red-500' 
            : 'border-slate-100 dark:border-slate-800 focus:border-brand'
        } ${isTextArea ? 'min-h-[100px] resize-none' : ''} ${className}`}
        {...(props as any)}
      />
      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{error}</p>}
    </div>
  );
}

// --- Badge Component ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'brand' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export function Badge({ children, variant = 'default', icon }: BadgeProps) {
  const variants = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    brand: "bg-brand/10 text-brand border-brand/20",
    warning: "bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-500 border-amber-100 dark:border-amber-900/20",
    danger: "bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-500 border-red-100 dark:border-red-900/20"
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${variants[variant]}`}>
      {icon}
      {children}
    </span>
  );
}
