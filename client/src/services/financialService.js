import api from './api'

const financialService = {
    getDashboardData: async () => {
        const response = await api.get('/financial/dashboard')
        return response.data
    }
}

export default financialService