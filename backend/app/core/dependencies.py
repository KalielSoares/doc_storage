from functools import lru_cache
from fastapi import Depends
from core.config import get_settings, Settings
from core.protocols import (
    StorageBackend,
    DocStore
)
from services.docs import DocsService

def get_storage(settings: Settings = Depends(get_settings)) -> StorageBackend:
    if settings.storage_backend == "local":
        from infra.storage_local import LocalStorage
        return LocalStorage(settings)
    else:
        raise NotImplementedError

@lru_cache
def get_doc_store() -> DocStore:
    from infra.doc_store_memory import DocStoreMemory
    return DocStoreMemory()


def get_docs_services(
    storage: StorageBackend = Depends(get_storage),
    doc_store: DocStore = Depends(get_doc_store)) -> DocsService:
    return DocsService(storage,doc_store)