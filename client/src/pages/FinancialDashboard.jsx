import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import financialService from '../services/financialService'
import Skeleton from '../components/Skeleton'
export default function FinancialDashboard() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            try {
                const result = await financialService.getDashboardData()
                setData(result)
            } catch (error) {
                console.error('Erro ao carregar dados financeiros:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] space-y-4">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] h-80">
                        <Skeleton className="h-6 w-64 mb-4" />
                        <Skeleton className="h-full w-full" />
                    </div>
                    <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] h-80">
                        <Skeleton className="h-6 w-64 mb-4" />
                        <Skeleton className="h-full w-full rounded-full mx-auto max-w-[300px]" />
                    </div>
                </div>
            </div>
        )
    }

    if (!data) return <div className="text-center mt-10 text-red-500">Erro ao carregar dados.</div>

    const COLORS = ['#D4AF37', '#10B981', '#3B82F6', '#EF4444']
    const chartData = data.dailyTrend.map(item => ({
        day: new Date(item.day).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
        receita: parseFloat(item.total_revenue),
        comissao: parseFloat(item.total_commission)
    }))

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">Dashboard Financeiro</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                    <h3 className="text-gray-400 text-sm mb-2">Faturamento Total (Mês)</h3>
                    <p className="text-3xl font-bold text-[var(--color-primary)]">R$ {data.summary.totalRevenueMonth.toFixed(2)}</p>
                </div>
                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                    <h3 className="text-gray-400 text-sm mb-2">Comissões a Pagar (Mês)</h3>
                    <p className="text-3xl font-bold text-green-500">R$ {data.summary.totalCommissionMonth.toFixed(2)}</p>
                </div>
                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                    <h3 className="text-gray-400 text-sm mb-2">Agendamentos Concluídos/Confirmados</h3>
                    <p className="text-3xl font-bold text-[var(--color-text)]">{data.summary.totalAppointmentsMonth}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Faturamento vs Comissões (Últimos 30 dias)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" />
                                <XAxis dataKey="day" stroke="#888888" />
                                <YAxis stroke="#888888" />
                                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px' }} itemStyle={{ color: '#F5F5F5' }} />
                                <Bar dataKey="receita" fill="#D4AF37" name="Receita" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="comissao" fill="#10B981" name="Comissão" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                    <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Receita por Forma de Pagamento</h3>
                    <div className="h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={data.paymentMethods} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="total_amount" nameKey="payment_method">
                                    {data.paymentMethods.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '8px' }} formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                        {data.paymentMethods.map((method, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-400">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                <span className="capitalize">{method.payment_method}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-4">Comissões por Barbeiro (Mês Atual)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[var(--color-background)] text-[var(--color-text)] uppercase">
                            <tr>
                                <th className="px-4 py-3 rounded-l-lg">Barbeiro</th>
                                <th className="px-4 py-3">Taxa</th>
                                <th className="px-4 py-3">Agendamentos</th>
                                <th className="px-4 py-3">Faturamento Gerado</th>
                                <th className="px-4 py-3 rounded-r-lg">Comissão a Receber</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.barberCommissions.map((barber, index) => (
                                <tr key={index} className="border-b border-[#2A2A2A] hover:bg-[var(--color-background)] transition">
                                    <td className="px-4 py-3 font-medium text-[var(--color-text)]">{barber.barber_name}</td>
                                    <td className="px-4 py-3">{barber.commission_rate}%</td>
                                    <td className="px-4 py-3">{barber.total_appointments}</td>
                                    <td className="px-4 py-3">R$ {parseFloat(barber.total_revenue_generated).toFixed(2)}</td>
                                    <td className="px-4 py-3 font-bold text-green-500">R$ {parseFloat(barber.total_commission_earned).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}