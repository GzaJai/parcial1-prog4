import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  Salad
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const sidebarItems = [
  { name: 'Panel de Control', path: '/', icon: LayoutDashboard },
  { name: 'Categorías', path: '/categorias', icon: Tags },
  { name: 'Productos', path: '/productos', icon: Package },
  { name: 'Ingredientes', path: '/ingredientes', icon: Salad },
];

export function Sidebar() {
  return (
    <aside className="w-72 bg-white dark:bg-slate-950 border-r border-slate-100 dark:border-slate-900 flex flex-col transition-all duration-500">
      <div className="p-10">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10  rounded-2xl flex items-center justify-center shadow-lg shadow-brand/20 group-hover:rotate-12 transition-transform overflow-hidden">
            <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">InventoryOS</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-4 space-y-2">
        <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] mb-4">Navegación Principal</p>
        {sidebarItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                isActive 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xl shadow-slate-200 dark:shadow-none' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}