const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Lista todos os serviços (Rota Pública)
 *     tags: [Serviços]
 *     responses:
 *       200:
 *         description: Lista de serviços
 */
router.get('/', serviceController.getAll)

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Cria um novo serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, duration_minutes]
 *             properties:
 *               name: { type: string, example: "Corte Degradê" }
 *               description: { type: string, example: "Corte moderno" }
 *               price: { type: number, example: 45.00 }
 *               duration_minutes: { type: integer, example: 30 }
 *     responses:
 *       201:
 *         description: Serviço criado com sucesso
 */
router.post('/', authMiddleware, serviceController.create)

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Atualiza um serviço existente
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, example: "Corte Social" }
 *               price: { type: number, example: 40.00 }
 *     responses:
 *       200:
 *         description: Serviço atualizado
 */
router.put('/:id', authMiddleware, serviceController.update)

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Exclui um serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Serviço excluído com sucesso
 */
router.delete('/:id', authMiddleware, serviceController.delete)

module.exports = router