const winston = require('winston')
const path = require('path')

// Define os níveis de log e suas cores
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
}

winston.addColors(colors)

// Formatos de saída
const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
)

// Transportes (onde os logs vão ser salvos)
const transports = [
    // Console (para desenvolvimento)
    new winston.transports.Console(),
    
    // Arquivo de Erros (para produção)
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
    }),
    
    // Arquivo de Todos os Logs (para produção)
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/all.log'),
    })
]

const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    levels,
    format,
    transports,
})

module.exports = logger