import { useLocation } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Header({ toggleSidebar }) {
  const { user } = useAuthStore()
  const location = useLocation()

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Visão Geral'
      case '/services': return 'Gestão de Serviços'
      case '/appointments': return 'Agendamentos'
      case '/clients': return 'Clientes'
      case '/financial': return 'Financeiro'
      case '/profile': return 'Meu Perfil'
      default: return 'BarberPro'
    }
  }

  return (
    <header className="h-16 md:h-20 bg-[var(--color-surface)] border-b border-[#2A2A2A] flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Botão Hambúrguer */}
        {toggleSidebar && (
          <button 
            onClick={toggleSidebar}
            className="md:hidden p-2 text-[var(--color-text)] hover:bg-[#2A2A2A] rounded-lg transition cursor-pointer"
            aria-label="Abrir menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          {getTitle()}
        </h2>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <span className="text-sm text-gray-400 hidden sm:block">
          Olá, <span className="text-[var(--color-primary)] font-bold">{user?.name || 'Usuário'}</span>
        </span>
        
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-black font-bold text-sm md:text-base shadow-lg">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  )
}