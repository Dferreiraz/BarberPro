import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' 
import authService from '../services/authService'
import useAuthStore from '../store/useAuthStore'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [apiError, setApiError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    setApiError('')
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Formato de e-mail inválido' }))
    } else {
      setErrors(prev => ({ ...prev, email: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)
    setApiError('')
    
    if (value && value.length < 6) {
      setErrors(prev => ({ ...prev, password: 'A senha deve ter no mínimo 6 caracteres' }))
    } else {
      setErrors(prev => ({ ...prev, password: '' }))
    }
  }

  const isFormValid = 
    email !== '' && 
    password.length >= 6 && 
    !errors.email && 
    !errors.password

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isFormValid) return
    
    setApiError('')
    setLoading(true)

    try {
      const { token, user } = await authService.login({ email, password })
      setAuth(user, token)
      navigate('/dashboard')
    } catch (err) {
      setApiError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Login BarberPro
        </h2>
        
        {apiError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={handleEmailChange}
              className={`w-full p-2 rounded bg-[var(--color-background)] border text-[var(--color-text)] focus:outline-none focus:ring-1 transition ${
                errors.email ? 'border-red-500 focus:ring-red-500' : 'border-[#2A2A2A] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
              }`}
            />
            {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={handlePasswordChange}
              className={`w-full p-2 rounded bg-[var(--color-background)] border text-[var(--color-text)] focus:outline-none focus:ring-1 transition ${
                errors.password ? 'border-red-500 focus:ring-red-500' : 'border-[#2A2A2A] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
              }`}
            />
            {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
          </div>

          <button 
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-[var(--color-primary)] text-black font-bold py-2 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-sm text-gray-400 hover:text-[var(--color-primary)] transition">
            Esqueci minha senha
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-400">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-[var(--color-primary)] hover:underline font-bold">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  )
}