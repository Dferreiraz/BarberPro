import { useState, useEffect } from 'react'
import api from '../services/api'
import userService from '../services/userService'
import Skeleton from '../components/Skeleton'

export default function ClientsPage() {
    const [clients, setClients] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

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

    const handleDelete = async (id, clientName) => {
        if (!window.confirm(`Tem certeza que deseja excluir o cliente "${clientName}"?\n\nEsta ação não poderá ser desfeita.`)) {
            return
        }

        setDeletingId(id)
        try {
            await userService.delete(id)
            setClients(clients.filter(client => client.id !== id))
            alert('Cliente excluído com sucesso!')
        } catch (error) {
            alert(error.response?.data?.message || 'Erro ao excluir cliente.')
        } finally {
            setDeletingId(null)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 p-4 md:p-8">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-[var(--color-surface)] p-4 rounded-lg border border-[#2A2A2A]">
                            <Skeleton className="h-5 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full mb-1" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">Clientes Cadastrados</h2>
                <span className="text-sm text-gray-400">
                    Total: <span className="text-[var(--color-primary)] font-bold">{clients.length}</span>
                </span>
            </div>

            {/* 📱 VERSÃO MOBILE - Cards Verticais */}
            <div className="sm:hidden space-y-4">
                {clients.map((client) => (
                    <div key={client.id} className="bg-[var(--color-surface)] p-4 rounded-lg border border-[#2A2A2A] space-y-3">
                        {/* Nome */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Nome</label>
                            <p className="text-[var(--color-text)] font-medium mt-1">{client.name}</p>
                        </div>
                        
                        {/* E-mail */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">E-mail</label>
                            <p className="text-gray-400 text-sm mt-1">{client.email}</p>
                        </div>
                        
                        {/* Telefone */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Telefone</label>
                            <p className="text-gray-400 text-sm mt-1">
                                {client.phone || <span className="text-gray-600 italic">Não informado</span>}
                            </p>
                        </div>
                        
                        {/* Cadastro */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase font-semibold">Cadastro</label>
                            <p className="text-gray-400 text-sm mt-1">
                                {new Date(client.created_at).toLocaleDateString('pt-BR')}
                            </p>
                        </div>
                        
                        {/* Ações */}
                        <div className="pt-3 border-t border-[#2A2A2A]">
                            <button
                                onClick={() => handleDelete(client.id, client.name)}
                                disabled={deletingId === client.id}
                                className="w-full px-4 py-3 bg-red-600/20 text-red-400 border border-red-600/50 rounded hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                            >
                                {deletingId === client.id ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>
                    </div>
                ))}
                {clients.length === 0 && (
                    <div className="text-center text-gray-500 py-10 bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] border-dashed">
                        Nenhum cliente cadastrado ainda.
                    </div>
                )}
            </div>

            {/* 💻 VERSÃO DESKTOP - Tabela Horizontal */}
            <div className="hidden sm:block bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[650px]">
                        <thead className="bg-[#111111] text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="px-4 py-3 whitespace-nowrap">Nome</th>
                                <th className="px-4 py-3 whitespace-nowrap">E-mail</th>
                                <th className="px-4 py-3 whitespace-nowrap">Telefone</th>
                                <th className="px-4 py-3 whitespace-nowrap">Cadastro</th>
                                <th className="px-4 py-3 text-center whitespace-nowrap">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2A2A2A]">
                            {clients.map((client) => (
                                <tr key={client.id} className="hover:bg-[#1A1A1A] transition">
                                    <td className="px-4 py-3 font-medium text-[var(--color-text)] whitespace-nowrap">{client.name}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">{client.email}</td>
                                    <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                                        {client.phone || <span className="text-gray-600 italic">Não informado</span>}
                                    </td>
                                    <td className="px-4 py-3 text-gray-400 text-sm whitespace-nowrap">
                                        {new Date(client.created_at).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() => handleDelete(client.id, client.name)}
                                            disabled={deletingId === client.id}
                                            className="px-4 py-2 bg-red-600/20 text-red-400 border border-red-600/50 text-sm rounded hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {deletingId === client.id ? 'Excluindo...' : 'Excluir'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {clients.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        Nenhum cliente cadastrado ainda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}