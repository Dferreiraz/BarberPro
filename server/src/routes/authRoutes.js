const express = require('express')
const router = express.Router()
const rateLimit = require('express-rate-limit')
const authController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Muitas tentativas de autenticação. Por favor, tente novamente em 15 minutos.' },
    standardHeaders: true,
    legacyHeaders: false,
})

router.use(authLimiter)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, example: "eduardo@barberpro.com" }
 *               password: { type: string, example: "123456" }
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: E-mail ou senha inválidos
 */
router.post('/login', authController.login)

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string, example: "Eduardo Ferreira" }
 *               email: { type: string, example: "eduardo@barberpro.com" }
 *               password: { type: string, example: "123456" }
 *               role: { type: string, enum: [client, barber, admin], example: "barber" }
 *               phone: { type: string, example: "5511999998888" }
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: E-mail já cadastrado
 */
router.post('/register', authController.register)

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Verifica o token e retorna dados do usuário
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token inválido ou não fornecido
 */
router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Rota protegida acessada com sucesso!', userId: req.userId })
})

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Solicita código de recuperação de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email: { type: string, example: "cliente@cliente.com" }
 *     responses:
 *       200:
 *         description: Código gerado com sucesso
 */
router.post('/forgot-password', authController.requestPasswordReset)

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Redefine a senha usando o código
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, newPassword]
 *             properties:
 *               token: { type: string, example: "123456" }
 *               newPassword: { type: string, example: "novaSenha123" }
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Código inválido ou expirado
 */
router.post('/reset-password', authController.resetPassword)

module.exports = router