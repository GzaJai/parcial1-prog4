import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pathlib import Path

router = APIRouter(prefix="/upload", tags=["Uploads"])

UPLOAD_DIR = Path("app/uploads")

@router.post("/imagen/", status_code=status.HTTP_201_CREATED)
async def upload_imagen(file: UploadFile = File(...)):
    # Validar que el archivo sea una imagen
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El archivo debe ser una imagen"
        )
    
    # Generar nombre único preservando la extensión original
    extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    try:
        # Guardar el archivo físicamente
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"No se pudo guardar la imagen: {str(e)}"
        )
    finally:
        file.file.close()
        
    return {"url": f"/static/{unique_filename}"}
