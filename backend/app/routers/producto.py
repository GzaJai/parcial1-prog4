from typing import List, Annotated
from fastapi import APIRouter, Depends, status, Path, Query
from sqlmodel import Session
from database import get_session
from uow.unit_of_work import UnitOfWork
from services.producto_service import ProductoService
from schemas.producto import ProductoRead, ProductoCreate, ProductoUpdate

router = APIRouter(prefix="/productos", tags=["Productos"])

def get_producto_service(session: Annotated[Session, Depends(get_session)]):
    uow = UnitOfWork(session)
    return ProductoService(uow)

@router.get("/", response_model=List[ProductoRead], summary="Listar todos los productos", description="Retorna una lista de todos los productos registrados en el sistema.")
def listar_productos(
    service: Annotated[ProductoService, Depends(get_producto_service)],
    offset: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(10, ge=1, le=100, description="Número máximo de registros a retornar")
):
    return service.get_all(offset=offset, limit=limit)

@router.get("/{id}", response_model=ProductoRead, summary="Obtener producto por ID")
def obtener_producto(
    id: Annotated[int, Path()], 
    service: Annotated[ProductoService, Depends(get_producto_service)]
):
    return service.get_by_id(id)

@router.post("/", response_model=ProductoRead, status_code=status.HTTP_201_CREATED, summary="Crear un nuevo producto")
def crear_producto(
    data: ProductoCreate, 
    service: Annotated[ProductoService, Depends(get_producto_service)]
):
    return service.create(data)

@router.patch("/{id}", response_model=ProductoRead, summary="Actualizar un producto existente")
def actualizar_producto(
    id: Annotated[int, Path()], 
    data: ProductoUpdate, 
    service: Annotated[ProductoService, Depends(get_producto_service)]
):
    return service.update(id, data)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT, summary="Eliminar un producto")
def eliminar_producto(
    id: Annotated[int, Path()], 
    service: Annotated[ProductoService, Depends(get_producto_service)]
):
    service.delete(id)
