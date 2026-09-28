const financialService = require('../services/financialService')

const financialController = {
    getDashboard: async (req, res, next) => {
        try {
            // Opcional: Adicionar verificação aqui para garantir que só 'barber' ou 'admin' acessa
            const data = await financialService.getDashboardData()
            res.status(200).json(data)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = financialController