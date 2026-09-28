const barberRepository = require('../repositories/barberRepository')

const barberService = {
    getAllBarbers: async () => {
        return await barberRepository.findAll()
    },

        getProfile: async (userId) => {
        const profile = await barberRepository.findByUserId(userId)
        if (!profile) {
            throw new Error('Perfil de barbeiro não encontrado.')
        }
        return profile
    },

    updateProfile: async (userId, data) => {
        // Separa os dados para cada tabela
        const barberData = {
            bio: data.bio,
            commission_rate: parseFloat(data.commission_rate)
        }
        const userData = {
            phone: data.phone
        }

        const updatedUser = await barberRepository.updateProfile(userId, barberData, userData)
        return updatedUser
    }
}

module.exports = barberService