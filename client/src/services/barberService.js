import api from './api'

const barberService = {
    getProfile: async () => {
        const response = await api.get('/barbers/profile')
        return response.data
    },
    
    updateProfile: async (data) => {
        const response = await api.put('/barbers/profile', data)
        return response.data
    }
}

export default barberService