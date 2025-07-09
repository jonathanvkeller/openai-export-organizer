import { useState } from 'react'
import SearchBar from './components/SearchBar'
import FolderList from './components/FolderList'
import ChatList from './components/ChatList'
import ImportPanel from './components/ImportPanel'
import ConfigScreen from './components/ConfigScreen'
import { ChatProvider, useChat } from './context/ChatContext'

function Main() {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const { search } = useChat()
  const [results, setResults] = useState<ReturnType<typeof search>>([])

  return (
    <div className="min-h-screen flex flex-col md:flex-row text-tertiary bg-background p-4">
      <div className="md:w-1/4 p-2">
        <h2 className="text-lg mb-2">Folders</h2>
        <FolderList onSelect={setSelectedFolder} selectedId={selectedFolder} />
        <ImportPanel />
        <ConfigScreen />
      </div>
      <div className="md:flex-1 p-2">
        <SearchBar onSearch={(t) => setResults(search(t))} />
        {results.length > 0 ? (
          <div>
            <h2 className="mb-2">Search Results</h2>
            <ul>
              {results.map(r => (<li key={r.id}>{r.title}</li>))}
            </ul>
          </div>
        ) : (
          <ChatList folderId={selectedFolder} />
        )}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ChatProvider>
      <Main />
    </ChatProvider>
  )
}
