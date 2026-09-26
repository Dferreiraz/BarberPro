const authService = require('../services/authService')
const authController = require('../services/authService')

const userController = {
    getAll: async (req, res, next) => {
        try {
            const users = await authService.getAllUsers()

            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    },

        getBarbers: async (req, res, next) => {
        try {
            const users = await authService.getAllUsers()
            const barbers = users.filter(user => user.role === 'barber')
            res.status(200).json(barbers)
        } catch (error) {
            next(error)
        }
    },

    getClients: async (req, res, next) => {
        try {
            const users = await authService.getAllUsers()
            const clients = users.filter(user => user.role === 'client')
            res.status(200).json(clients)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = userController