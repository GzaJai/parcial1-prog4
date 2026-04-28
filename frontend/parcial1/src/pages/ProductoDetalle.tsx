import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productoService } from '../services/productoService';
import { ChevronLeft, Package, DollarSign, Database, CheckCircle2, XCircle, AlertTriangle, Tag } from 'lucide-react';
import { getImageUrl } from '../utils/format';

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
        <div className="w-12 h-12 border-4 border-slate-200 dark:border-slate-800 border-t-brand rounded-full animate-spin" />
        <p className="text-slate-500 dark:text-slate-400 font-bold animate-pulse">Cargando detalles del producto...</p>
      </div>
    );
  }

  if (isError || !producto) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <XCircle className="text-red-500 w-16 h-16" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Producto no encontrado</h2>
        <button 
          onClick={() => navigate('/productos')}
          className="btn-cyan mt-4"
        >
          <ChevronLeft size={18} /> Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Cabecera con Navegación */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/productos')}
          className="p-3 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <nav className="flex text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-2 mb-1">
            <Link to="/productos" className="hover:text-brand transition-colors">Productos</Link>
            <span>/</span>
            <span className="text-slate-600 dark:text-slate-300">Visualización de Detalle</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">{producto.nombre}</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Izquierda: Imagen y Estado (4 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="aspect-square bg-white dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none group relative">
            {producto.imagenes_url && producto.imagenes_url.length > 0 ? (
              <img 
                src={getImageUrl(producto.imagenes_url[0])} 
                alt={producto.nombre} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 dark:text-slate-800">
                <Package size={80} strokeWidth={1} />
                <p className="mt-4 text-xs font-bold uppercase tracking-widest">Sin imagen disponible</p>
              </div>
            )}
            
            {/* Badge de Disponibilidad sobre la imagen */}
            <div className="absolute top-6 right-6">
              {producto.disponible ? (
                <div className="flex items-center gap-2 bg-brand text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg ring-4 ring-white dark:ring-slate-950">
                  <CheckCircle2 size={14} />
                  ACTIVO
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg ring-4 ring-white dark:ring-slate-950">
                  <XCircle size={14} />
                  AGOTADO
                </div>
              )}
            </div>
          </div>

          {/* Miniaturas si existen */}
          {producto.imagenes_url && producto.imagenes_url.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {producto.imagenes_url.slice(1, 5).map((url, i) => (
                <div key={i} className="aspect-square bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-brand transition-colors cursor-pointer">
                  <img src={getImageUrl(url)} alt={`${producto.nombre} ${i}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna Derecha: Información y Detalle (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-sm space-y-8">
            
            {/* Descripción y Categoría */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-brand">
                <Tag size={16} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {producto.categorias?.[0]?.nombre || 'Sin Categoría'}
                </span>
              </div>
              <div>
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Descripción del Producto</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg italic">
                  "{producto.descripcion || 'Este producto no cuenta con una descripción detallada en este momento.'}"
                </p>
              </div>
            </div>

            {/* Grid de Precio y Stock */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <DollarSign size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Precio de Venta</span>
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tighter">
                  ${producto.precio_base}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-3xl border border-slate-100 dark:border-slate-800/50">
                <div className="flex items-center gap-2 text-slate-400 mb-2">
                  <Database size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Stock Disponible</span>
                </div>
                <p className="text-3xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tighter">
                  {producto.stock_cantidad}
                  <span className="text-xs text-slate-400 ml-1 font-sans font-bold">UDS</span>
                </p>
              </div>
            </div>

            {/* SECCIÓN DE INGREDIENTES (REQUERIDA) */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ingredientes y Composición</h3>
              <div className="flex flex-wrap gap-2">
                {producto.ingredientes && producto.ingredientes.length > 0 ? (
                  producto.ingredientes.map((ing) => (
                    <div 
                      key={ing.id} 
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                        ing.es_alergeno 
                          ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400 shadow-sm shadow-amber-200/20' 
                          : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {ing.es_alergeno && <AlertTriangle size={14} className="animate-pulse" />}
                      {ing.nombre}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No se han registrado ingredientes específicos para este producto.</p>
                )}
              </div>
              {producto.ingredientes?.some(i => i.es_alergeno) && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-tighter bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20">
                  <AlertTriangle size={12} />
                  ATENCIÓN: Este producto contiene ingredientes alérgenos.
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              className="flex-1 btn-cyan py-4 rounded-3xl text-lg shadow-xl shadow-cyan-500/10"
              onClick={() => navigate('/productos')}
            >
              <ChevronLeft size={20} />
              Volver al Catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
