import { useState } from 'react'
import { useChat } from '../context/ChatContext'
import type { AppState } from "../types"

export default function ImportPanel() {
  const { importData } = useChat()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const text = await file.text()
      const data = JSON.parse(text) as AppState
      importData(data)
    } catch {
      setError('Failed to import')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="my-2">
      <input type="file" accept="application/json" onChange={handleFile} />
      {loading && <span className="ml-2">Loading...</span>}
      {error && <span className="ml-2 text-red-500">{error}</span>}
    </div>
  )
}
