const appointmentRepository = require('../repositories/appointmentRepository')

const appointmentService = {
    createAppointment: async (appointmentData) => {
        // 1. Regra de Negócio: Verificar disponibilidade
        const isBusy = await appointmentRepository.checkAvailability(
            appointmentData.barberId,
            appointmentData.date,
            appointmentData.time
        )

        if (isBusy) {
            throw new Error('Este horário já está reservado para este barbeiro.')
        }

        // 2. Criar o agendamento (status padrão no banco já é 'pending_payment')
        const newAppointment = await appointmentRepository.create(appointmentData)

        // 3. Buscar detalhes completos para gerar o link do WhatsApp
        const details = await appointmentRepository.findByIdWithDetails(newAppointment.id)

        if (!details) {
            throw new Error('Erro ao buscar detalhes do agendamento.')
        }

        // 4. Gerar URL do WhatsApp (wa.me)
        // Usamos details.date para garantir que pegamos a data do banco
        const dataFormatada = new Date(details.date).toLocaleDateString('pt-BR')
        
        const mensagem = `Olá ${details.barber_name}!%0A%0AGostaria de finalizar meu agendamento:%0A- Serviço: ${details.service_name}%0A- Data: ${dataFormatada} às ${details.time}%0A- Valor: R$ ${parseFloat(details.total_price).toFixed(2)}%0A%0APodemos definir a forma de pagamento?`
        
        // Remove caracteres não numéricos do telefone do barbeiro
        const telefoneLimpo = details.barber_phone ? details.barber_phone.replace(/\D/g, '') : ''
        
        const whatsappUrl = telefoneLimpo 
            ? `https://wa.me/${telefoneLimpo}?text=${mensagem}`
            : null

        return {
            appointment: newAppointment,
            whatsappUrl
        }
    },

    getAllAppointments: async () => {
        return await appointmentRepository.findAll()
    },

    updateAppointmentStatus: async (id, status, paymentMethod) => {
        const validStatuses = ['pending_payment', 'confirmed', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
            throw new Error('Status inválido.')
        }

        const updated = await appointmentRepository.updateStatus(id, status, paymentMethod)
        if (!updated) {
            throw new Error('Agendamento não encontrado.')
        }

        return updated
    }
}

module.exports = appointmentService