const appointmentService = require('../services/appointmentService')

const appointmentController = {
    create: async (req, res, next) => {
        try {
            // O ID do cliente vem do token (authMiddleware), garantindo segurança
            const clientId = req.userId 
            
            // Destructuring seguro do body
            const { barberId, serviceId, date, time, totalPrice, notes } = req.body

            const appointmentData = {
                clientId,
                barberId,
                serviceId,
                date,
                time,
                totalPrice,
                notes
            }

            const result = await appointmentService.createAppointment(appointmentData)
            
            res.status(201).json({
                message: 'Agendamento criado com sucesso',
                data: result
            })
        } catch (error) {
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const appointments = await appointmentService.getAllAppointments()
            res.status(200).json(appointments)
        } catch (error) {
            next(error)
        }
    },

    updateStatus: async (req, res, next) => {
        try {
            const { id } = req.params
            const { status, paymentMethod } = req.body
            
            const updated = await appointmentService.updateAppointmentStatus(id, status, paymentMethod)
            
            res.status(200).json({
                message: 'Status do agendamento atualizado',
                data: updated
            })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = appointmentController