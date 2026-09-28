const express = require('express')
const router = express.Router()
const barberController = require('../controllers/barberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)
router.get('/', barberController.getAll)
router.get('/profile', authMiddleware, barberController.getProfile)
router.put('/profile', authMiddleware, barberController.updateProfile)

module.exports = router