from typing import List, Annotated
from fastapi import APIRouter, Depends, status, Path, Query
from sqlmodel import Session
from database import get_session
from uow.unit_of_work import UnitOfWork
from services.categoria_service import CategoriaService
from schemas.categoria import CategoriaRead, CategoriaCreate, CategoriaUpdate

router = APIRouter(prefix="/categorias", tags=["Categorias"])

def get_categoria_service(session: Annotated[Session, Depends(get_session)]):
    uow = UnitOfWork(session)
    return CategoriaService(uow)

@router.get("/", response_model=List[CategoriaRead], summary="Listar todas las categorías")
def listar_categorias(
    service: Annotated[CategoriaService, Depends(get_categoria_service)],
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100)
):
    return service.get_all(offset=offset, limit=limit)

@router.get("/{id}", response_model=CategoriaRead, summary="Obtener categoría por ID")
def obtener_categoria(
    id: Annotated[int, Path(title="El ID de la categoría")], 
    service: Annotated[CategoriaService, Depends(get_categoria_service)]
):
    return service.get_by_id(id)

@router.post("/", response_model=CategoriaRead, status_code=status.HTTP_201_CREATED, summary="Crear una nueva categoría")
def crear_categoria(
    data: CategoriaCreate, 
    service: Annotated[CategoriaService, Depends(get_categoria_service)]
):
    return service.create(data)

@router.patch("/{id}", response_model=CategoriaRead, summary="Actualizar una categoría")
def actualizar_categoria(
    id: Annotated[int, Path()], 
    data: CategoriaUpdate, 
    service: Annotated[CategoriaService, Depends(get_categoria_service)]
):
    return service.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar una categoría")
def eliminar_categoria(
    id: Annotated[int, Path()], 
    service: Annotated[CategoriaService, Depends(get_categoria_service)]
):
    service.delete(id)
