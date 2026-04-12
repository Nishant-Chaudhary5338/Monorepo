import { Link } from '@repo/router'
import AutoSelect from '../components/AutoSelect'
import FolderTree from '../components/FolderTree'
import { RechargeForm } from '../components/RechargeForm'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 py-10">
      <h1 className="text-4xl font-bold">Home</h1>
      <p className="text-muted-foreground">This is a public page — anyone can see it.</p>
      <RechargeForm />
      <AutoSelect />
      <FolderTree />
      <div className="flex gap-4">
        <Link to="/about" className="underline text-blue-500">About</Link>
        <Link to="/dashboard" className="underline text-blue-500">Dashboard (protected)</Link>
      </div>
    </div>
  )
}
