from typing import List
from sqlmodel import select
from fastapi import HTTPException, status
from models.producto import Producto
from models.categoria import Categoria
from models.ingrediente import Ingrediente, ProductoIngrediente
from models.associations import ProductoCategoria
from schemas.producto import ProductoCreate, ProductoUpdate
from uow.unit_of_work import UnitOfWork

class ProductoService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_all(self, offset: int = 0, limit: int = 10) -> List[Producto]:
        return self.uow.session.exec(select(Producto).offset(offset).limit(limit)).all()

    def get_by_id(self, id: int) -> Producto:
        producto = self.uow.session.get(Producto, id)
        if not producto:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Producto no encontrado")
        return producto

    def create(self, data: ProductoCreate) -> Producto:
        producto_data = data.model_dump(exclude={"categoria_ids", "ingrediente_ids"})
        nuevo_prod = Producto(**producto_data)
        self.uow.add(nuevo_prod)
        self.uow.flush() 

        for cat_id in data.categoria_ids:
            categoria = self.uow.session.get(Categoria, cat_id)
            if categoria:
                self.uow.add(ProductoCategoria(producto_id=nuevo_prod.id, categoria_id=cat_id))

        for ing_id in data.ingrediente_ids:
            ingrediente = self.uow.session.get(Ingrediente, ing_id)
            if ingrediente:
                self.uow.add(ProductoIngrediente(producto_id=nuevo_prod.id, ingrediente_id=ing_id))

        self.uow.commit()
        self.uow.refresh(nuevo_prod)
        return nuevo_prod

    def update(self, id: int, data: ProductoUpdate) -> Producto:
        producto = self.get_by_id(id)
        update_dict = data.model_dump(exclude_unset=True, exclude={"categoria_ids", "ingrediente_ids"})
        
        for key, value in update_dict.items():
            setattr(producto, key, value)
        
        if data.categoria_ids is not None:
            # Limpiar relaciones anteriores
            statement = select(ProductoCategoria).where(ProductoCategoria.producto_id == id)
            viejas_relaciones = self.uow.session.exec(statement).all()
            for rel in viejas_relaciones:
                self.uow.delete(rel)
            
            # Agregar nuevas
            for cat_id in data.categoria_ids:
                categoria = self.uow.session.get(Categoria, cat_id)
                if categoria:
                    self.uow.add(ProductoCategoria(producto_id=id, categoria_id=cat_id))

        if data.ingrediente_ids is not None:
            # Limpiar relaciones anteriores
            statement = select(ProductoIngrediente).where(ProductoIngrediente.producto_id == id)
            viejas_relaciones = self.uow.session.exec(statement).all()
            for rel in viejas_relaciones:
                self.uow.delete(rel)
            
            # Agregar nuevas
            for ing_id in data.ingrediente_ids:
                ingrediente = self.uow.session.get(Ingrediente, ing_id)
                if ingrediente:
                    self.uow.add(ProductoIngrediente(producto_id=id, ingrediente_id=ing_id))

        self.uow.add(producto)
        self.uow.commit()
        self.uow.refresh(producto)
        return producto

    def delete(self, id: int):
        producto = self.get_by_id(id)
        self.uow.delete(producto)
        self.uow.commit()
