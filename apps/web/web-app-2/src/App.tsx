import { useState } from 'react'
import DashCraftTest from './DashCraftTest'
import ResizeTest from './ResizeTest'
import './App.css'

type Page = 'dashboard' | 'resize-test'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div className="relative">
      {/* Navigation */}
      <nav className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 'dashboard'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPage('resize-test')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            currentPage === 'resize-test'
              ? 'bg-blue-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Resize Test
        </button>
      </nav>

      {/* Page Content */}
      {currentPage === 'dashboard' ? <DashCraftTest /> : <ResizeTest />}
    </div>
  )
}

export default App
