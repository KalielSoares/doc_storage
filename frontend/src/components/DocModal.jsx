import { useState, useEffect } from 'react'
import axios from 'axios'

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocModal({ docId, onClose }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios.get(`/docs/${docId}`)
      .then(res => setData(res.data))
      .catch(() => setError(true))
  }, [docId])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Detalhes do documento</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {error ? (
            <p className="modal-error">Não foi possível carregar os detalhes.</p>
          ) : !data ? (
            <p className="modal-loading">Carregando...</p>
          ) : (
            <>
              <div className="modal-row">
                <span className="modal-label">Nome</span>
                <span className="modal-value">{data.filename}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Tipo</span>
                <span className="modal-value">{data.content_type}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">Tamanho</span>
                <span className="modal-value">{formatSize(data.size)}</span>
              </div>
              <div className="modal-row">
                <span className="modal-label">ID</span>
                <span className="modal-value modal-id">{docId}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
