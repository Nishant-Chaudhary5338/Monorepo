import { useState } from 'react'
import { Button } from '@repo/ui'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Web App 1</h1>
          <p className="text-muted-foreground">UI Components Demo with shadcn/ui Design Tokens</p>
        </section>

        {/* Buttons Section */}
        <div className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button variant="default" onClick={() => setCount(count + 1)}>
              Default ({count})
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🚀</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
