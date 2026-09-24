import { useState, useEffect } from 'react'
import serviceService from '../services/serviceService'

export default function ServicesPage() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingService, setEditingService] = useState(null) // Controla se estamos editando
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_minutes: ''
  })

  // Busca inicial
  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      try {
        const data = await serviceService.getAll()
        if (isMounted) setServices(data)
      } catch (error) {
        console.error('Erro ao buscar serviços:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [])

  // Função unificada para Salvar (Cria ou Atualiza)
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        duration_minutes: parseInt(formData.duration_minutes)
      }

      if (editingService) {
        await serviceService.update(editingService.id, payload)
      } else {
        await serviceService.create(payload)
      }
      
      // Resetar estados
      setFormData({ name: '', description: '', price: '', duration_minutes: '' })
      setEditingService(null)
      setShowForm(false)
      
      // Recarregar lista
      const data = await serviceService.getAll()
      setServices(data)
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao salvar serviço')
    }
  }

  // Preparar formulário para edição
  const handleEdit = (service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      price: service.price.toString(),
      duration_minutes: service.duration_minutes.toString()
    })
    setShowForm(true)
  }

  // Excluir serviço
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
        await serviceService.delete(id)
        // Atualiza a lista removendo o item localmente (mais rápido que recarregar tudo)
        setServices(services.filter(s => s.id !== id))
      } catch (error) {
        alert(error.response?.data?.message || 'Erro ao excluir serviço')
      }
    }
  }

  // Cancelar edição/criação
  const handleCancel = () => {
    setFormData({ name: '', description: '', price: '', duration_minutes: '' })
    setEditingService(null)
    setShowForm(false)
  }

  if (loading) return <div className="text-center mt-10 text-[var(--color-text)]">Carregando serviços...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">Serviços</h2>
        <button 
          onClick={() => { handleCancel(); setShowForm(true) }}
          className="px-4 py-2 bg-[var(--color-primary)] text-black font-bold rounded hover:opacity-90 transition"
        >
          + Novo Serviço
        </button>
      </div>

      {showForm && (
        <div className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] mb-6">
          <h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">
            {editingService ? 'Editar Serviço' : 'Novo Serviço'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" 
              placeholder="Nome do serviço" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            <input 
              type="number" 
              placeholder="Preço (R$)" 
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              required
              step="0.01"
              className="p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            <input 
              type="number" 
              placeholder="Duração (minutos)" 
              value={formData.duration_minutes}
              onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
              required
              className="p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)]"
            />
            <input 
              type="text" 
              placeholder="Descrição (opcional)" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="p-2 rounded bg-[var(--color-background)] border border-[#2A2A2A] text-[var(--color-text)] focus:outline-none focus:border-[var(--color-primary)] md:col-span-2"
            />
            <div className="md:col-span-2 flex gap-4">
              <button 
                type="submit"
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold"
              >
                {editingService ? 'Atualizar' : 'Salvar'}
              </button>
              <button 
                type="button"
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-semibold"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Serviços */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="bg-[var(--color-surface)] p-6 rounded-lg border border-[#2A2A2A] hover:border-[var(--color-primary)] transition relative group">
            <h3 className="text-xl font-bold text-[var(--color-primary)] mb-2">{service.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{service.description || 'Sem descrição'}</p>
            <div className="flex justify-between items-center text-sm mb-4">
              <span className="text-lg font-bold text-[var(--color-text)]">R$ {parseFloat(service.price).toFixed(2)}</span>
              <span className="bg-[#2A2A2A] text-[var(--color-text)] px-2 py-1 rounded text-xs">{service.duration_minutes} min</span>
            </div>
            
            {/* Botões de Ação (visíveis no hover ou sempre em mobile) */}
            <div className="flex gap-2 pt-4 border-t border-[#2A2A2A]">
              <button 
                onClick={() => handleEdit(service)}
                className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
              >
                Editar
              </button>
              <button 
                onClick={() => handleDelete(service.id)}
                className="flex-1 px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
        
        {services.length === 0 && (
          <div className="col-span-full text-center text-gray-500 py-10 bg-[var(--color-surface)] rounded-lg border border-[#2A2A2A] border-dashed">
            Nenhum serviço cadastrado ainda.
          </div>
        )}
      </div>
    </div>
  )
}