const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function DocCard({ doc }) {
  const isPdf = doc.content_type?.includes('pdf')
  return (
    <div className="doc-card">
      <div className="doc-info">
        <span className="doc-name" title={doc.filename}>{doc.filename}</span>
        <div className="doc-meta">
          <span className={`file-tag ${isPdf ? 'file-tag-pdf' : 'file-tag-txt'}`}>
            {isPdf ? 'PDF' : 'TXT'}
          </span>
          <span className="doc-size">{formatSize(doc.size)}</span>
        </div>
      </div>
    </div>
  )
}

export default function DocumentList({ docs, loading, onRefresh }) {
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
          {docs.map((doc, i) => <DocCard key={i} doc={doc} />)}
        </div>
      )}
    </div>
  )
}
