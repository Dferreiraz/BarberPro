import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authService from '../services/authService'
import useAuthStore from '../store/useAuthStore'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'client'
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (error) setError('')
    if (success) setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const payload = {
        ...formData,
        phone: formData.role === 'barber' ? formData.phone : undefined
      }

      const response = await authService.register(payload)
      
      const token = response.token || response.user?.token
      const userData = response.user || response.user?.user

      if (!token || !userData) {
        throw new Error('Resposta do servidor inválida')
      }

      setAuth(userData, token)
      
      const roleName = userData.role === 'barber' ? 'Barbeiro' : 'Cliente'
      setSuccess(`Conta de ${roleName} criada com sucesso! Redirecionando...`)

      setTimeout(() => {
        navigate('/dashboard')
      }, 1500)

    } catch (err) {
      console.error('Erro no cadastro:', err)
      setError(err.response?.data?.message || 'Erro ao criar conta. Verifique os dados e tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Criar Conta BarberPro
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <label className={`cursor-pointer border rounded-lg p-3 text-center transition ${formData.role === 'client' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[#2A2A2A]'}`}>
              <input 
                type="radio" name="role" value="client" checked={formData.role === 'client'} onChange={handleChange} className="hidden" 
              />
              <span className={`font-bold ${formData.role === 'client' ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                Sou Cliente
              </span>
            </label>
            <label className={`cursor-pointer border rounded-lg p-3 text-center transition ${formData.role === 'barber' ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10' : 'border-[#2A2A2A]'}`}>
              <input 
                type="radio" name="role" value="barber" checked={formData.role === 'barber'} onChange={handleChange} className="hidden" 
              />
              <span className={`font-bold ${formData.role === 'barber' ? 'text-[var(--color-primary)]' : 'text-gray-400'}`}>
                Sou Barbeiro
              </span>
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">Nome Completo</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
          </div>

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">E-mail</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
          </div>

          {formData.role === 'barber' && (
            <div>
              <label className="block text-sm mb-1 text-[var(--color-text)]">WhatsApp (Obrigatório para Barbeiro)</label>
              <input name="phone" type="text" placeholder="5511999998888" value={formData.phone} onChange={handleChange} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
            </div>
          )}

          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">Senha</label>
            <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
          </div>

          <button type="submit" disabled={loading || success !== ''} className="w-full bg-[var(--color-primary)] text-black font-bold py-2 rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Criando conta...' : 'Cadastrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold">
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  )
}