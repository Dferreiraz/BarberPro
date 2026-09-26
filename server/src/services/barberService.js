const barberRepository = require('../repositories/barberRepository')

const barberService = {
    getAllBarbers: async () => {
        return await barberRepository.findAll()
    }
}

module.exports = barberService