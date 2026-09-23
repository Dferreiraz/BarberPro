const authService = require('../services/authService')

const authController = {
    register: async (req, res, next) => {
        try {
            const userData = req.body
            const newUser = await authService.register(userData)

            res.status(201).json({
                message:'Usuário registrado com sucesso',
                user: newUser
            })
        } catch (error) {
            next(error)
        }
    },

    login: async (req, res, next) => {
        try {
            const userData = req.body
            const user = await authService.login(userData)

            res.status(200).json({
                message:'Login feito com sucesso',
                user
            })
        } catch (error) {
            next(error)
        }
    }

}

module.exports = authController