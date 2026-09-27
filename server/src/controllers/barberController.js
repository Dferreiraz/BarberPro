const barberService = require('../services/barberService')

const barberController = {
    getAll: async (req, res, next) => {
        try {
            const barbers = await barberService.getAllBarbers()
            res.status(200).json(barbers)
        } catch (error) {
            next(error)
        }
    },

        getProfile: async (req, res, next) => {
        try {
            // Pega o ID do usuário logado pelo token
            const profile = await barberService.getProfile(req.userId)
            res.status(200).json(profile)
        } catch (error) {
            next(error)
        }
    },

    updateProfile: async (req, res, next) => {
        try {
            const updatedUser = await barberService.updateProfile(req.userId, req.body)
            res.status(200).json({ message: 'Perfil atualizado com sucesso', data: updatedUser })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = barberController