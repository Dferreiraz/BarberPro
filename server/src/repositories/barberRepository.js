const pool = require('../database/pool')

const barberRepository = {
    findAll: async () => {
        const query = `
            SELECT 
                b.id, b.bio, b.commission_rate, b.is_available,
                u.name, u.email, u.phone
            FROM barbers b
            JOIN users u ON b.user_id = u.id
            WHERE b.is_available = true
            ORDER BY u.name
        `
        const { rows } = await pool.query(query)
        return rows
    },

        // Busca o perfil do barbeiro baseado no ID do usuário logado
    findByUserId: async (userId) => {
        const query = `
            SELECT 
                b.id AS barber_id, b.bio, b.commission_rate, b.is_available,
                u.id AS user_id, u.name, u.email, u.phone
            FROM barbers b
            JOIN users u ON b.user_id = u.id
            WHERE u.id = $1
        `
        const { rows } = await pool.query(query, [userId])
        return rows[0]
    },

    // Atualiza dados do barbeiro (tabela barbers) e do usuário (tabela users - telefone)
    updateProfile: async (userId, barberData, userData) => {
        // Atualiza tabela barbers
        const queryBarber = `
            UPDATE barbers 
            SET bio = $1, commission_rate = $2
            WHERE user_id = $3
            RETURNING *
        `
        await pool.query(queryBarber, [barberData.bio, barberData.commission_rate, userId])

        // Atualiza tabela users (apenas o telefone, que é crucial para o WhatsApp)
        const queryUser = `
            UPDATE users 
            SET phone = $1
            WHERE id = $2
            RETURNING *
        `
        const { rows } = await pool.query(queryUser, [userData.phone, userId])
        return rows[0]
    }
}

module.exports = barberRepository