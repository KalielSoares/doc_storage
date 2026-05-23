from core.protocols import Metadata


class DocStoreMemory():
    def __init__(self):
        self._store: dict[str, Metadata] = {}

    async def create(self,document_id: str, metadata: Metadata) -> None :
        self._store[document_id] = metadata
    
    async def read_by_id(self, document_id : str) -> dict | None :
        if document_id in self._store:
            return self._store.get(document_id)

    async def read(self) -> list[dict] :
        return [{"id": doc_id, **meta} for doc_id, meta in self._store.items()]
    
    async def delete(self,document_id: str) -> None :
        self._store.pop(document_id)