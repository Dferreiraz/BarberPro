import Sidebar from './Sidebar'
import Header from './Header'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Sidebar />
      <Header />
      
      {/* Área de conteúdo principal */}
      <main className="ml-64 pt-24 px-8 pb-8">
        {children}
      </main>
    </div>
  )
}