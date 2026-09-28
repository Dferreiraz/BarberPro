import { useState, useEffect } from 'react'
import useAuthStore from '../store/useAuthStore'
import appointmentService from '../services/appointmentService'
import MonthlyCalendar from '../components/MonthlyCalendar' 

export default function Dashboard() {
  const { user } = useAuthStore()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await appointmentService.getAll()
        
        let userAppointments = []

        if (user?.role === 'client') {
          // Cliente vê APENAS os seus agendamentos, e NÃO vê os cancelados
          userAppointments = data.filter(apt => 
            apt.client_id === user.id && apt.status !== 'cancelled'
          )
        } else {
          // Barbeiro vê todos, mas removemos os cancelados para manter o dashboard limpo
          userAppointments = data.filter(apt => apt.status !== 'cancelled')
        }

        // Ordenar por data (mais próximos primeiro)
        userAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))
        setAppointments(userAppointments)
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [user])

  if (loading) return <div className="text-center mt-10 text-[var(--color-text)]">Carregando dashboard...</div>

  const isClient = user?.role === 'client'

  // Cálculos para as estatísticas do Barbeiro (ignorando cancelados)
  const todayStr = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.date.startsWith(todayStr))
  const totalActiveAppointments = appointments.length

  return (
    <div className="space-y-6">
      {/* Cabeçalho de Boas-vindas */}
      <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
        <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-2">
          Bem-vindo, {user?.name}!
        </h2>
        <p className="text-gray-400">
          {isClient 
            ? 'Aqui está o resumo dos seus próximos agendamentos.' 
            : 'Visão geral da sua barbearia.'}
        </p>
      </div>

      {/* ========================================== */}
      {/* VISÃO DO CLIENTE: Agenda Visual            */}
      {/* ========================================== */}
      {isClient && (
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
          <h3 className="text-xl font-bold text-[var(--color-text)] mb-4 flex items-center gap-2">
            📅 Seus Próximos Agendamentos
          </h3>

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 border border-dashed border-[#2A2A2A] rounded-lg">
              <p>Você não possui agendamentos ativos no momento.</p>
              <p className="text-sm mt-2">Vá até a aba "Agendamentos" para marcar um novo horário.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--color-background)] rounded-lg border border-[#2A2A2A] hover:border-[var(--color-primary)] transition"
                >
                  <div className="flex items-center gap-4 mb-3 md:mb-0">
                    {/* Bloco de Data Estilo Calendário */}
                    <div className="bg-[var(--color-primary)] text-black font-bold rounded-lg p-3 text-center min-w-[70px]">
                      <div className="text-xs uppercase">
                        {new Date(apt.date).toLocaleDateString('pt-BR', { month: 'short' })}
                      </div>
                      <div className="text-2xl">
                        {new Date(apt.date).getDate()}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-[var(--color-text)] text-lg">{apt.service_name}</h4>
                      <p className="text-sm text-gray-400">
                        Com {apt.barber_name} às {apt.time}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      apt.status === 'pending_payment' ? 'bg-yellow-600' :
                      apt.status === 'confirmed' ? 'bg-green-600' :
                      apt.status === 'completed' ? 'bg-blue-600' : 'bg-red-600'
                    }`}>
                      {apt.status === 'pending_payment' ? 'Aguardando Pagamento' :
                       apt.status === 'confirmed' ? 'Confirmado' :
                       apt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                    </span>
                    <span className="font-bold text-[var(--color-primary)]">
                      R$ {parseFloat(apt.total_price).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================== */}
      {/* VISÃO DO BARBEIRO: Estatísticas + Calendário */}
      {/* ========================================== */}
      {!isClient && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
              <h3 className="text-gray-400 text-sm mb-2">Faturamento do Mês</h3>
              {/* Placeholder: Será alimentado pela API financeira na Fase 3 */}
              <p className="text-3xl font-bold text-[var(--color-text)]">R$ 0,00</p>
            </div>
            
            <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
              <h3 className="text-gray-400 text-sm mb-2">Agendamentos Hoje</h3>
              <p className="text-3xl font-bold text-[var(--color-text)]">
                {todayAppointments.length}
              </p>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
              <h3 className="text-gray-400 text-sm mb-2">Total de Agendamentos Ativos</h3>
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                {totalActiveAppointments}
              </p>
            </div>
          </div>

          {/* Calendário Mensal*/}
          <MonthlyCalendar />
        </>
      )}
    </div>
  )
}