const userRepository = require('../repositories/userRepository')
const barberRepository = require('../repositories/barberRepository')
const pool = require('../database/pool')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const logger = require('../config/logger')

const authService = {
    register: async (userData) => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            
            const existingUser = await userRepository.findByEmail(userData.email)
            if (existingUser) {
                throw new Error('Este Email já está cadastrado')
            }

            const saltRounds = 10
            const passwordHash = await bcrypt.hash(userData.password, saltRounds)

            const dataToSave = {
                name: userData.name,
                email: userData.email,
                passwordHash,
                role: userData.role || 'client',
                phone: userData.phone || null
            }

            const newUser = await userRepository.create(dataToSave)

            if (newUser.role === 'barber') {
                try {
                    const existingBarber = await client.query('SELECT id FROM barbers WHERE user_id = $1', [newUser.id])
                    if (existingBarber.rows.length === 0) {
                        await client.query(`
                            INSERT INTO barbers (user_id, bio, commission_rate, is_available)
                            VALUES ($1, $2, $3, $4)
                        `, [newUser.id, userData.bio || 'Barbeiro profissional', userData.commission_rate || 50.00, true])
                        logger.info(`Perfil de barbeiro criado automaticamente para o usuário ID ${newUser.id}`)
                    }
                } catch (barberError) {
                    logger.warn(`Aviso: Não foi possível criar perfil de barbeiro para usuário ${newUser.id}: ${barberError.message}`)
                }
            }

            await client.query('COMMIT')
            const { password_hash, ...userWithoutPassword } = newUser
            
            const token = jwt.sign(
                { id: userWithoutPassword.id, role: userWithoutPassword.role },
                process.env.JWT_SECRET || 'segredo_super_secreto',
                { expiresIn: '7d' }
            )

            return { token, user: userWithoutPassword }

        } catch (error) {
            await client.query('ROLLBACK')
            logger.error(`Erro no registro: ${error.message}`)
            throw error
        } finally {
            client.release()
        }
    },

    login: async (userData) => {
        const user = await userRepository.findByEmail(userData.email)
        const isPasswordValid = user && await bcrypt.compare(userData.password, user.password_hash)
        
        if (!user || !isPasswordValid) {
            throw new Error('E-mail ou senha inválidos')
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'segredo_super_secreto',
            { expiresIn: '7d' }
        )

        const { password_hash, ...userWithoutPassword } = user
        return { token, user: userWithoutPassword }
    },

    requestPasswordReset: async (email) => {
        const user = await userRepository.findByEmail(email)
        if (!user) {
            throw new Error('Se este e-mail estiver cadastrado, você receberá as instruções.')
        }

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString()
        const expires = new Date(Date.now() + 15 * 60 * 1000)

        await userRepository.updateResetToken(user.id, resetToken, expires)

        return { 
            message: 'Código de recuperação gerado. (Modo MVP: use este código)', 
            resetToken 
        }
    },

    resetPassword: async (token, newPassword) => {
        const user = await userRepository.findByResetToken(token)
        
        if (!user) {
            throw new Error('Código de recuperação inválido.')
        }

        if (new Date() > new Date(user.reset_token_expires)) {
            throw new Error('O código de recuperação expirou. Solicite um novo.')
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(newPassword, saltRounds)
        await userRepository.updatePassword(user.id, passwordHash)
        
        return { message: 'Senha alterada com sucesso!' }
    },

    getAllUsers: async () => {
        const users = await userRepository.findAll()
        return users.map(({ password_hash, ...userWithoutPassword }) => userWithoutPassword)
    }
}

module.exports = authService