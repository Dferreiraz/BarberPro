import api from './api'

const userService = {
    delete: async (id) => {
        const response = await api.delete(`/users/${id}`)
        return response.data
    }
}

export default userService