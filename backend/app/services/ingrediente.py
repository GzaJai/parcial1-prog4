from typing import List
from sqlmodel import select
from fastapi import HTTPException, status
from models.ingrediente import Ingrediente
from schemas.ingrediente import IngredienteCreate, IngredienteUpdate
from uow.unit_of_work import UnitOfWork

class IngredienteService:
    def __init__(self, uow: UnitOfWork):
        self.uow = uow

    def get_all(self, offset: int = 0, limit: int = 10) -> List[Ingrediente]:
        return self.uow.session.exec(select(Ingrediente).offset(offset).limit(limit)).all()

    def get_by_id(self, id: int) -> Ingrediente:
        ingrediente = self.uow.session.get(Ingrediente, id)
        if not ingrediente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, 
                detail="Ingrediente no encontrado"
            )
        return ingrediente

    def create(self, data: IngredienteCreate) -> Ingrediente:
        nuevo_ingrediente = Ingrediente(**data.model_dump())
        self.uow.add(nuevo_ingrediente)
        self.uow.commit()
        self.uow.refresh(nuevo_ingrediente)
        return nuevo_ingrediente

    def update(self, id: int, data: IngredienteUpdate) -> Ingrediente:
        ingrediente = self.get_by_id(id)
        update_data = data.model_dump(exclude_unset=True)
        
        for key, value in update_data.items():
            setattr(ingrediente, key, value)
        
        self.uow.add(ingrediente)
        self.uow.commit()
        self.uow.refresh(ingrediente)
        return ingrediente

    def delete(self, id: int) -> None:
        ingrediente = self.get_by_id(id)
        self.uow.delete(ingrediente)
        self.uow.commit()
