const errorMiddleware = (err, req, res, next) => {
    console.error(err.message)

    const businessErrors = [
        'E-mail ou senha inválidos',
        'Este Email já está cadastrado'
    ]

    const authErrors = [
        'Token não fornecido',
        'Token inválido ou expirado'
    ]

    if (authErrors.some(errorMsg => err.message.includes(errorMsg))) {
        return res.status(401).json({ message: err.message })
    }

    if (businessErrors.some(errorMsg => err.message.includes(errorMsg))) {
        return res.status(400).json({ message: err.message })
    }

    // Erros inesperados (500 Internal Server Error)
    res.status(500).json({
        message: 'Erro interno do servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
}

module.exports = errorMiddleware