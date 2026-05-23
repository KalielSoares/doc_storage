import uuid
from core.protocols import (
    DocStore,
    StorageBackend,
    Metadata
)
from core.exceptions import NotFoundedError

class DocsService():
    def __init__(self, storage_backend: StorageBackend, doc_store: DocStore):
        self.storage_backend = storage_backend
        self.doc_store = doc_store

    async def create(self,metadata: Metadata, document: bytes) -> dict:
        id = str(uuid.uuid4())
        await self.doc_store.create(id, metadata)
        await self.storage_backend.create(id, document)
        return { "id" : id, **metadata}
    
    async def delete(self, document_id: str) -> None : 
        await self.doc_store.delete(document_id)
        await self.storage_backend.delete(document_id)

    async def exists(self,document_id: str) -> bool :
        return await self.storage_backend.exists(document_id)
    
    async def read_file(self, document_id: str) -> bytes :
        return await self.storage_backend.read(document_id)
    
    async def read(self) -> list[dict] :
        return await self.doc_store.read()
    
    async def read_by_id(self, document_id : str) -> dict | None :
        doc = await self.doc_store.read_by_id(document_id)
        if doc is None:
            raise NotFoundedError(document_id)
        return doc       