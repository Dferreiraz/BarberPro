const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários do sistema
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista completa de usuários
 *       401:
 *         description: Não autorizado
 */
router.get('/', authMiddleware, userController.getAll)

/**
 * @swagger
 * /users/barbers:
 *   get:
 *     summary: Lista apenas os usuários com perfil de barbeiro
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de barbeiros
 */
router.get('/barbers', authMiddleware, userController.getBarbers)

/**
 * @swagger
 * /users/clients:
 *   get:
 *     summary: Lista apenas os usuários com perfil de cliente
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get('/clients', authMiddleware, userController.getClients)

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Exclui um usuário (apenas barbeiro/admin)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       400:
 *         description: Não é possível excluir (possui histórico ou é o próprio usuário)
 *       401:
 *         description: Não autorizado
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authMiddleware, userController.delete)

module.exports = router