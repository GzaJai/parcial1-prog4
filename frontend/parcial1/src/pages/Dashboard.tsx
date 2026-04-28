import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { Package, Tags, AlertCircle, ArrowRight, Salad } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { productosQuery } = useProductos();
  const { categoriasQuery } = useCategorias();

  const totalProductos = productosQuery.data?.length || 0;
  const totalCategorias = categoriasQuery.data?.length || 0;
  const stockBajo = productosQuery.data?.filter(p => p.stock_cantidad < 5).length || 0;

  const stats = [
    { name: 'TOTAL PRODUCTOS', value: totalProductos, icon: Package, color: 'text-zinc-400' },
    { name: 'CATEGORÍAS ACTIVAS', value: totalCategorias, icon: Tags, color: 'text-zinc-400' },
    { name: 'ALERTAS DE STOCK', value: stockBajo, icon: AlertCircle, color: 'text-accent-salmon' },
  ];

  const recentProducts = productosQuery.data?.slice(0, 5) || [];
  const topCategories = categoriasQuery.data?.slice(0, 5) || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">Panel de Control</h1>
        <p className="text-[var(--text-secondary)] mt-1">Sincronización de inventario en tiempo real con la API central.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-zinc-900/40 border border-border-subtle p-6 rounded-sm relative group overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold text-zinc-500 tracking-[0.2em] uppercase">{stat.name}</p>
              <stat.icon size={16} className={stat.color} />
            </div>
            <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
            <div className="absolute bottom-0 left-0 h-[2px] bg-brand w-0 group-hover:w-full transition-all duration-500" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Products */}
        <div className="lg:col-span-2 bg-zinc-900/40 border border-border-subtle p-6 rounded-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase">Vista Previa: Productos</h2>
            <Link to="/productos" className="text-[10px] font-bold text-brand hover:underline flex items-center gap-1 uppercase">Ver todo <ArrowRight size={10} /></Link>
          </div>
          <div className="space-y-4">
            {recentProducts.length > 0 ? recentProducts.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border border-zinc-800/50 hover:border-brand/30 transition-colors bg-zinc-950/30">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-mono text-zinc-600">
                    ID-{p.id}
                  </div>
                  <span className="text-sm text-zinc-300 font-medium">{p.nombre}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-[10px] font-mono text-zinc-500">${p.precio_base}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${p.stock_cantidad > 0 ? 'bg-brand' : 'bg-accent-salmon'}`} />
                </div>
              </div>
            )) : (
              <div className="text-center py-10 text-zinc-600 text-xs italic">No hay productos registrados en el sistema.</div>
            )}
          </div>
        </div>

        {/* Categories & Shortcuts */}
        <div className="space-y-6">
          <div className="bg-zinc-900/40 border border-border-subtle p-6 rounded-sm">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase mb-6">Categorías</h2>
            <div className="space-y-3">
              {topCategories.length > 0 ? topCategories.map(c => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-xs text-zinc-400">{c.nombre}</span>
                  <span className="text-[10px] font-mono text-zinc-700">CAT-{c.id}</span>
                </div>
              )) : (
                <div className="text-zinc-600 text-xs italic">Sin categorías.</div>
              )}
            </div>
            <Link to="/categorias" className="block w-full mt-8 py-2 text-center border border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase hover:text-white transition-colors">
              Explorar Categorías
            </Link>
          </div>

          <div className="bg-brand/5 border border-brand/20 p-6 rounded-sm">
            <h2 className="text-xs font-bold text-brand tracking-widest uppercase mb-6">Accesos Rápidos</h2>
            <div className="grid grid-cols-1 gap-2">
              <Link to="/productos" className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-brand/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Package size={14} className="text-brand" />
                  <span className="text-xs text-zinc-300 font-bold uppercase">Productos</span>
                </div>
                <ArrowRight size={12} className="text-zinc-700" />
              </Link>
              <Link to="/categorias" className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-brand/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Tags size={14} className="text-brand" />
                  <span className="text-xs text-zinc-300 font-bold uppercase">Categorías</span>
                </div>
                <ArrowRight size={12} className="text-zinc-700" />
              </Link>
              <Link to="/ingredientes" className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-900 hover:border-brand/40 transition-colors">
                <div className="flex items-center gap-3">
                  <Salad size={14} className="text-brand" />
                  <span className="text-xs text-zinc-300 font-bold uppercase">Ingredientes</span>
                </div>
                <ArrowRight size={12} className="text-zinc-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
