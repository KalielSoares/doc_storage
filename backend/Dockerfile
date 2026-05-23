FROM python:3.12-slim

RUN pip install uv

WORKDIR /code

COPY app/pyproject.toml .

RUN uv pip install --system --no-cache \
    "fastapi[standard]>=0.136.1" \
    "aiofiles>=25.1.0" \
    "pydantic>=2.13.4" \
    "python-multipart>=0.0.29"

COPY app/ .

RUN mkdir -p uploads

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
