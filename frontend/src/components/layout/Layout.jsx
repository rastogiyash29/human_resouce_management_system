import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
      <div className="flex">
        <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 p-4 md:p-6 w-full md:w-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
