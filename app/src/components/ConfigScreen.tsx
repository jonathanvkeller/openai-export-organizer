import { useState } from 'react'
import { useChat } from '../context/ChatContext'

export default function ConfigScreen() {
  const { apiKey, setApiKey } = useChat()
  const [value, setValue] = useState(apiKey || '')

  return (
    <div className="my-2">
      <input className="p-2 bg-quaternary w-full" placeholder="OpenAI/OpenRouter Key" value={value} onChange={e => setValue(e.target.value)} />
      <button className="mt-2 px-4 py-1 bg-secondary" onClick={() => setApiKey(value)}>Save</button>
    </div>
  )
}
