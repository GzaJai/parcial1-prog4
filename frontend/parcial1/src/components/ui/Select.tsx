import React from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  label: string;
  options: Option[];
  value: (string | number)[] | string | number;
  onChange: (value: any) => void;
  multiple?: boolean;
  error?: string;
  placeholder?: string;
}

export function Select({ 
  label, 
  options, 
  value, 
  onChange, 
  multiple = false, 
  error, 
  placeholder = "Seleccione una opción..." 
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const containerRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Normalizar valor a array para lógica interna
  const selectedValues = Array.isArray(value) ? value : value ? [value] : [];

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (val: string | number) => {
    if (multiple) {
      const newValue = selectedValues.includes(val)
        ? selectedValues.filter(v => v !== val)
        : [...selectedValues, val];
      onChange(newValue);
    } else {
      onChange(val);
      setIsOpen(false);
    }
    setSearchTerm('');
  };

  const removeValue = (e: React.MouseEvent, val: string | number) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== val));
  };

  // Auto-focus al buscador al abrir
  React.useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    if (!isOpen) {
      setSearchTerm('');
    }
  }, [isOpen]);

  // Cerrar al hacer click afuera
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = options.filter(opt => selectedValues.includes(opt.value));

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      
      <div className="relative">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`min-h-[46px] w-full bg-white dark:bg-slate-950 border-2 rounded-2xl px-4 py-2 text-sm transition-all cursor-pointer flex flex-wrap gap-2 items-center pr-10 ${
            isOpen ? 'border-brand ring-4 ring-brand/10' : error ? 'border-red-500' : 'border-slate-100 dark:border-slate-800'
          }`}
        >
          {selectedOptions.length > 0 ? (
            selectedOptions.map(opt => (
              <span key={opt.value} className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 animate-in zoom-in-95 duration-200">
                {opt.label}
                {multiple && (
                  <X 
                    size={12} 
                    className="hover:text-red-500 transition-colors cursor-pointer" 
                    onClick={(e) => removeValue(e, opt.value)} 
                  />
                )}
              </span>
            ))
          ) : (
            <span className="text-slate-400">{placeholder}</span>
          )}
          
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 transition-transform duration-300" style={{ transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})` }}>
            <ChevronDown size={18} />
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Buscador interno */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Buscar..."
                className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-brand dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div className="max-h-60 overflow-y-auto">
              {filteredOptions.length > 0 ? filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <div 
                    key={opt.value}
                    onClick={() => handleSelect(opt.value)}
                    className={`px-4 py-3 text-sm flex items-center justify-between cursor-pointer transition-colors ${
                      isSelected ? 'bg-brand/5 text-brand font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {opt.label}
                    {isSelected && <Check size={16} className="text-brand animate-in zoom-in duration-300" />}
                  </div>
                );
              }) : (
                <div className="px-4 py-8 text-center text-slate-400 text-xs italic">
                  No se encontraron coincidencias
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-red-500 font-bold uppercase tracking-tight ml-1">{error}</p>}
    </div>
  );
}
