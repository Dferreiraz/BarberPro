import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/services', label: 'Serviços' },
  { path: '/appointments', label: 'Agendamentos' },
  { path: '/clients', label: 'Clientes' },
]

export default function Sidebar() {
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-[var(--color-surface)] border-r border-[#2A2A2A] flex flex-col min-h-screen">
      <div className="p-6 border-b border-[#2A2A2A]">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">BarberPro</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
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