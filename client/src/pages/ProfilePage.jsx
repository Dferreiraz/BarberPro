import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'
import barberService from '../services/barberService'

export default function ProfilePage() {
    const { user, login } = useAuthStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [errors, setErrors] = useState({ name: '', phone: '', commission_rate: '' })

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        commission_rate: ''
    })

    useEffect(() => {
        if (user?.role !== 'barber' && user?.role !== 'admin') {
            navigate('/dashboard')
            return
        }

        const loadProfile = async () => {
            try {
                const data = await barberService.getProfile()
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    commission_rate: data.commission_rate || 50
                })
            } catch (error) {
                console.error('Erro ao carregar perfil:', error)
                setMessage({ type: 'error', text: 'Erro ao carregar dados do perfil.' })
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [user, navigate])

    // Função genérica de validação
    const validateField = (name, value) => {
        let error = ''
        if (name === 'name' && value.length < 3) {
            error = 'O nome deve ter pelo menos 3 caracteres'
        } else if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '')
            if (numbersOnly.length < 10) {
                error = 'Telefone inválido (mínimo 10 dígitos)'
            }
        } else if (name === 'commission_rate') {
            const rate = parseFloat(value)
            if (isNaN(rate) || rate < 0 || rate > 100) {
                error = 'A comissão deve estar entre 0 e 100'
            }
        }
        setErrors(prev => ({ ...prev, [name]: error }))
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        // Formatação automática para telefone (apenas números)
        if (name === 'phone') {
            const numbersOnly = value.replace(/\D/g, '')
            setFormData(prev => ({ ...prev, [name]: numbersOnly }))
            validateField(name, numbersOnly)
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
            validateField(name, value)
        }
        
        // Limpa mensagem de sucesso/erro geral ao editar
        if (message.text) setMessage({ type: '', text: '' })
    }

    const isFormValid = 
        formData.name.length >= 3 &&
        formData.phone.replace(/\D/g, '').length >= 10 &&
        parseFloat(formData.commission_rate) >= 0 &&
        parseFloat(formData.commission_rate) <= 100 &&
        !errors.name && !errors.phone && !errors.commission_rate

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!isFormValid) return
        
        setSaving(true)
        setMessage({ type: '', text: '' })

        try {
            await barberService.updateProfile(formData)
            
            const updatedUser = { ...user, name: formData.name, phone: formData.phone }
            const token = localStorage.getItem('@BarberPro:token')
            login(updatedUser, token)

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        } catch (error) {
            console.error('Erro ao atualizar perfil:', error)
            setMessage({ type: 'error', text: error.response?.data?.message || 'Erro ao atualizar perfil.' })
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="text-center mt-10 text-[var(--color-text)]">Carregando perfil...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Meu Perfil</h2>

            {message.text && (
                <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-900/30 border border-green-500 text-green-400' : 'bg-red-900/30 border border-red-500 text-red-400'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm mb-1 text-[var(--color-text)]">Nome Completo</label>
                        <input 
                            name="name"
                            type="text" 
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 rounded bg-[var(--color-background)] border text-[var(--color-text)] focus:outline-none focus:ring-1 transition ${
                                errors.name ? 'border-red-500 focus:ring-red-500' : 'border-[#2A2A2A] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                            }`}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm mb-1 text-[var(--color-text)]">E-mail</label>
                        <input 
                            type="email" 
                            value={formData.email}
                            disabled
                            className="w-full p-2 rounded bg-[#111111] border border-[#2A2A2A] text-gray-500 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-500 mt-1">O e-mail não pode ser alterado.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm mb-1 text-[var(--color-text)]">
                        Número do WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input 
                        name="phone"
                        type="text" 
                        placeholder="Ex: 5511999998888"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full p-2 rounded bg-[var(--color-background)] border text-[var(--color-text)] focus:outline-none focus:ring-1 transition ${
                            errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-[#2A2A2A] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                        }`}
                    />
                    {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                    <p className="text-xs text-gray-500 mt-1">Necessário para gerar o link de agendamento no WhatsApp.</p>
                </div>

                <hr className="border-[#2A2A2A]" />

                <div>
                    <label className="block text-sm mb-1 text-[var(--color-text)]">Biografia / Descrição</label>
                    <textarea 
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Ex: Especialista em degradê e barba com 5 anos de experiência."
                        className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
                    />
                </div>

                <div>
                    <label className="block text-sm mb-1 text-[var(--color-text)]">Taxa de Comissão (%)</label>
                    <input 
                        name="commission_rate"
                        type="number" 
                        min="0" 
                        max="100" 
                        step="0.01"
                        value={formData.commission_rate}
                        onChange={handleChange}
                        className={`w-full md:w-1/3 p-2 rounded bg-[var(--color-background)] border text-[var(--color-text)] focus:outline-none focus:ring-1 transition ${
                            errors.commission_rate ? 'border-red-500 focus:ring-red-500' : 'border-[#2A2A2A] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]'
                        }`}
                    />
                    {errors.commission_rate && <p className="text-red-400 text-xs mt-1">{errors.commission_rate}</p>}
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={!isFormValid || saving}
                        className="w-full md:w-auto px-6 py-2 bg-[var(--color-primary)] text-black font-bold rounded hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </form>
        </div>
    )
}