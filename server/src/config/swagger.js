const swaggerJsdoc = require('swagger-jsdoc')

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'BarberPro API',
            version: '1.0.0',
            description: 'Documentação da API do sistema de gerenciamento de barbearia BarberPro.',
            contact: {
                name: 'Equipe BarberPro',
            },
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'https://sua-url-de-producao.com' 
                    : 'http://localhost:3333',
                description: process.env.NODE_ENV === 'production' ? 'Servidor de Produção' : 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Onde o Swagger vai procurar os comentários de documentação
}

const swaggerSpec = swaggerJsdoc(options)

module.exports = swaggerSpec