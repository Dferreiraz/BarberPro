const userRepository = require('../repositories/userRepository')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const authService = {
    register: async (userData) => {
        // 1. regra de negócio: Verificar se o email já existe
        const existingUser = await userRepository.findByEmail(userData.email)
        if (existingUser) {
            throw new Error('Este Email já está cadastrado')
        }

        // 2. Regra de negócio: Hash da senha antes de salvar
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(userData.password, saltRounds)

        // 3. Preparando os dados limpos para o banco
        const dataToSave = {
            name: userData.name,
            email: userData.email,
            passwordHash,
            role: userData.role || 'client'
        }

        // 4. Chamar o repositório para salvar
        const newUser = await userRepository.create(dataToSave)

        // 5. Retornar apenas o que é seguro
        const { password_hash, ...userWithoutPassword } = newUser
        return userWithoutPassword
    },

    login: async (userData) => {
        // 1. Buscar o usuário pelo e-mail
        const user = await userRepository.findByEmail(userData.email)

        // 2. Comparar a senha digitada com o hash do banco
        const isPasswordValid = user && await bcrypt.compare(userData.password, user.password_hash)
        
        // 3. Se a senha NÃO for válida, lança o mesmo erro
        if (!user || !isPasswordValid) {
            throw new Error('E-mail ou senha inválidos')
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'segredo_super_secreto',
            { expiresIn: '7d' }
        )

        const { password_hash, ...userWithoutPassword } = user
        
        return {
            token,
            user: userWithoutPassword
        }
    },

    getAllUsers: async () => {
        const users = await userRepository.findAll()

        return users.map(({ password_hash, ...userWithoutPassword }) => {
            return userWithoutPassword
        })
    }
}

module.exports = authService