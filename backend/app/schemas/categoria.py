from typing import Optional, List
from pydantic import BaseModel

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    imagen_url: Optional[str] = None
    parent_id: Optional[int] = None

class CategoriaRead(CategoriaBase):
    id: int
    
    class Config:
        from_attributes = True

class CategoriaTree(CategoriaRead):
    subcategorias: List["CategoriaRead"] = []
