import { useState, useEffect } from 'react'
import api from '../services/api'

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadClients = async () => {
            try {
                const response = await api.get('/users/clients')
                setClients(response.data)
            } catch (error) {
                console.error('Erro ao carregar clientes:', error)
            } finally {
                setLoading(false)
            }
        }
        loadClients()
    }, [])

    if (loading) return <div className="text-center mt-10 text-[var(--color-text)]">Carregando clientes...</div>

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">Clientes Cadastrados</h2>
                <span className="text-sm text-gray-400">
                    Total: <span className="text-[var(--color-primary)] font-bold">{clients.length}</span>
                </span>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#111111] text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Nome</th>
                            <th className="p-4">E-mail</th>
                            <th className="p-4">Telefone</th>
                            <th className="p-4">Cadastro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2A2A]">
                        {clients.map((client) => (
                            <tr key={client.id} className="hover:bg-[#1A1A1A] transition">
                                <td className="p-4 font-medium text-[var(--color-text)]">{client.name}</td>
                                <td className="p-4 text-gray-400">{client.email}</td>
                                <td className="p-4 text-gray-400">
                                    {client.phone || <span className="text-gray-600 italic">Não informado</span>}
                                </td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(client.created_at).toLocaleDateString('pt-BR')}
                                </td>
                            </tr>
                        ))}
                        {clients.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-8 text-center text-gray-500">
                                    Nenhum cliente cadastrado ainda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}