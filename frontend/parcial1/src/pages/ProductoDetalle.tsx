import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '../services/productoService';
import { ChevronLeft, Package, BadgeDollarSign, Database, CheckCircle2, XCircle } from 'lucide-react';

export default function ProductoDetalle() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', id],
    queryFn: () => productoService.getById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
        <p className="text-zinc-500 animate-pulse">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="text-red-500 w-12 h-12" />
        <h2 className="text-xl font-bold text-white">Producto no encontrado</h2>
        <button 
          onClick={() => navigate('/productos')}
          className="text-emerald-400 hover:underline flex items-center gap-1"
        >
          <ChevronLeft size={16} /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/productos')}
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-900 rounded-lg transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <nav className="flex text-sm text-zinc-500 gap-2 mb-1">
            <Link to="/productos" className="hover:text-emerald-400">Productos</Link>
            <span>/</span>
            <span className="text-zinc-300">Detalle</span>
          </nav>
          <h1 className="text-3xl font-bold text-white">{producto.nombre}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images section */}
        <div className="space-y-4">
          <div className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden group">
            {producto.imagenes_url && producto.imagenes_url.length > 0 ? (
              <img 
                src={producto.imagenes_url[0]} 
                alt={producto.nombre} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-700">
                <Package size={64} />
                <p className="mt-2 text-sm">Sin imagen disponible</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {producto.imagenes_url?.slice(1, 5).map((url, i) => (
              <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <img src={url} alt={`${producto.nombre} ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Info section */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-2">Descripción</h3>
              <p className="text-zinc-300 leading-relaxed">{producto.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <BadgeDollarSign size={16} />
                  <span className="text-xs font-bold uppercase">Precio</span>
                </div>
                <p className="text-2xl font-bold text-white">${producto.precio_base}</p>
              </div>
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800/50">
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Database size={16} />
                  <span className="text-xs font-bold uppercase">Stock</span>
                </div>
                <p className="text-2xl font-bold text-white">{producto.stock_cantidad}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {producto.disponible ? (
                <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-4 py-2 rounded-full text-sm font-semibold">
                  <CheckCircle2 size={18} />
                  Disponible para la venta
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-500 bg-red-500/10 px-4 py-2 rounded-full text-sm font-semibold">
                  <XCircle size={18} />
                  No disponible / Sin stock
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              className="flex-1 bg-emerald-500 text-zinc-950 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              onClick={() => navigate('/productos')}
            >
              Volver al Listado
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
