import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Definição dinâmica do menu baseada na role
  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['client', 'barber', 'admin'] },
    { path: '/appointments', label: 'Agendamentos', roles: ['client', 'barber', 'admin'] },
    { path: '/services', label: 'Serviços', roles: ['barber', 'admin'] },
    { path: '/clients', label: 'Clientes', roles: ['barber', 'admin'] },
  ]

  // Filtra apenas os itens que a role do usuário atual tem permissão para ver
  const visibleItems = menuItems.filter(item => item.roles.includes(user?.role))

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[#2A2A2A] flex flex-col min-h-screen">
      <div className="p-6 border-b border-[#2A2A2A]">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">BarberPro</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {visibleItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => 
              `block px-4 py-3 rounded-lg transition-colors ${
                isActive 
                  ? 'bg-[var(--color-primary)] text-black font-bold' 
                  : 'text-[var(--color-text)] hover:bg-[#2A2A2A]'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2A2A2A]">
        <button 
          onClick={handleLogout}
          className="w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-semibold"
        >
          Sair do Sistema
        </button>
      </div>
    </aside>
  )
}