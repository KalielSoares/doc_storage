from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from routers import docs, health
from core.exceptions import AppError
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app : FastAPI):
    app.state.cache = {}
    print("aplicação iniciada")
    yield

    app.state.cache.clear()
    print("aplicação finalizada")

app = FastAPI(version="1.0.0",lifespan=lifespan)

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": exc.code, "message": exc.message},
    )

app.include_router(docs.router, prefix="/docs")
app.include_router(health.router)


 