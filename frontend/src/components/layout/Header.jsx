import { Users } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">HRMS Lite</h1>
      </div>
    </header>
  )
}
