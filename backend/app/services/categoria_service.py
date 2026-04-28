from typing import List, Optional
from sqlmodel import select
from fastapi import HTTPException, status
from models.categoria import Categoria
from schemas.categoria import CategoriaCreate, CategoriaUpdate
from uow.unit_of_work import UnitOfWork

class CategoriaService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_all(self, offset: int = 0, limit: int = 10) -> List[Categoria]:
        statement = select(Categoria).offset(offset).limit(limit)
        return self.uow.session.exec(statement).all()

    def get_by_id(self, id: int) -> Categoria:
        categoria = self.uow.session.get(Categoria, id)
        if not categoria:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Categoría no encontrada")
        return categoria

    def create(self, data: CategoriaCreate) -> Categoria:
        existente = self.uow.session.exec(select(Categoria).where(Categoria.nombre == data.nombre)).first()
        if existente:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El nombre de la categoría ya existe")
        
        nueva_cat = Categoria(**data.model_dump())
        self.uow.add(nueva_cat)
        self.uow.commit()
        self.uow.refresh(nueva_cat)
        return nueva_cat

    def update(self, id: int, data: CategoriaUpdate) -> Categoria:
        categoria = self.get_by_id(id)
        update_data = data.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(categoria, key, value)
        self.uow.add(categoria)
        self.uow.commit()
        self.uow.refresh(categoria)
        return categoria

    def delete(self, id: int):
        categoria = self.get_by_id(id)
        self.uow.delete(categoria)
        self.uow.commit()
