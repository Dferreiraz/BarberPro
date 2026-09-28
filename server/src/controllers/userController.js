const userService = require('../services/userService')

const userController = {
    getAll: async (req, res, next) => {
        try {
            const users = await userService.getAllUsers()
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    },

    getBarbers: async (req, res, next) => {
        try {
            const barbers = await userService.getBarbers()
            res.status(200).json(barbers)
        } catch (error) {
            next(error)
        }
    },

    getClients: async (req, res, next) => {
        try {
            const clients = await userService.getClients()
            res.status(200).json(clients)
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params
            await userService.deleteUser(id, req.userId)
            res.status(200).json({ message: 'Usuário excluído com sucesso' })
        } catch (error) {
            next(error)
        }
    }
}

module.exports = userController