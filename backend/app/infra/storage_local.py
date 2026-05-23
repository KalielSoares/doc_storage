import aiofiles
import aiofiles.os
from core.config import Settings

class LocalStorage:
    def __init__(self, settings: Settings):
        self.settings = settings
    
    async def create(self,
                    document_id: str,
                    document: bytes
                    ) -> str : 
        async with aiofiles.open(f"{self.settings.upload_dir}/{document_id}", "wb") as out:
            await out.write(document)
        return document_id
   
    
    async def read(self, document_id: str) -> bytes :
        async with aiofiles.open(f"{self.settings.upload_dir}/{document_id}", mode="rb") as f:
            return await f.read()
    
        
    
    async def exists(self,document_id: str) -> bool :
        if await aiofiles.os.path.exists(f"{self.settings.upload_dir}/{document_id}"):
            return True
        else:
            return False
        
    
    async def delete(self,document_id: str) -> None :
        await aiofiles.os.remove(f"{self.settings.upload_dir}/{document_id}")
