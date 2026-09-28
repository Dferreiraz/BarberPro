import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['client', 'barber', 'admin'] },
    { path: '/appointments', label: 'Agendamentos', roles: ['client', 'barber', 'admin'] },
    { path: '/services', label: 'Serviços', roles: ['barber', 'admin'] },
    { path: '/financial', label: 'Financeiro', roles: ['barber', 'admin'] },
    { path: '/profile', label: 'Meu Perfil', roles: ['barber', 'admin'] },   
    { path: '/clients', label: 'Clientes', roles: ['barber', 'admin'] },
  ]

  const visibleItems = menuItems.filter(item => item.roles.includes(user?.role))

  return (
    <>
      {/* Overlay Escuro (Só aparece no mobile quando o menu está aberto) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[var(--color-surface)] border-r border-[#2A2A2A] flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:static md:translate-x-0 /* No desktop, fica estático e sempre visível */
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} /* No mobile, desliza para dentro/fora */
      `}>
        <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">BarberPro</h1>
          {/* Botão X para fechar no mobile */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="md:hidden text-gray-400 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} /* Fecha o menu ao clicar em um link no mobile */
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-colors ${isActive
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
    </>
  )
}