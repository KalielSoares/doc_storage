import { useState, useRef, useCallback } from 'react'
import axios from 'axios'

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function UploadCard({ onUploadSuccess }) {
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [message, setMessage] = useState(null)
  const inputRef = useRef(null)

  const handleFile = (f) => {
    if (!f) return
    const ext = f.name.split('.').pop().toLowerCase()
    if (!['pdf', 'txt'].includes(ext)) {
      setMessage({ type: 'error', text: 'Apenas arquivos .pdf e .txt são permitidos.' })
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Arquivo muito grande. Máximo 10 MB.' })
      return
    }
    setFile(f)
    setMessage(null)
  }

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }, [])

  const handleUpload = async () => {
    if (!file || uploading) return
    setUploading(true)
    setProgress(0)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      await axios.post('/docs/upload', formData, {
        onUploadProgress: (e) => {
          if (e.total) setProgress(Math.round((e.loaded / e.total) * 100))
        },
      })
      setMessage({ type: 'success', text: 'Arquivo enviado com sucesso!' })
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      onUploadSuccess()
    } catch (err) {
      const detail = err.response?.data?.detail
      setMessage({ type: 'error', text: detail || 'Erro ao enviar arquivo.' })
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const dropZoneClass = [
    'drop-zone',
    dragging ? 'dragging' : '',
    file ? 'has-file' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="upload-card">
      <h2 className="section-title">Enviar documento</h2>

      <div
        className={dropZoneClass}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          style={{ display: 'none' }}
          onChange={(e) => { handleFile(e.target.files[0]); e.target.value = '' }}
        />

        {file ? (
          <div className="drop-zone-file">
            <svg className="drop-zone-icon" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span className="drop-zone-filename">{file.name}</span>
            <span className="drop-zone-filesize">{formatSize(file.size)}</span>
          </div>
        ) : (
          <div className="drop-zone-placeholder">
            <svg className="drop-zone-icon" width="28" height="28" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Arraste um arquivo ou clique para selecionar</span>
            <span className="drop-zone-hint">PDF ou TXT · máximo 10 MB</span>
          </div>
        )}
      </div>

      {uploading && (
        <div className="progress-wrapper">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-label">{progress}%</span>
        </div>
      )}

      {message && (
        <div className={`message message-${message.type}`}>{message.text}</div>
      )}

      <button
        className="upload-btn"
        onClick={handleUpload}
        disabled={!file || uploading}
      >
        {uploading ? 'Enviando...' : 'Enviar arquivo'}
      </button>
    </div>
  )
}
