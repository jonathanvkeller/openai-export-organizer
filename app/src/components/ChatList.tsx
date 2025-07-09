import { useState } from 'react'
import { useChat } from '../context/ChatContext'

export default function ChatList({ folderId }: { folderId: string | null }) {
  const { chats, createChat, renameChat, deleteChat } = useChat()
  const [newTitle, setNewTitle] = useState('')

  const filtered = chats.filter(
    c => c.is_visible !== false && (folderId === null || c.folder_id === folderId)
  )

  return (
    <div>
      <div className="flex mb-2">
        <input className="flex-1 p-1 bg-quaternary" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New chat" />
        <button className="ml-1 px-2 bg-secondary" onClick={() => { if (newTitle) { createChat(folderId, newTitle); setNewTitle('') } }}>Add</button>
      </div>
      <ul>
        {filtered.map(c => (
          <li key={c.id} className="p-2 flex justify-between">
            <span>{c.title}</span>
            <span>
              <button className="mx-1" onClick={() => { const name = prompt('Rename chat', c.title); if (name) renameChat(c.id, name) }}>✏️</button>
              <button onClick={() => { if (confirm('Delete chat?')) deleteChat(c.id) }}>🗑️</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
