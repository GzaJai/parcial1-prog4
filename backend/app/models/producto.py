from typing import Optional, List, TYPE_CHECKING
from decimal import Decimal
from sqlmodel import SQLModel, Field, Relationship, Column, JSON
from sqlalchemy import BigInteger
from .associations import ProductoCategoria
from .ingrediente import ProductoIngrediente

if TYPE_CHECKING:
    from .categoria import Categoria
    from .ingrediente import Ingrediente

class Producto(SQLModel, table=True):
    __tablename__: str = "producto"
    
    id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, primary_key=True, autoincrement=True)
    )
    nombre: str = Field(index=True)
    descripcion: str
    precio_base: Decimal = Field(max_digits=10, decimal_places=2)
    imagenes_url: List[str] = Field(default_factory=list, sa_column=Column(JSON))
    stock_cantidad: int = Field(default=0)
    disponible: bool = Field(default=True)

    categorias: List["Categoria"] = Relationship(
        back_populates="productos", 
        link_model=ProductoCategoria
    )
    
    ingredientes: List["Ingrediente"] = Relationship(
        back_populates="productos", 
        link_model=ProductoIngrediente
    )
