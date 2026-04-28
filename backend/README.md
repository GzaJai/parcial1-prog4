# Backend - Parcial 1

Este es el backend desarrollado con **FastAPI**, **SQLModel** y **PostgreSQL**.

## Requisitos
- Python 3.9+
- PostgreSQL

## Instalación

1. Crear un entorno virtual:
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # En Windows
   ```

2. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   ```

3. Configurar la base de datos en el archivo `.env`.

## Ejecución

Para iniciar el servidor de desarrollo:
```bash
uvicorn app.main:app --reload
```

La documentación interactiva estará disponible en:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)
