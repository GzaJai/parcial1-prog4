export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  imagen_url?: string;
  parent_id?: number;
}

export type CategoriaCreate = Omit<Categoria, 'id'>;
export type CategoriaUpdate = Partial<CategoriaCreate>;

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio_base: string;
  imagenes_url: string[];
  stock_cantidad: number;
  disponible: boolean;
  categorias?: Categoria[];
  ingredientes?: Ingrediente[];
}

export interface ProductoCreate extends Omit<Producto, 'id' | 'precio_base'> {
  precio_base: number;
  categoria_ids: number[];
  ingrediente_ids: number[];
}

export type ProductoUpdate = Partial<ProductoCreate>;

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
}

export type IngredienteCreate = Omit<Ingrediente, 'id'>;
export type IngredienteUpdate = Partial<IngredienteCreate>;
