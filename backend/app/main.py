from fastapi import FastAPI
from routers import docs, health
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app : FastAPI):
    app.state.cache = {}
    print("aplicação iniciada")
    yield

    app.state.cache.clear()
    print("aplicação finalizada")

app = FastAPI(version="1.0.0",lifespan=lifespan)

app.include_router(docs.router, prefix="/docs")
app.include_router(health.router)


 