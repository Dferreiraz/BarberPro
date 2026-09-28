const express = require('express')
const router = express.Router()
const barberController = require('../controllers/barberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)

/**
 * @swagger
 * /barbers:
 *   get:
 *     summary: Lista todos os barbeiros disponíveis
 *     tags: [Barbeiros]
 *     responses:
 *       200:
 *         description: Lista de barbeiros com seus dados
 */
router.get('/', barberController.getAll)

/**
 * @swagger
 * /barbers/profile:
 *   get:
 *     summary: Obtém o perfil do barbeiro logado
 *     tags: [Barbeiros]
 *     responses:
 *       200:
 *         description: Dados do perfil do barbeiro
 */
router.get('/profile', barberController.getProfile)

/**
 * @swagger
 * /barbers/profile:
 *   put:
 *     summary: Atualiza o perfil do barbeiro logado
 *     tags: [Barbeiros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio: { type: string, example: "Especialista em degradê" }
 *               commission_rate: { type: number, example: 60 }
 *               phone: { type: string, example: "5511999998888" }
 *     responses:
 *       200:
 *         description: Perfil atualizado com sucesso
 */
router.put('/profile', barberController.updateProfile)

module.exports = router