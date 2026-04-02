import { useAuth, useRouter, Link } from '@repo/router'

export default function Dashboard() {
  const { user } = useAuth()
  const { navigate } = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Protected page — only visible when logged in.
      </p>
      <p className="text-sm bg-muted px-4 py-2 rounded">
        Logged in as: <strong>{user?.name ?? 'Unknown'}</strong>
      </p>
      <div className="flex gap-4">
        <Link to="/" className="underline text-blue-500">← Home</Link>
        <button
          className="underline text-red-500"
          onClick={() => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            navigate('/')
          }}
        >
          Log out
        </button>
      </div>
    </div>
  )
}
