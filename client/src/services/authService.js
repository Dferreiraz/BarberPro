import api from './api'

const authService = {
  login: async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    return data.user 
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData)
    return data.user
  },

  forgotPassword: async (email) => {
    const { data } = await api.post('/auth/forgot-password', { email })
    return data
  },

  resetPassword: async (token, newPassword) => {
    const { data } = await api.post('/auth/reset-password', { token, newPassword })
    return data
  }
}

export default authService