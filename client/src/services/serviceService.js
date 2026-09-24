import api from './api'

const serviceService = {
  getAll: async () => {
    const { data } = await api.get('/services')
    return data
  },

  create: async (serviceData) => {
    const { data } = await api.post('/services', serviceData)
    return data
  },

  update: async (id, serviceData) => {
    const { data } = await api.put(`/services/${id}`, serviceData)
    return data
  },

  delete: async (id) => {
    const { data } = await api.delete(`/services/${id}`)
    return data
  }
}

export default serviceService