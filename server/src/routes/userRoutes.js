const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')

router.get('/', authMiddleware, userController.getAll)
router.get('/barbers', authMiddleware, userController.getBarbers)
router.get('/clients', authMiddleware, userController.getClients)

module.exports = router