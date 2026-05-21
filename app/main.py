from fastapi import FastAPI

app = FastAPI()

@app.get("/health", status_code=200)
async def get_health():
    return {"status": "ok", "versao": "1.0.0"}  