const express = require('express')
const router = express.Router()
const barberController = require('../controllers/barberController')
const authMiddleware = require('../middlewares/authMiddleware')

router.use(authMiddleware)
router.get('/', barberController.getAll)

module.exports = router