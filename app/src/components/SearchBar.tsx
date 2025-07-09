import { useState } from 'react'

export default function SearchBar({ onSearch }: { onSearch(term: string): void }) {
  const [term, setTerm] = useState('')

  return (
    <div className="my-2 flex">
      <input
        className="flex-1 p-2 bg-quaternary text-tertiary placeholder-tertiary/60"
        placeholder="Search..."
        value={term}
        onChange={e => setTerm(e.target.value)}
      />
      <button
        className="ml-2 px-4 bg-accent text-background"
        onClick={() => onSearch(term)}
      >
        Search
      </button>
    </div>
  )
}
