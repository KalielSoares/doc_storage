# PaperBox

API de ingestão e organização de documentos pessoais. Envie PDFs e TXTs, organize em coleções e busque por keyword.

Projeto em desenvolvimento — construído do zero como exercício de aprendizado com FastAPI.

---

## Stack

**Backend**
- Python 3.14 + FastAPI + uvicorn
- aiofiles — I/O assíncrono de arquivos
- pydantic-settings — configuração via variáveis de ambiente

**Frontend**
- React + Vite

---

## Como rodar

### Backend

```bash
cd backend/app
uv sync
uv run fastapi dev main.py
```

API disponível em `http://localhost:8000`  
Documentação interativa em `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface disponível em `http://localhost:5173`

> O frontend proxia `/docs` e `/health` para `http://localhost:8000` — o backend precisa estar rodando.

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Status da API |
| `GET` | `/docs/` | Lista todos os documentos |
| `POST` | `/docs/upload` | Faz upload de um arquivo (PDF ou TXT) |
| `GET` | `/docs/{doc_id}` | Retorna metadados de um documento |
| `DELETE` | `/docs/{doc_id}` | Remove um documento |

---

## Estrutura

```
.
├── backend/app/
│   ├── core/
│   │   ├── config.py        # Settings com pydantic-settings
│   │   ├── protocols.py     # StorageBackend, DocStore (contratos)
│   │   ├── exceptions.py    # Hierarquia de erros do domínio
│   │   └── dependencies.py  # Wiring via FastAPI Depends
│   ├── infra/
│   │   ├── storage_local.py    # Armazenamento local async
│   │   └── doc_store_memory.py # Metadados em memória
│   ├── services/
│   │   └── docs.py          # Lógica de negócio
│   ├── routers/
│   │   ├── docs.py          # Endpoints de documentos
│   │   └── health.py        # Health check
│   └── main.py              # App, lifespan, routers
└── frontend/
    └── src/
        ├── components/
        │   ├── UploadCard.jsx
        │   └── DocumentList.jsx
        └── App.jsx
```

---

## Variáveis de ambiente

Crie um `.env` dentro de `backend/app/`:

```env
AMBIENTE=dev
DEBUG=false
STORAGE_BACKEND=local
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```
