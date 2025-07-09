import { useState } from 'react'
import { useChat } from '../context/ChatContext'

export default function FolderList({ onSelect, selectedId }: { onSelect(id: string | null): void, selectedId: string | null }) {
  const { folders, createFolder, renameFolder, deleteFolder } = useChat()
  const [newName, setNewName] = useState('')

  return (
    <div>
      <div className="flex mb-2">
        <input className="flex-1 p-1 bg-quaternary" value={newName} onChange={e => setNewName(e.target.value)} placeholder="New folder" />
        <button className="ml-1 px-2 bg-secondary" onClick={() => { if (newName) { createFolder(newName); setNewName('') } }}>Add</button>
      </div>
      <ul>
        <li className={`p-2 cursor-pointer ${selectedId===null ? 'bg-accent' : ''}`} onClick={() => onSelect(null)}>All Chats</li>
        {folders.filter(f => f.is_visible !== false).map(f => (
          <li key={f.id} className={`p-2 flex justify-between cursor-pointer ${selectedId===f.id ? 'bg-accent' : ''}`}
              onClick={() => onSelect(f.id)}>
            <span>{f.name}</span>
            <span>
              <button className="mx-1" onClick={e => { e.stopPropagation(); const name = prompt('Rename folder', f.name); if (name) renameFolder(f.id, name) }}>✏️</button>
              <button onClick={e => { e.stopPropagation(); if (confirm('Delete folder?')) deleteFolder(f.id) }}>🗑️</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
