import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Categorias from './pages/Categorias';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle';
import Ingredientes from './pages/Ingredientes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<ProductoDetalle />} />
        <Route path="ingredientes" element={<Ingredientes />} />
      </Route>
    </Routes>
  );
}
