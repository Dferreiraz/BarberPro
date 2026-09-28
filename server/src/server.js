require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./database/pool')
const logger = require('./config/logger')
const swaggerUi = require('swagger-ui-express')
const swaggerSpec = require('./config/swagger')

// Importação das Rotas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const barberRoutes = require('./routes/barberRoutes')
const financialRoutes = require('./routes/financialRoutes')

// Importação dos Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',') 
    : ['http://localhost:5173', 'http://localhost:3000']

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            logger.warn(`Tentativa de CORS bloqueada para origem: ${origin}`)
            callback(new Error('Não permitido pelo CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Registro das Rotas
app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/services', serviceRoutes)
app.use('/appointments', appointmentRoutes)
app.use('/barbers', barberRoutes)
app.use('/financial', financialRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'BarberPro API está rodando!' })
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3333

const startServer = async () => {
    try {
        await pool.query('SELECT NOW()')
        logger.info('Banco de dados PostgreSQL conectado com sucesso!')
    } catch (error) {
        logger.error('Falha ao conectar no banco de dados:', error.message)
        process.exit(1)
    }

    app.listen(PORT, () => {
        logger.info(`Servidor rodando na porta ${PORT}`)
        logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`)
    })
}

// Captura de erros não tratados (Promises rejeitadas)
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

startServer()