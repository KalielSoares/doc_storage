from fastapi import APIRouter,status, UploadFile, File, Depends
from services.docs import DocsService
from core.dependencies import get_docs_services
from core.config import Settings, get_settings
from core.exceptions import InvalidInputError,ExeedLimitError

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
async def get_docs(docs_services: DocsService = Depends(get_docs_services)):
    return await docs_services.read()

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def create_doc(settings: Settings = Depends(get_settings),docs_services: DocsService = Depends(get_docs_services),file: UploadFile = File(...)):
    MAX_SIZE = settings.max_file_size_mb * 1024 * 1024
    if file.content_type not in settings.allowed_extensions:
        raise InvalidInputError(file.filename)
    
    if file.size > MAX_SIZE:
        raise ExeedLimitError()
    
    data = {
        "filename" : file.filename,
        "content_type" :file.content_type,
        "size" : file.size
    }
    
    bytes_file = await file.read()
    
    doc = await docs_services.create(data, bytes_file)
    
    return doc

@router.get("/{document_id}", status_code=status.HTTP_200_OK)
async def get_by_id(document_id: str, docs_services: DocsService = Depends(get_docs_services)):
    return await docs_services.read_by_id(document_id)
    
@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_by_id(document_id: str, docs_services: DocsService = Depends(get_docs_services)):
    await docs_services.delete(document_id)
   