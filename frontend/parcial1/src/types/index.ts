export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number | null;
}

export type CategoriaCreate = Omit<Categoria, 'id'>;
export type CategoriaUpdate = Partial<CategoriaCreate>;

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
}

export type IngredienteCreate = Omit<Ingrediente, 'id'>;
export type IngredienteUpdate = Partial<IngredienteCreate>;

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion: string;
  precio_base: number;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
}

export type ProductoUpdate = Partial<ProductoCreate>;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  offset: number;
  limit: number;
  count: number;
}
