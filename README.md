# PaperBox

API REST para ingestão e organização de documentos pessoais. Envie PDFs e TXTs, consulte metadados e remova arquivos via endpoints simples. Inclui interface web para interação direta.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | Python 3.12 · FastAPI · uvicorn · aiofiles · pydantic-settings |
| Frontend | React 19 · Vite · axios |
| Produção | nginx (reverse proxy + SPA) · Docker Compose |

---

## Como rodar

### Docker (recomendado)

```bash
docker compose up --build
```

| Serviço | Endereço |
|---------|----------|
| Interface web | `http://localhost:80` |
| API | `http://localhost:8000` |
| Documentação interativa | `http://localhost:8000/docs` |

Os arquivos enviados são persistidos no volume `uploads_data` — reiniciar os containers não apaga os dados.

> **Atenção:** os metadados ficam em memória. Reiniciar o container da API limpa a lista de documentos, mas os arquivos físicos permanecem no volume.

---

### Local

#### Backend

Requer Python 3.14+ e [`uv`](https://docs.astral.sh/uv/).

```bash
cd backend/app
uv sync
uv run fastapi dev main.py
```

API em `http://localhost:8000` · Docs em `http://localhost:8000/docs`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Interface em `http://localhost:5173`

> Em modo local o Vite proxia `/docs` e `/health` para `http://localhost:8000` — o backend precisa estar rodando.

---

## Endpoints

### Health

| Método | Rota | Resposta |
|--------|------|----------|
| `GET` | `/health` | `{"status": "ok", "versao": "1.0.0"}` |

### Documentos

| Método | Rota | Descrição | Status |
|--------|------|-----------|--------|
| `GET` | `/docs/` | Lista todos os documentos | 200 |
| `POST` | `/docs/upload` | Faz upload de um arquivo | 201 |
| `GET` | `/docs/{doc_id}` | Retorna metadados de um documento | 200 |
| `DELETE` | `/docs/{doc_id}` | Remove o documento | 204 |

#### POST /docs/upload

Aceita `multipart/form-data` com o campo `file`. Tipos permitidos: `application/pdf` e `text/plain`.

**Resposta (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "filename": "relatorio.pdf",
  "content_type": "application/pdf",
  "size": 204800
}
```

#### GET /docs/ e GET /docs/{doc_id}

Retornam o mesmo schema acima (lista ou objeto único).

---

## Erros

Todos os erros retornam JSON no formato:

```json
{ "error": "código_do_erro", "message": "descrição" }
```

| Status | Código | Quando |
|--------|--------|--------|
| 400 | `entrada_invalida` | Tipo de arquivo não permitido |
| 404 | `não_encontrada` | Documento não existe |
| 413 | `tamanho_invalido` | Arquivo excede o limite configurado |

---

## Variáveis de ambiente

O backend lê de um arquivo `.env` dentro de `backend/app/`. Em Docker as variáveis são definidas no `docker-compose.yml`.

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `AMBIENTE` | `dev` | Ambiente de execução |
| `DEBUG` | `false` | Modo debug |
| `STORAGE_BACKEND` | `local` | Backend de armazenamento |
| `UPLOAD_DIR` | `uploads` | Diretório de uploads |
| `MAX_FILE_SIZE_MB` | `10` | Tamanho máximo por arquivo (MB) |

Exemplo de `.env` para desenvolvimento local:

```env
AMBIENTE=dev
DEBUG=false
STORAGE_BACKEND=local
UPLOAD_DIR=uploads
MAX_FILE_SIZE_MB=10
```

---

## Estrutura

```
.
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   └── app/
│       ├── pyproject.toml
│       ├── main.py              # App, lifespan, exception handler
│       ├── core/
│       │   ├── config.py        # Settings via pydantic-settings
│       │   ├── protocols.py     # Contratos StorageBackend e DocStore
│       │   ├── exceptions.py    # Hierarquia de erros do domínio
│       │   └── dependencies.py  # Wiring via FastAPI Depends
│       ├── infra/
│       │   ├── storage_local.py    # I/O de arquivos com aiofiles
│       │   └── doc_store_memory.py # Metadados em memória (dict)
│       ├── services/
│       │   └── docs.py          # Lógica de negócio
│       └── routers/
│           ├── docs.py          # Endpoints /docs
│           └── health.py        # Endpoint /health
└── frontend/
    ├── Dockerfile
    ├── nginx.conf               # Proxy /docs e /health → api:8000
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        └── components/
            ├── UploadCard.jsx
            ├── DocumentList.jsx
            └── DocModal.jsx
```
