from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import BigInteger, Column, ForeignKey
from .associations import ProductoCategoria

if TYPE_CHECKING:
    from .producto import Producto

class Categoria(SQLModel, table=True):
    __tablename__: str = "categoria"
    
    id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, primary_key=True, autoincrement=True)
    )
    parent_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, ForeignKey("categoria.id"), nullable=True)
    )
    nombre: str = Field(unique=True, index=True)
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None

    parent: Optional["Categoria"] = Relationship(
        back_populates="subcategorias", 
        sa_relationship_kwargs={"remote_side": "Categoria.id"}
    )
    subcategorias: List["Categoria"] = Relationship(back_populates="parent")
    
    productos: List["Producto"] = Relationship(
        back_populates="categorias", 
        link_model=ProductoCategoria
    )
