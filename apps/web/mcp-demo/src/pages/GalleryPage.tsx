import { useEffect, useState } from 'react'
import { ToolsGallery } from '../components/ToolsGallery'
import { getTools } from '../api/client'

export function GalleryPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTools()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="flex flex-col h-full p-4 overflow-hidden">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white">MCP Tools Gallery</h2>
        <p className="text-sm text-zinc-500 mt-0.5">
          All custom tools — each runs as an independent MCP server over stdio
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <ToolsGallery data={data} loading={loading} />
      </div>
    </div>
  )
}
