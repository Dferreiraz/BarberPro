const express = require('express')
const router = express.Router()
const financialController = require('../controllers/financialController')
const authMiddleware = require('../middlewares/authMiddleware')

// Protegido: Apenas usuários logados (idealmente, adicionar verificação de role no middleware se quiser ser mais estrito)
router.use(authMiddleware)
router.get('/dashboard', financialController.getDashboard)

module.exports = router