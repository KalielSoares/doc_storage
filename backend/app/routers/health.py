from fastapi import APIRouter,status


router = APIRouter()

@router.get("/health", status_code=status.HTTP_200_OK)
async def get_health():
    return {"status": "ok", "versao": "1.0.0"} 