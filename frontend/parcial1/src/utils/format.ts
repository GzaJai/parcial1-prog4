import { API_URL } from '../services/api';

/**
 * Normaliza una URL de imagen para asegurar que sea absoluta.
 * Si el backend devuelve una ruta relativa (ej: /static/...), antepone la API_URL.
 */
export const getImageUrl = (path: string | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  // Asegurar que no haya doble diagonal
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_URL}${cleanPath}`;
};
