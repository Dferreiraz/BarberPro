const barberService = require('../services/barberService')

const barberController = {
    getAll: async (req, res, next) => {
        try {
            const barbers = await barberService.getAllBarbers()
            res.status(200).json(barbers)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = barberController