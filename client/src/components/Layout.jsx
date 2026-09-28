import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text)]">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-h-screen w-full">
        
        {/* Botão Hambúrguer (Visível APENAS no mobile) */}
        <div className="md:hidden p-4 border-b border-[#2A2A2A] bg-[var(--color-surface)] flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="text-[var(--color-primary)] text-3xl focus:outline-none"
          >
            ☰
          </button>
          <span className="ml-4 font-bold text-lg">Menu</span>
        </div>

        <Header />
        
        {/* Conteúdo das páginas (Padding ajustado para mobile: p-4 no celular, p-8 no desktop) */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>

        <Footer />
        
      </main>
    </div>
  )
}