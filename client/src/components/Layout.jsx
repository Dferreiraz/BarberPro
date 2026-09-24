import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-[var(--color-background)] text-[var(--color-text)]">
      
      {/* Sidebar (Fluxo natural do Flexbox, sem fixed) */}
      <Sidebar />
      
      {/* Área Principal */}
      <main className="flex-1 flex flex-col min-h-screen">
        
        <Header />
        
        {/* Conteúdo das páginas */}
        <div className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </div>

        <Footer />
        
      </main>
    </div>
  )
}