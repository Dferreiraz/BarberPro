const express = require('express')
const router = express.Router()
const appointmentController = require('../controllers/appointmentController')
const authMiddleware = require('../middlewares/authMiddleware')

// Todas as rotas de agendamento devem ser protegidas
router.use(authMiddleware)

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Lista todos os agendamentos
 *     tags: [Agendamentos]
 *     responses:
 *       200:
 *         description: Lista de agendamentos retornada com sucesso
 */
router.get('/', appointmentController.getAll)

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Agendamentos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [barberId, serviceId, date, time, totalPrice]
 *             properties:
 *               barberId: { type: integer, example: 1 }
 *               serviceId: { type: integer, example: 1 }
 *               date: { type: string, format: date, example: "2026-10-10" }
 *               time: { type: string, example: "14:30" }
 *               totalPrice: { type: number, example: 45.00 }
 *               notes: { type: string, example: "Observação do cliente" }
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso (retorna link do WhatsApp)
 *       400:
 *         description: Erro de validação ou horário indisponível
 */
router.post('/', appointmentController.create)

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Atualiza o status de um agendamento
 *     tags: [Agendamentos]
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
 *               status: { type: string, enum: [pending_payment, confirmed, completed, cancelled], example: "confirmed" }
 *               paymentMethod: { type: string, example: "pix" }
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 */
router.patch('/:id/status', appointmentController.updateStatus)

/**
 * @swagger
 * /appointments/{id}/cancel:
 *   patch:
 *     summary: Cancela um agendamento
 *     tags: [Agendamentos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Agendamento cancelado com sucesso
 */
router.patch('/:id/cancel', appointmentController.cancel)

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza data e hora de um agendamento
 *     tags: [Agendamentos]
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
 *               date: { type: string, format: date, example: "2026-10-11" }
 *               time: { type: string, example: "15:00" }
 *               notes: { type: string, example: "Nova observação" }
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 */
router.put('/:id', appointmentController.update)

module.exports = router