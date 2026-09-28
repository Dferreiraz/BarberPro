import { useState } from 'react'
import { Link } from 'react-router-dom'
import authService from '../services/authService'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setError('')
    setLoading(true)

    try {
      const response = await authService.forgotPassword(email)
      setMessage(response.message)
      if (response.resetToken) {
        setResetToken(response.resetToken) // Apenas para fins de teste no MVP
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao processar solicitação.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] p-4">
      <div className="bg-[var(--color-surface)] p-8 rounded-lg shadow-lg w-full max-w-md border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6 text-center">
          Recuperar Senha
        </h2>

        {message && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 text-green-400 rounded text-sm">
            {message}
            {resetToken && (
              <div className="mt-2 font-bold text-lg text-center bg-green-900/30 p-2 rounded">
                SEU CÓDIGO: {resetToken}
              </div>
            )}
            <div className="mt-3 text-center">
              <Link to="/reset-password" className="text-[var(--color-primary)] underline font-bold">
                Clicar aqui para redefinir a senha
              </Link>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 text-red-400 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 text-[var(--color-text)]">E-mail cadastrado</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-black font-bold py-2 rounded hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Código'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Lembrou a senha?{' '}
          <Link to="/login" className="text-[var(--color-primary)] hover:underline font-bold">
            Voltar ao Login
          </Link>
        </div>
      </div>
    </div>
  )
}