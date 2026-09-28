const logger = require('../config/logger')

const errorMiddleware = (err, req, res, next) => {
    // 1. Listas de erros conhecidos para fallback de status code
    const businessErrors = [
        'E-mail ou senha inválidos',
        'Este Email já está cadastrado',
        'Este horário já está reservado', // Erro da Fase 2
        'Status inválido',
        'Agendamento não encontrado',
        'Perfil de barbeiro não encontrado'
    ]

    const authErrors = [
        'Token não fornecido',
        'Token inválido ou expirado',
        'Acesso negado'
    ]

    // 2. Determinar o Status Code (Prioriza o definido no controller, senão verifica a mensagem)
    let statusCode = err.statusCode || 500

    if (authErrors.some(errorMsg => err.message.includes(errorMsg))) {
        statusCode = 401
    } else if (businessErrors.some(errorMsg => err.message.includes(errorMsg))) {
        statusCode = 400
    } else if (err.name === 'ValidationError' || err.code === '23505') { // 23505 é erro de unique constraint do Postgres
        statusCode = 400
    }

    // 3. Log Estruturado com Winston
    const isDev = process.env.NODE_ENV === 'development'
    
    const logMessage = isDev 
        ? `[${req.method}] ${req.path} | ${err.message} | Stack: ${err.stack}`
        : `[${req.method}] ${req.path} | IP: ${req.ip} | ${err.message}`

    // Erros 5xx são críticos (error), 4xx são avisos de uso/regra de negócio (warn)
    if (statusCode >= 500) {
        logger.error(logMessage)
    } else {
        logger.warn(logMessage)
    }

    // 4. Resposta ao Cliente (Blindada para Produção)
    res.status(statusCode).json({
        // Em produção, erros 500 nunca revelam a mensagem real do banco/sistema
        message: (statusCode === 500 && !isDev) 
            ? 'Erro interno do servidor. Nossa equipe foi notificada.' 
            : (err.message || 'Algo deu errado na requisição.'),
            
        // O campo 'error' só é enviado em desenvolvimento para ajudar no debug do frontend
        error: isDev ? err.message : undefined
    })
}

module.exports = errorMiddleware