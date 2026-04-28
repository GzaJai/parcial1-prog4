from typing import Optional, List, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import BigInteger, Column, VARCHAR, TEXT, ForeignKey

if TYPE_CHECKING:
    from .producto import Producto

class ProductoIngrediente(SQLModel, table=True):
    __tablename__: str = "producto_ingrediente"
    
    producto_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, ForeignKey("producto.id"), primary_key=True)
    )
    ingrediente_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, ForeignKey("ingrediente.id"), primary_key=True)
    )
    es_removible: bool = Field(default=False)

class Ingrediente(SQLModel, table=True):
    __tablename__: str = "ingrediente"
    
    id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, primary_key=True, autoincrement=True)
    )
    nombre: str = Field(
        sa_column=Column(VARCHAR(100), unique=True, nullable=False, index=True)
    )
    descripcion: Optional[str] = Field(
        default=None,
        sa_column=Column(TEXT, nullable=True)
    )
    es_alergeno: bool = Field(default=False)

    productos: List["Producto"] = Relationship(
        back_populates="ingredientes", 
        link_model=ProductoIngrediente
    )
