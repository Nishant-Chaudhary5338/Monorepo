import { Link } from '@repo/router'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">About</h1>
      <p className="text-muted-foreground">Another public page.</p>
      <Link to="/" className="underline text-blue-500">← Back to Home</Link>
    </div>
  )
}
