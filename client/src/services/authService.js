import api from './api'

const authService = {
  login: async (credentials) => {
    // O backend retorna { message, user: { token, user: {...} } }
    const { data } = await api.post('/auth/login', credentials)
    return data.user 
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data.user
  }
}

export default authService