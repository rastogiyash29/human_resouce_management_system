import { Users, Menu } from 'lucide-react'

export default function Header({ onMenuToggle }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Users className="h-7 w-7 md:h-8 md:w-8 text-blue-600" />
        <h1 className="text-lg md:text-xl font-bold text-gray-900">HRMS Lite</h1>
      </div>
    </header>
  )
}
