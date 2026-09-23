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
    }
}

module.exports = userController