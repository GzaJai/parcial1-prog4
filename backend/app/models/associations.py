from typing import Optional
from sqlmodel import SQLModel, Field
from sqlalchemy import BigInteger, Column, ForeignKey

class ProductoCategoria(SQLModel, table=True):
    __tablename__: str = "producto_categoria"
    
    producto_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, ForeignKey("producto.id"), primary_key=True)
    )
    categoria_id: Optional[int] = Field(
        default=None, 
        sa_column=Column(BigInteger, ForeignKey("categoria.id"), primary_key=True)
    )
    es_principal: bool = Field(default=False)
