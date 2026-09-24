import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { token, user } = await authService.login({ email, password })
      setAuth(user, token)
      navigate('/dashboard')
    } catch (err) {
      // Pega a mensagem de erro do nosso errorMiddleware do backend
      setError(err.response?.data?.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Login BarberPro
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-black font-bold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}