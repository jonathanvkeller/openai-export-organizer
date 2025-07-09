import { createContext, useContext, useEffect, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Fuse from 'fuse.js'
import type { AppState, ChatEntry } from '../types'

interface ChatContextProps extends AppState {
  createFolder(name: string): void
  renameFolder(id: string, name: string): void
  deleteFolder(id: string): void
  createChat(folderId: string | null, title: string): void
  renameChat(id: string, title: string): void
  deleteChat(id: string): void
  importData(data: AppState): void
  search(term: string): ChatEntry[]
  setApiKey(key: string): void
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined)

const STORAGE_KEY = 'chat_state'

type Action =
  | { type: 'init'; payload: AppState }
  | { type: 'create-folder'; name: string }
  | { type: 'rename-folder'; id: string; name: string }
  | { type: 'delete-folder'; id: string }
  | { type: 'create-chat'; folderId: string | null; title: string }
  | { type: 'rename-chat'; id: string; title: string }
  | { type: 'delete-chat'; id: string }
  | { type: 'import'; data: AppState }
  | { type: 'set-key'; key: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'create-folder': {
      return {
        ...state,
        folders: [
          ...state.folders,
          { id: uuidv4(), name: action.name, color: null, is_visible: true }
        ]
      }
    }
    case 'rename-folder': {
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.id ? { ...f, name: action.name } : f
        )
      }
    }
    case 'delete-folder': {
      return {
        ...state,
        folders: state.folders.map(f =>
          f.id === action.id ? { ...f, is_visible: false } : f
        )
      }
    }
    case 'create-chat': {
      return {
        ...state,
        chats: [
          ...state.chats,
          {
            id: uuidv4(),
            folder_id: action.folderId,
            title: action.title,
            create_time: Date.now(),
            update_time: Date.now(),
            mapping: [],
            is_visible: true
          }
        ]
      }
    }
    case 'rename-chat': {
      return {
        ...state,
        chats: state.chats.map(c =>
          c.id === action.id ? { ...c, title: action.title, update_time: Date.now() } : c
        )
      }
    }
    case 'delete-chat': {
      return {
        ...state,
        chats: state.chats.map(c =>
          c.id === action.id ? { ...c, is_visible: false } : c
        )
      }
    }
    case 'import': {
      const existingIds = new Set(state.chats.map(c => c.id))
      const filteredChats = action.data.chats.filter(
        c => !existingIds.has(c.id) && c.is_visible !== false
      )
      const existingFolderIds = new Set(state.folders.map(f => f.id))
      const filteredFolders = action.data.folders.filter(
        f => !existingFolderIds.has(f.id) && f.is_visible !== false
      )
      return {
        ...state,
        folders: [...state.folders, ...filteredFolders],
        chats: [...state.chats, ...filteredChats]
      }
    }
    case 'set-key': {
      return { ...state, apiKey: action.key }
    }
    default:
      return state
  }
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { folders: [], chats: [] })

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        dispatch({ type: 'init', payload: JSON.parse(raw) })
      } catch (e) {
        console.error('Failed to parse state', e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const fuse = new Fuse(state.chats.filter(c => c.is_visible !== false), {
    keys: ['title', 'mapping'],
    includeScore: true
  })

  const value: ChatContextProps = {
    ...state,
    createFolder: (name) => dispatch({ type: 'create-folder', name }),
    renameFolder: (id, name) => dispatch({ type: 'rename-folder', id, name }),
    deleteFolder: (id) => dispatch({ type: 'delete-folder', id }),
    createChat: (folderId, title) => dispatch({ type: 'create-chat', folderId, title }),
    renameChat: (id, title) => dispatch({ type: 'rename-chat', id, title }),
    deleteChat: (id) => dispatch({ type: 'delete-chat', id }),
    importData: (data) => dispatch({ type: 'import', data }),
    search: (term) => fuse.search(term).map(r => r.item),
    setApiKey: (key) => dispatch({ type: 'set-key', key })
  }


  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error('useChat must be inside provider')
  return ctx
}
