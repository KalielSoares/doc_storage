from fastapi import APIRouter,status, UploadFile, File, Depends
from services.docs import DocsService
from core.dependencies import get_docs_services

router = APIRouter()

@router.get("/", status_code=status.HTTP_200_OK)
async def get_docs(docs_services: DocsService = Depends(get_docs_services)):
    return await docs_services.read()

@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def create_doc(docs_services: DocsService = Depends(get_docs_services),file: UploadFile = File(...)):
    data = {
        "filename" : file.filename,
        "content_type" :file.content_type,
        "size" : file.size
    }
    
    bytes_file = await file.read()
    doc_id = await docs_services.create(data, bytes_file)
    
    return doc_id