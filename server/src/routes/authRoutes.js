const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

const authMiddleware = require('../middlewares/authMiddleware')

router.get('/me', authMiddleware, (req, res) => {
    res.json({ message: 'Rota protegida acessada!', userId: req.userId })
})

router.post('/register', authController.register)
router.post('/login', authController.login)

module.exports = router