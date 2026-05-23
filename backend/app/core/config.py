from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Literal

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False
    )
    #app
    ambiente: str = "dev"
    debug: bool = False

    #storage
    storage_backend: Literal["local"] = "local"
    upload_dir: str = "uploads"
    max_file_size_mb: int = 10
    allowed_extensions: list[str] = ["application/pdf", "text/plain"]

@lru_cache
def get_settings() -> Settings:
    return Settings()