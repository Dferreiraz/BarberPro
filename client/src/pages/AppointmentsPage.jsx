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
        barberId: '',
        serviceId: '',
        date: '',
        time: '',
        totalPrice: '',
        notes: ''
    })

    const [services, setServices] = useState([])
    const [barbers, setBarbers] = useState([])

    useEffect(() => {
        const loadData = async () => {
            try {
                const [appointmentsData, servicesData, barbersData] = await Promise.all([
                    appointmentService.getAll(),
                    api.get('/services'),
                    api.get('/barbers')
                ])
                
                let filtered = appointmentsData.filter(apt => apt.status !== 'cancelled')

                if (user?.role === 'client') {
                    filtered = filtered.filter(apt => apt.client_id === user.id)
                }

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
            const payload = {
                ...formData,
                barberId: parseInt(formData.barberId),
                serviceId: parseInt(formData.serviceId),
                totalPrice: parseFloat(formData.totalPrice)
            }

            if (editingAppointment) {
                await appointmentService.update(editingAppointment.id, {
                    date: formData.date,
                    time: formData.time,
                    notes: formData.notes
                })
            } else {
                const result = await appointmentService.create(payload)
                if (result.data.whatsappUrl) {
                    setWhatsappUrl(result.data.whatsappUrl)
                }
            }

            const updatedList = await appointmentService.getAll()
            let finalList = updatedList
            if (user?.role === 'client') {
                finalList = updatedList.filter(apt => apt.client_id === user.id)
            }
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

            setFormData({
                barberId: String(appointment.barber_id),
                serviceId: String(appointment.service_id),
                date: dateStr,
                time: timeStr,
                totalPrice: String(appointment.total_price),
                notes: appointment.notes || ''
            })
            setShowForm(true)
            setWhatsappUrl(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } catch (error) {
            console.error("Erro ao preparar edição:", error)
            alert("Erro ao carregar dados para edição.")
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

    // ✅ SKELETON SCREEN PARA AGENDAMENTOS
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-40" />
                </div>
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-[var(--color-surface)] p-5 rounded-lg border border-[#2A2A2A] flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-5 w-24 rounded-full" />
                            </div>
                            <Skeleton className="h-4 w-64" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-8 w-20" />
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">Agendamentos</h2>
                <button
                    onClick={() => { handleCancelForm(); setShowForm(!showForm) }}
                    className="px-4 py-2 bg-[var(--color-primary)] text-black font-bold rounded hover:opacity-90 transition"
                >
                    {showForm ? 'Cancelar' : '+ Novo Agendamento'}
                </button>
            </div>

            {whatsappUrl && (
                <div className="bg-green-900/30 border border-green-500 p-4 rounded-lg mb-6">
                    <p className="text-green-400 font-semibold mb-2">Agendamento criado com sucesso!</p>
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-bold">
                        Finalizar no WhatsApp
                    </a>
                </div>
            )}

            {showForm && (
                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
                        {editingAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}
                    </h3>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {!editingAppointment && (
                            <>
                                <div>
                                    <label className="block text-sm mb-1 text-[var(--color-text)]">Barbeiro</label>
                                    <select value={formData.barberId} onChange={(e) => setFormData({ ...formData, barberId: e.target.value })} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]">
                                        <option value="">Selecione um barbeiro</option>
                                        {barbers.map(b => (<option key={b.id} value={b.id}>{b.name}</option>))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1 text-[var(--color-text)]">Serviço</label>
                                    <select value={formData.serviceId} onChange={(e) => { const selected = services.find(s => s.id === parseInt(e.target.value)); setFormData({ ...formData, serviceId: e.target.value, totalPrice: selected ? selected.price : '' }) }} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]">
                                        <option value="">Selecione um serviço</option>
                                        {services.map(s => (<option key={s.id} value={s.id}>{s.name} - R$ {parseFloat(s.price).toFixed(2)}</option>))}
                                    </select>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm mb-1 text-[var(--color-text)]">Data</label>
                            <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div>
                            <label className="block text-sm mb-1 text-[var(--color-text)]">Horário</label>
                            <input type="time" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        {!editingAppointment && (
                            <div>
                                <label className="block text-sm mb-1 text-[var(--color-text)]">Valor (R$)</label>
                                <input type="number" step="0.01" value={formData.totalPrice} onChange={(e) => setFormData({ ...formData, totalPrice: e.target.value })} required className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm mb-1 text-[var(--color-text)]">Observações</label>
                            <input type="text" placeholder="Opcional" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="w-full p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]" />
                        </div>
                        <div className="md:col-span-2">
                            <button type="submit" className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold">
                                {editingAppointment ? 'Atualizar' : 'Criar Agendamento'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {appointments.map((apt) => (
                    <div key={apt.id} className="bg-[var(--color-surface)] p-5 rounded-lg border border-[#2A2A2A]">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-bold text-[var(--color-text)]">{apt.service_name}</h3>
                                    <span className={`px-2 py-1 rounded text-xs text-white font-bold ${getStatusColor(apt.status)}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-sm">
                                    Cliente: <span className="text-[var(--color-text)]">{apt.client_name}</span> | Barbeiro: <span className="text-[var(--color-text)]">{apt.barber_name}</span>
                                </p>
                                <p className="text-gray-400 text-sm">
                                    {new Date(apt.date).toLocaleDateString('pt-BR')} às {apt.time} | <span className="text-[var(--color-primary)] font-bold"> R$ {parseFloat(apt.total_price).toFixed(2)}</span>
                                    {apt.payment_method && <span className="ml-2 text-green-400">({apt.payment_method.toUpperCase()})</span>}
                                </p>
                                {apt.notes && <p className="text-gray-500 text-xs mt-1 italic">"{apt.notes}"</p>}
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {user?.role === 'client' && apt.status === 'pending_payment' && (
                                    <>
                                        <button onClick={() => handleEdit(apt)} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-semibold">Editar</button>
                                        <button onClick={() => handleCancel(apt.id)} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition font-semibold">Cancelar</button>
                                    </>
                                )}
                                {isBarberOrAdmin && (apt.status === 'pending_payment' || apt.status === 'confirmed') && (
                                    <>
                                        <button onClick={() => handleEdit(apt)} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition font-semibold">Editar</button>
                                        {apt.status === 'pending_payment' && (
                                            <button onClick={() => handleConfirmPayment(apt.id)} className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition font-semibold">Confirmar</button>
                                        )}
                                        <button onClick={() => handleCancel(apt.id)} className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition font-semibold">Cancelar</button>
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