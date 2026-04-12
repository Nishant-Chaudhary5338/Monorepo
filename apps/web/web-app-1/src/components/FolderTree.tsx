import { useState } from 'react'

type TreeNode = {
  name: string
  type: 'folder' | 'file'
  children?: TreeNode[]
}

const data: TreeNode[] = [
  {
    name: 'folder',
    type: 'folder',
    children: [
      {
        name: 'inner-folder',
        type: 'folder',
        children: [
          { name: 'file1', type: 'file' },
          { name: 'file2', type: 'file' },
        ],
      },
    ],
  },
  {
    name: 'folder2',
    type: 'folder',
    children: [
      { name: 'file1', type: 'file' },
      { name: 'file2', type: 'file' },
    ],
  },
  { name: 'outer-file', type: 'file' },
]

function TreeNode({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = useState(true)
  const isFolder = node.type === 'folder'

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div
        className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer select-none hover:bg-gray-100 w-fit ${isFolder ? 'font-medium' : 'text-gray-600'}`}
        onClick={() => isFolder && setOpen(o => !o)}
      >
        {isFolder ? (
          <span className="text-yellow-500 text-sm">{open ? '📂' : '📁'}</span>
        ) : (
          <span className="text-blue-400 text-sm">📄</span>
        )}
        <span className="text-sm">{node.name}</span>
        {isFolder && (
          <span className="text-xs text-gray-400 ml-1">{open ? '▾' : '▸'}</span>
        )}
      </div>

      {isFolder && open && node.children?.map((child, i) => (
        <TreeNode key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  )
}

export default function FolderTree() {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm w-72 font-mono">
      <p className="text-xs text-gray-400 mb-3 uppercase tracking-wide">File Explorer</p>
      {data.map((node, i) => (
        <TreeNode key={i} node={node} />
      ))}
    </div>
  )
}
