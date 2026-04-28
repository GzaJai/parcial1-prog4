import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { Package, Tags, AlertCircle, ArrowRight, Salad } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageLoader, ErrorMessage } from '../components/shared/States';
import { Badge } from '../components/ui/Input';

export default function Dashboard() {
  const { productosQuery } = useProductos();
  const { categoriasQuery } = useCategorias();

  if (productosQuery.isLoading || categoriasQuery.isLoading) {
    return <PageLoader message="Sincronizando panel de control..." />;
  }

  if (productosQuery.isError || categoriasQuery.isError) {
    return <ErrorMessage message="No se pudo obtener la información estadística del servidor." />;
  }

  const totalProductos = productosQuery.data?.length || 0;
  const totalCategorias = categoriasQuery.data?.length || 0;
  const stockBajo = productosQuery.data?.filter(p => p.stock_cantidad < 5).length || 0;

  const stats = [
    { name: 'Total Productos', value: totalProductos, icon: Package, variant: 'default' as const },
    { name: 'Categorías Activas', value: totalCategorias, icon: Tags, variant: 'brand' as const },
    { name: 'Alertas de Stock', value: stockBajo, icon: AlertCircle, variant: 'danger' as const },
  ];

  const recentProducts = productosQuery.data?.slice(0, 5) || [];
  const topCategories = categoriasQuery.data?.slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Panel de Control</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Sincronización de inventario en tiempo real con la API central.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] relative group overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="flex justify-between items-start mb-6">
              <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.2em] uppercase">{stat.name}</p>
              <div className={`p-3 rounded-2xl ${stat.variant === 'danger' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-400 group-hover:text-brand transition-colors'}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
            <div className="absolute bottom-0 left-0 h-1.5 bg-brand w-0 group-hover:w-full transition-all duration-700" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase">Vista Previa: Inventario Reciente</h2>
            <Link to="/productos" className="text-[10px] font-black text-brand hover:underline flex items-center gap-1 uppercase tracking-tighter">Explorar Catálogo <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-3">
            {recentProducts.length > 0 ? recentProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 dark:border-slate-800/50 hover:border-brand/30 transition-all bg-slate-50/50 dark:bg-slate-950/30 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                    #{p.id}
                  </div>
                  <span className="text-sm text-slate-900 dark:text-slate-100 font-bold tracking-tight">{p.nombre}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs font-mono font-black text-slate-400">${p.precio_base}</span>
                  <div className={`w-2.5 h-2.5 rounded-full ${p.stock_cantidad > 0 ? 'bg-brand shadow-[0_0_10px_rgba(6,182,212,0.4)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'}`} />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-slate-400 text-xs italic font-medium">No hay productos registrados en el sistema.</div>
            )}
          </div>
        </div>

        {/* Categories & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm">
            <h2 className="text-xs font-black text-slate-900 dark:text-white tracking-widest uppercase mb-8">Categorías Principales</h2>
            <div className="space-y-4">
              {topCategories.length > 0 ? topCategories.map(c => (
                <div key={c.id} className="flex items-center justify-between group cursor-default">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 group-hover:text-brand transition-colors">{c.nombre}</span>
                  <Badge variant="default">CAT-{c.id}</Badge>
                </div>
              )) : (
                <div className="text-slate-400 text-xs italic font-medium">Sin categorías registradas.</div>
              )}
            </div>
            <Link to="/categorias" className="block w-full mt-10 py-3 text-center rounded-2xl border-2 border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-brand hover:text-brand transition-all">
              Gestionar Categorías
            </Link>
          </div>

          <div className="bg-brand/5 border border-brand/20 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <h2 className="text-xs font-black text-brand tracking-widest uppercase mb-8 relative z-10">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 gap-3 relative z-10">
              <Link to="/productos" className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-brand/40 transition-all shadow-sm active:scale-95">
                <div className="flex items-center gap-3">
                  <Package size={16} className="text-brand" />
                  <span className="text-[10px] text-slate-900 dark:text-white font-black uppercase tracking-widest">Inventario</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 dark:text-slate-700" />
              </Link>
              <Link to="/ingredientes" className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-brand/40 transition-all shadow-sm active:scale-95">
                <div className="flex items-center gap-3">
                  <Salad size={16} className="text-brand" />
                  <span className="text-[10px] text-slate-900 dark:text-white font-black uppercase tracking-widest">Alérgenos</span>
                </div>
                <ArrowRight size={14} className="text-slate-300 dark:text-slate-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
