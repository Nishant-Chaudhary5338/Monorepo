import { useState, useRef, useEffect } from 'react'

const OPTIONS = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lemon',
  'Mango',
  'Nectarine',
  'Orange',
  'Papaya',
  'Quince',
  'Raspberry',
  'Strawberry',
  'Tangerine',
  'Ugli fruit',
  'Watermelon',
]

export default function AutoSelect() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const filtered = query
    ? OPTIONS.filter((o) => o.toLowerCase().includes(query.toLowerCase()))
    : OPTIONS

  const autoHighlighted = filtered[0] ?? null

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value)
    setSelected(null)
    setOpen(true)
  }

  function handleSelect(value: string) {
    setSelected(value)
    setQuery(value)
    setOpen(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && autoHighlighted) {
      handleSelect(autoHighlighted)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (
        !inputRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="Search fruits…"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
        />

        {open && filtered.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto text-sm"
          >
            {filtered.map((option) => {
              const isAuto = option === autoHighlighted
              return (
                <li
                  key={option}
                  onPointerDown={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer ${
                    isAuto
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'hover:bg-gray-50 text-gray-800'
                  }`}
                >
                  {option}
                  {isAuto && (
                    <span className="ml-2 text-xs text-blue-400">(auto)</span>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {selected && (
        <p className="text-sm text-gray-600">
          Selected: <span className="font-semibold text-gray-900">{selected}</span>
        </p>
      )}
    </div>
  )
}
