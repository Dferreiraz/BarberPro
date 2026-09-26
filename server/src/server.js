require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./database/pool')

// Importação das Rotas
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const serviceRoutes = require('./routes/serviceRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')

// Importação dos Middlewares
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/services', serviceRoutes)
app.use('/appointments', appointmentRoutes)

app.get('/', (req, res) => {
    res.json({ message: 'BarberPro API está rodando!' })
})

app.use(errorMiddleware)

const PORT = process.env.PORT || 3333

const startServer = async () => {
    try {
        await pool.query('SELECT NOW()')
        console.log('Banco de dados PostgreSQL conectado!')
    } catch (error) {
        console.error('Falha ao conectar no banco de dados:', error.message)
    }

    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`)
        console.log(`Ambiente: ${process.env.NODE_ENV || 'não definido'}`)
    })
}

startServer()