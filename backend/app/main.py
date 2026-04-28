# app/main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from database import init_db
from seed import seed_data
from routers import categoria, producto, ingrediente, upload
import models

# Asegurar que el directorio de uploads exista antes de montar StaticFiles
os.makedirs("app/uploads", exist_ok=True)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Iniciar la base de datos (crear tablas)
    init_db()
    # Ejecutar el sembrado de datos iniciales automáticamente
    seed_data()
    yield

app = FastAPI(
    title="API de Gestión de Productos y Categorías",
    description="Sistema Backend para Parcial Universitario con FastAPI, SQLModel y PostgreSQL",
    version="1.2.0",
    lifespan=lifespan
)

# Configuración de CORS para permitir peticiones desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Montar archivos estáticos para servir imágenes cargadas localmente
app.mount("/static", StaticFiles(directory="app/uploads"), name="static")

# Inclusión de Routers del sistema
app.include_router(categoria.router)
app.include_router(producto.router)
app.include_router(ingrediente.router)
app.include_router(upload.router)

@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "API de Gestión de Productos y Categorías - Parcial UTN",
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc",
        "status": "online",
        "database": "connected"
    }
