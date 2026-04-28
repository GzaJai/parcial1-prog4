from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_db
from routers import categoria, producto, ingrediente
import models

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup:
    init_db()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="API de Gestión de Productos y Categorías",
    description="Sistema Backend para Parcial Universitario con FastAPI, SQLModel y PostgreSQL",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categoria.router)
app.include_router(producto.router)
app.include_router(ingrediente.router)

@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "API de Gestión de Productos y Categorías - Parcial UTN",
        "swagger_docs": "/docs",
        "redoc_docs": "/redoc",
        "status": "online"
    }
