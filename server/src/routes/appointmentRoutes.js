const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointmentController')
const authMiddleware = require('../middlewares/authMiddleware')

// Todas as rotas de agendamento devem ser protegidas
router.use(authMiddleware)

router.post('/', appointmentController.create)
router.get('/', appointmentController.getAll)
router.patch('/:id/status', appointmentController.updateStatus)

module.exports = router