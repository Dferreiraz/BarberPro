import { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text)]">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col w-full">
        {/* Botão Hambúrguer Mobile */}
        <div className="md:hidden p-4 border-b border-[#2A2A2A] bg-[var(--color-surface)] flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[var(--color-primary)] text-3xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        <Header />
        
        {/* Área de conteúdo principal responsiva */}
        <div className="flex-1 p-4 md:p-8 md:ml-0">
          {children}
        </div>
      </main>
    </div>
  )
}