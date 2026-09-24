import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function Dashboard() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-[#2A2A2A] pb-4">
          <h1 className="text-3xl font-bold text-[var(--color-primary)]">BarberPro Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-[var(--color-text)]">Olá, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
              Sair
            </button>
          </div>
        </header>

        <main className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">Bem-vindo ao sistema!</h2>
          <p className="text-gray-400">
            Você está logado com sucesso. Esta é uma rota protegida.
            Se você tentar acessar esta página sem token, será redirecionado para o login.
          </p>
        </main>
      </div>
    </div>
  )
}