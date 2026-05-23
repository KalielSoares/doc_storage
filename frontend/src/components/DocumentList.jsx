import { useState } from 'react'
import axios from 'axios'
import DocModal from './DocModal'

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DocCard({ doc, onDelete, onOpen }) {
  const [deleting, setDeleting] = useState(false)
  const isPdf = doc.content_type?.includes('pdf')

  const handleDelete = async (e) => {
    e.stopPropagation()
    setDeleting(true)
    try {
      await axios.delete(`/docs/${doc.id}`)
      onDelete()
    } catch {
      setDeleting(false)
    }
  }

  return (
    <div className="doc-card" onClick={onOpen} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}>
      <div className="doc-info">
        <span className="doc-name" title={doc.filename}>{doc.filename}</span>
        <div className="doc-meta">
          <span className={`file-tag ${isPdf ? 'file-tag-pdf' : 'file-tag-txt'}`}>
            {isPdf ? 'PDF' : 'TXT'}
          </span>
          <span className="doc-size">{formatSize(doc.size)}</span>
        </div>
      </div>
      <button
        className="delete-btn"
        onClick={handleDelete}
        disabled={deleting}
        title="Remover documento"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.8"
          strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
      </button>
    </div>
  )
}

export default function DocumentList({ docs, loading, onRefresh }) {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="docs-card">
      <div className="docs-header">
        <h2 className="section-title">Documentos</h2>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading} title="Atualizar">
          ↺
        </button>
      </div>

      {loading ? (
        <div className="list-placeholder">Carregando...</div>
      ) : docs.length === 0 ? (
        <div className="list-empty">
          <span>Nenhum documento ainda</span>
        </div>
      ) : (
        <div className="doc-grid">
          {docs.map((doc) => (
            <DocCard key={doc.id} doc={doc} onDelete={onRefresh} onOpen={() => setSelectedId(doc.id)} />
          ))}
        </div>
      )}

      {selectedId && (
        <DocModal docId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
