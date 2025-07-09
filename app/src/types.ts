export interface ChatFolder {
  id: string
  name: string
  color: string | null
  is_visible: boolean
}

export interface ChatEntry {
  id: string
  title: string
  create_time: number
  update_time: number
  folder_id: string | null
  mapping: string[]
  current_node?: string
  is_visible: boolean
}

export interface AppState {
  folders: ChatFolder[]
  chats: ChatEntry[]
  apiKey?: string
}
