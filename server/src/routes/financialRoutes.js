const express = require('express')
const router = express.Router()
const financialController = require('../controllers/financialController')
const authMiddleware = require('../middlewares/authMiddleware')

// Protegido: Apenas usuários logados
router.use(authMiddleware)

/**
 * @swagger
 * /financial/dashboard:
 *   get:
 *     summary: Obtém o resumo financeiro e fluxo de caixa
 *     tags: [Financeiro]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados financeiros retornados com sucesso (faturamento, comissões e fluxo diário)
 *       401:
 *         description: Não autorizado
 */
router.get('/dashboard', financialController.getDashboard)

module.exports = router