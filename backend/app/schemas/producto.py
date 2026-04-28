from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel, ConfigDict

class ProductoBase(BaseModel):
    nombre: str
    descripcion: str
    precio_base: Decimal
    imagenes_url: List[str] = []
    stock_cantidad: int = 0
    disponible: bool = True

class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = []
    ingrediente_ids: List[int] = []

class ProductoUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio_base: Optional[Decimal] = None
    imagenes_url: Optional[List[str]] = None
    stock_cantidad: Optional[int] = None
    disponible: Optional[bool] = None
    categoria_ids: Optional[List[int]] = None
    ingrediente_ids: Optional[List[int]] = None

from .categoria import CategoriaRead
from .ingrediente import IngredienteRead

class ProductoRead(ProductoBase):
    id: int
    categorias: List[CategoriaRead] = []
    ingredientes: List[IngredienteRead] = []
    
    model_config = ConfigDict(from_attributes=True)
