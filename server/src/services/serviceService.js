const serviceRepository = require('../repositories/serviceRepository')

const serviceService = {
    createService: async (serviceData) => {
        const existingService = await serviceRepository.findByName(serviceData.name)
        if (existingService) {
            throw new Error('Já existe um serviço com este nome')
        }
        const newService = await serviceRepository.create(serviceData)
        return newService
    },

    getAllServices: async () => {
        const services = await serviceRepository.findAll()
        return services
    },

    updateService: async (id, serviceData) => {
        // 1. Verificar se o serviço existe
        const existingService = await serviceRepository.findById(id)
        if (!existingService) {
            throw new Error('Serviço não encontrado')
        }

        // 2. Regra de negócio: Se o nome mudou, verificar se o novo nome já existe
        if (serviceData.name && serviceData.name !== existingService.name) {
            const nameExists = await serviceRepository.findByName(serviceData.name)
            if (nameExists) {
                throw new Error('Já existe um serviço com este nome')
            }
        }

        // 3. Atualizar no banco
        const updatedService = await serviceRepository.update(id, serviceData)
        return updatedService
    },

    deleteService: async (id) => {
        const existingService = await serviceRepository.findById(id)
        if (!existingService) {
            throw new Error('Serviço não encontrado')
        }
        
        await serviceRepository.delete(id)
        return { message: 'Serviço removido com sucesso' }
    }
}

module.exports = serviceService