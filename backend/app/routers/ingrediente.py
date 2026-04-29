from typing import List
from fastapi import APIRouter, Depends, status, Query
from sqlmodel import Session
from database import get_session
from uow.unit_of_work import UnitOfWork
from services.ingrediente import IngredienteService
from schemas.ingrediente import IngredienteCreate, IngredienteRead, IngredienteUpdate

router = APIRouter(prefix="/ingredientes", tags=["Ingredientes"])

def get_ingrediente_service(session: Session = Depends(get_session)):
    uow = UnitOfWork(session)
    return IngredienteService(uow)

from typing import Optional
from schemas.common import PaginatedResponse

@router.get("/", response_model=PaginatedResponse[IngredienteRead], status_code=status.HTTP_200_OK)
def list_ingredientes(
    service: IngredienteService = Depends(get_ingrediente_service),
    offset: int = Query(0, ge=0),
    limit: Optional[int] = Query(None, ge=1, le=1000)
):
    result = service.get_all(offset=offset, limit=limit)
    return {
        "items": result["items"],
        "total": result["total"],
        "offset": offset,
        "limit": limit or result["total"],
        "count": len(result["items"])
    }

@router.get("/{id}", response_model=IngredienteRead, status_code=status.HTTP_200_OK)
def get_ingrediente(id: int, service: IngredienteService = Depends(get_ingrediente_service)):
    return service.get_by_id(id)

@router.post("/", response_model=IngredienteRead, status_code=status.HTTP_201_CREATED)
def create_ingrediente(data: IngredienteCreate, service: IngredienteService = Depends(get_ingrediente_service)):
    return service.create(data)

@router.patch("/{id}", response_model=IngredienteRead, status_code=status.HTTP_200_OK)
def update_ingrediente(id: int, data: IngredienteUpdate, service: IngredienteService = Depends(get_ingrediente_service)):
    return service.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ingrediente(id: int, service: IngredienteService = Depends(get_ingrediente_service)):
    service.delete(id)
    return None
