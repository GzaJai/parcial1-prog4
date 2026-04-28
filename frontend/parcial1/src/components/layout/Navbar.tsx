import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Salad, 
  Search
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Categorías', path: '/categorias', icon: Tags },
  { name: 'Productos', path: '/productos', icon: Package },
  { name: 'Ingredientes', path: '/ingredientes', icon: Salad },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col transition-colors">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
            <Package size={18} className="text-zinc-950" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-[var(--text-primary)]">InventoryOS</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-brand/10 text-brand border-l-2 border-brand' 
                  : 'text-[var(--text-secondary)] hover:bg-zinc-800/20 hover:text-[var(--text-primary)]'
              }`
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function TopBar() {
  const [isLight] = useState(false);

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLight]);

  return (
    <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)]/50 backdrop-blur-md flex items-center justify-between px-8 transition-colors">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-brand transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar en el inventario..." 
            className="w-full bg-[var(--bg-main)] border border-[var(--border-subtle)] rounded-sm pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-brand/30 transition-all text-[var(--text-primary)]"
          />
        </div>
      </div>
    </header>
  );
}
