import { Link } from '@repo/router'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Home</h1>
      <p className="text-muted-foreground">This is a public page — anyone can see it.</p>
      <div className="flex gap-4">
        <Link to="/about" className="underline text-blue-500">About</Link>
        <Link to="/dashboard" className="underline text-blue-500">Dashboard (protected)</Link>
      </div>
    </div>
  )
}
