import { useState, useEffect } from 'react'
import { 
    startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
    addDays, format, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns'
import { ptBR } from 'date-fns/locale'
import appointmentService from '../services/appointmentService'

export default function MonthlyCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const data = await appointmentService.getAll()
                setAppointments(data.filter(apt => apt.status !== 'cancelled'))
            } catch (error) {
                console.error('Erro ao carregar agendamentos:', error)
            }
        }
        loadAppointments()
    }, [])

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-4">
            <button 
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                className="px-3 py-1 bg-[var(--color-surface)] rounded hover:bg-[#2A2A2A] text-[var(--color-text)] border border-[#2A2A2A]"
            >
                ←
            </button>
            <h2 className="text-xl font-bold text-[var(--color-primary)] capitalize">
                {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </h2>
            <button 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                className="px-3 py-1 bg-[var(--color-surface)] rounded hover:bg-[#2A2A2A] text-[var(--color-text)] border border-[#2A2A2A]"
            >
                →
            </button>
        </div>
    )

    const renderDays = () => {
        const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
        return (
            <div className="grid grid-cols-7 gap-1 mb-2">
                {days.map(day => (
                    <div key={day} className="text-center text-sm font-bold text-[var(--color-primary)] py-2">
                        {day}
                    </div>
                ))}
            </div>
        )
    }

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth)
        const monthEnd = endOfMonth(monthStart)
        const startDate = startOfWeek(monthStart)
        const endDate = endOfWeek(monthEnd)

        const rows = []
        let days = []
        let day = startDate

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const currentDay = day
                const dayAppointments = appointments.filter(apt => 
                    isSameDay(new Date(apt.date), currentDay)
                )

                days.push(
                    <div 
                        key={currentDay.toISOString()}
                        className={`min-h-[100px] p-1 border border-[#2A2A2A] rounded ${
                            !isSameMonth(currentDay, monthStart) 
                                ? 'bg-[#0A0A0A] text-gray-600' 
                                : 'bg-[var(--color-surface)]'
                        }`}
                    >
                        <div className="text-xs font-bold mb-1 text-[var(--color-text)]">
                            {format(currentDay, 'd')}
                        </div>
                        {dayAppointments.map(apt => {
                            let bgClass = 'bg-gray-600'
                            if (apt.status === 'pending_payment') bgClass = 'bg-yellow-600'
                            else if (apt.status === 'confirmed') bgClass = 'bg-green-600'
                            else if (apt.status === 'completed') bgClass = 'bg-blue-600'

                            return (
                                <div 
                                    key={apt.id}
                                    className={`text-[10px] p-1 rounded mb-1 truncate text-white cursor-help ${bgClass}`}
                                    title={`Cliente: ${apt.client_name}\nServiço: ${apt.service_name}\nHorário: ${apt.time}\nStatus: ${apt.status}`}
                                >
                                    {apt.time} {apt.client_name.split(' ')[0]}
                                </div>
                            )
                        })}
                    </div>
                )
                day = addDays(day, 1)
            }
            rows.push(
                <div className="grid grid-cols-7 gap-1" key={day.toISOString()}>
                    {days}
                </div>
            )
            days = []
        }
        return <div className="mt-2">{rows}</div>
    }

    return (
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            
            {/* Legenda para o barbeiro */}
            <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-[#2A2A2A] text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-yellow-600"></div> Pendente
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-600"></div> Confirmado
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-blue-600"></div> Concluído
                </div>
            </div>
        </div>
    )
}