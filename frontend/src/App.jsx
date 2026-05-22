import { useState, useEffect } from 'react'
import './App.css'
import UploadCard from './components/UploadCard'
import DocumentList from './components/DocumentList'

function App() {
  const [health, setHealth] = useState('loading')
  const [docs, setDocs] = useState([])
  const [docsLoading, setDocsLoading] = useState(true)

  const fetchDocs = async () => {
    setDocsLoading(true)
    try {
      const res = await fetch('/docs/')
      if (!res.ok) throw new Error()
      setDocs(await res.json())
    } catch {
      setDocs([])
    } finally {
      setDocsLoading(false)
    }
  }

  useEffect(() => {
    fetch('/health')
      .then(r => r.json())
      .then(d => setHealth(d.status === 'ok' ? 'ok' : 'error'))
      .catch(() => setHealth('error'))

    fetchDocs()
  }, [])

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <span className="logo">PaperBox</span>
          <div className="header-status">
            <span className={`health-dot health-${health}`} />
            <span className="status-label">
              {health === 'ok' ? 'API online' : health === 'error' ? 'API offline' : 'Verificando...'}
            </span>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="layout">
          <UploadCard onUploadSuccess={fetchDocs} />
          <DocumentList docs={docs} loading={docsLoading} onRefresh={fetchDocs} />
        </div>
      </main>
    </>
  )
}

export default App
