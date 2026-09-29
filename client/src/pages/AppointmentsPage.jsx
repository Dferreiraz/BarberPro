import { useState, useEffect } from 'react'
import appointmentService from '../services/appointmentService'
import api from '../services/api'
import useAuthStore from '../store/useAuthStore'
import Skeleton from '../components/Skeleton'

export default function AppointmentsPage() {
    const { user } = useAuthStore()
    const isBarberOrAdmin = user?.role === 'barber' || user?.role === 'admin'

    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingAppointment, setEditingAppointment] = useState(null)
    const [whatsappUrl, setWhatsappUrl] = useState(null)

    const [formData, setFormData] = useState({
        barberId: '', serviceId: '', date: '', time: '', totalPrice: '', notes: ''
    })
    const [services, setServices] = useState([])
    const [barbers, setBarbers] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const [appointmentsData, servicesData, barbersData] = await Promise.all([
                    appointmentService.getAll(), api.get('/services'), api.get('/barbers')
                ])
                let filtered = appointmentsData.filter(apt => apt.status !== 'cancelled')
                if (user?.role === 'client') filtered = filtered.filter(apt => apt.client_id === user.id)
                
                setAppointments(filtered)
                setServices(servicesData.data)
                setBarbers(barbersData.data)
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [user])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const payload = { ...formData, barberId: parseInt(formData.barberId), serviceId: parseInt(formData.serviceId), totalPrice: parseFloat(formData.totalPrice) }
            if (editingAppointment) {
                await appointmentService.update(editingAppointment.id, { date: formData.date, time: formData.time, notes: formData.notes })
            } else {
                const result = await appointmentService.create(payload)
                if (result.data.whatsappUrl) setWhatsappUrl(result.data.whatsappUrl)
            }
            const updatedList = await appointmentService.getAll()
            let finalList = user?.role === 'client' ? updatedList.filter(apt => apt.client_id === user.id) : updatedList
            finalList.sort((a, b) => new Date(a.date) - new Date(b.date))
            setAppointments(finalList)
            setFormData({ barberId: '', serviceId: '', date: '', time: '', totalPrice: '', notes: '' })
            setEditingAppointment(null)
            setShowForm(false)
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao salvar agendamento')
        }
    }

    const handleEdit = (appointment) => {
        try {
            setEditingAppointment(appointment)
            let dateStr = typeof appointment.date === 'string' ? appointment.date.split('T')[0] : new Date(appointment.date).toISOString().split('T')[0]
            let timeStr = typeof appointment.time === 'string' ? appointment.time.substring(0, 5) : new Date(appointment.time).toTimeString().substring(0, 5)
            setFormData({ barberId: String(appointment.barber_id), serviceId: String(appointment.service_id), date: dateStr, time: timeStr, totalPrice: String(appointment.total_price), notes: appointment.notes || '' })
            setShowForm(true)
            setWhatsappUrl(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            console.error("Erro ao preparar edição:", error)
        }
    }

    const handleCancel = async (id) => {
        if (!window.confirm('Tem certeza que deseja cancelar este agendamento?')) return
        try {
            await appointmentService.cancel(id)
            const updatedList = await appointmentService.getAll()
            let finalList = user?.role === 'client' ? updatedList.filter(apt => apt.client_id === user.id) : updatedList
            finalList.sort((a, b) => new Date(a.date) - new Date(b.date))
            setAppointments(finalList)
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao cancelar agendamento')
        }
    }

    const handleConfirmPayment = async (id) => {
        const paymentMethod = prompt('Forma de pagamento (pix, cash, credit, debit):')
        if (!paymentMethod) return
        try {
            await appointmentService.updateStatus(id, 'confirmed', paymentMethod)
            const updatedList = await appointmentService.getAll()
            let finalList = user?.role === 'client' ? updatedList.filter(apt => apt.client_id === user.id) : updatedList
            finalList.sort((a, b) => new Date(a.date) - new Date(b.date))
            setAppointments(finalList)
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao atualizar status')
        }
    }

    const handleCancelForm = () => {
        setFormData({ barberId: '', serviceId: '', date: '', time: '', totalPrice: '', notes: '' })
        setEditingAppointment(null)
        setShowForm(false)
        setWhatsappUrl(null)
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending_payment': return 'bg-yellow-600'
            case 'confirmed': return 'bg-green-600'
            case 'completed': return 'bg-blue-600'
            case 'cancelled': return 'bg-red-600'
            default: return 'bg-gray-600'
        }
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending_payment': return 'Aguardando Pagamento'
            case 'confirmed': return 'Confirmado'
            case 'completed': return 'Concluído'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 p-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-surface)] p-5 rounded-lg border border-[#2A2A2A]">
                        <Skeleton className="h-6 w-32 mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            {/* Cabeçalho Responsivo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">Agendamentos</h2>
                <button
                    onClick={() => { handleCancelForm(); setShowForm(!showForm) }}
                    className="w-full sm:w-auto px-4 py-2 bg-[var(--color-primary)] text-black font-bold rounded hover:opacity-90 transition"
                >
                    {showForm ? 'Cancelar' : '+ Novo Agendamento'}
                </button>
            </div>

            {whatsappUrl && (
                <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg mb-6">
                    <p className="text-green-400 font-semibold mb-2">Agendamento criado com sucesso!</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block w-full sm:w-auto text-center px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-bold">
                        Finalizar no WhatsApp
                    </a>
                </div>
            )}

            {showForm && (
                <div className="bg-[var(--color-surface)] p-4 sm:p-6 rounded-lg border border-[#2A2A2A] mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
                        {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                        {!editingAppointment && (
                            <>
                                <div>
                                    <label className="block text-sm mb-1 text-[var(--color-text)]">Barbeiro</label>
                                    <select value={formData.barberId} onChange={(e) => setFormData({ ...formData, barberId: e.target.value })} required className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]">
                                        <option value="">Selecione um barbeiro</option>
                                        {barbers.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-[var(--color-text)]">Serviço</label>
                                    <select value={formData.serviceId} onChange={(e) => { const selected = services.find(s => s.id === parseInt(e.target.value)); setFormData({ ...formData, serviceId: e.target.value, totalPrice: selected ? selected.price : '' }) }} required className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]">
                                        <option value="">Selecione um serviço</option>
                                        {services.map(s => (<option key={s.id} value={s.id}>{s.name} - R$ {parseFloat(s.price).toFixed(2)}</option>))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1 text-[var(--color-text)]">Data</label>
                                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                            </div>
                            <div>
                                <label className="block text-sm mb-1 text-[var(--color-text)]">Horário</label>
                                <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                            </div>
                        </div>
                        {!editingAppointment && (
                            <div>
                                <label className="block text-sm mb-1 text-[var(--color-text)]">Valor (R$)</label>
                                <input type="number" step="0.01" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} required className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm mb-1 text-[var(--color-text)]">Observações</label>
                            <input type="text" placeholder="Opcional" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-3 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <button type="submit" className="w-full px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold mt-2">
                            {editingAppointment ? 'Atualizar' : 'Criar Agendamento'}
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-[var(--color-surface)] p-4 sm:p-5 rounded-lg border border-[#2A2A2A]">
                        <div className="flex flex-col gap-4">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <h3 className="text-base sm:text-lg font-bold text-[var(--color-text)]">{apt.service_name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs text-white font-bold ${getStatusColor(apt.status)}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Cliente: <span className="text-[var(--color-text)]">{apt.client_name}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Barbeiro: <span className="text-[var(--color-text)]">{apt.barber_name}</span>
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                    {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time} | 
                                    <span className="text-[var(--color-primary)] font-bold"> R$ {parseFloat(apt.total_price).toFixed(2)}</span>
                                </p>
                                {apt.notes && <p className="text-gray-500 text-xs mt-1 italic">"{apt.notes}"</p>}
                            </div>

                            <div className="flex flex-wrap gap-2 border-t border-[#2A2A2A] pt-4 sm:border-0 sm:pt-0">
                                {user?.role === 'client' && apt.status === 'pending_payment' && (
                                    <>
                                        <button onClick={() => handleEdit(apt)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-semibold min-h-[44px]">Editar</button>
                                        <button onClick={() => handleCancel(apt.id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition font-semibold min-h-[44px]">Cancelar</button>
                                    </>
                                )}
                                {isBarberOrAdmin && (apt.status === 'pending_payment' || apt.status === 'confirmed') && (
                                    <>
                                        <button onClick={() => handleEdit(apt)} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-semibold min-h-[44px]">Editar</button>
                                        {apt.status === 'pending_payment' && (
                                            <button onClick={() => handleConfirmPayment(apt.id)} className="flex-1 sm:flex-none px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition font-semibold min-h-[44px]">Confirmar</button>
                                        )}
                                        <button onClick={() => handleCancel(apt.id)} className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition font-semibold min-h-[44px]">Cancelar</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {appointments.length === 0 && (
                    <div className="text-center text-gray-500 py-10 bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] border-dashed">
                        Nenhum agendamento encontrado.
                    </div>
                )}
            </div>
        </div>
    )
}