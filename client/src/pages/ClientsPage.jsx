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
            // Remove o cliente da lista localmente sem precisar recarregar tudo
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
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-6 w-32" />
                </div>
                <div className="bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] overflow-hidden p-4">
                    <div className="grid grid-cols-4 gap-4 mb-4 text-sm font-bold text-gray-400">
                        <div>Nome</div><div>E-mail</div><div>Telefone</div><div>Ações</div>
                    </div>
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="grid grid-cols-4 gap-4 py-3 border-t border-[#2A2A2A]">
                            <Skeleton className="h-5 w-3/4" />
                            <Skeleton className="h-5 w-full" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-8 w-20" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-primary)]">Clientes Cadastrados</h2>
                <span className="text-sm text-gray-400">
                    Total: <span className="text-[var(--color-primary)] font-bold">{clients.length}</span>
                </span>
            </div>

            <div className="bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[#111111] text-gray-400 text-sm uppercase">
                            <tr>
                                <th className="p-4">Nome</th>
                                <th className="p-4">E-mail</th>
                                <th className="p-4">Telefone</th>
                                <th className="p-4">Cadastro</th>
                                <th className="p-4 text-center">Ações</th>
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
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleDelete(client.id, client.name)}
                                            disabled={deletingId === client.id}
                                            className="px-3 py-1.5 bg-red-600/20 text-red-400 border border-red-600/50 text-sm rounded hover:bg-red-600 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed"
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