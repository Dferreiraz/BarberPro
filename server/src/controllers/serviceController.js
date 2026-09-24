const serviceService = require('../services/serviceService')

const serviceController = {
    create: async (req, res, next) => {
        try {
            const newService = await serviceService.createService(req.body)
            res.status(201).json(newService)
        } catch (error) {
            next(error)
        }
    },

    getAll: async (req, res, next) => {
        try {
            const services = await serviceService.getAllServices()
            res.status(200).json(services)
        } catch (error) {
            next(error)
        }
    },

    update: async (req, res, next) => {
        try {
            const { id } = req.params
            const updatedService = await serviceService.updateService(id, req.body)
            res.status(200).json(updatedService)
        } catch (error) {
            next(error)
        }
    },

    delete: async (req, res, next) => {
        try {
            const { id } = req.params
            const result = await serviceService.deleteService(id)
            res.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }
}

module.exports = serviceController