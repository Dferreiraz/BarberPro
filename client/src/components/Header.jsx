import { useLocation } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Header() {
  const { user } = useAuthStore()
  const location = useLocation()

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Visão Geral'
      case '/services': return 'Gestão de Serviços'
      case '/appointments': return 'Agendamentos'
      case '/clients': return 'Clientes'
      default: return 'BarberPro'
    }
  }

  return (
    <header className="h-16 bg-[var(--color-surface)] border-b border-[#2A2A2A] flex items-center justify-between px-8">
      <h2 className="text-lg font-semibold text-[var(--color-text)]">
        {getTitle()}
      </h2>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400">
          Olá, <span className="text-[var(--color-primary)] font-bold">{user?.name || 'Usuário'}</span>
        </span>
      </div>
    </header>
  )
}