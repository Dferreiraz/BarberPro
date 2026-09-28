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
    },

    // ✅ NOVO MÉTODO ADICIONADO: Cria o perfil do barbeiro automaticamente no registro
    create: async (barberData) => {
        const query = `
            INSERT INTO barbers (user_id, bio, commission_rate, is_available)
            VALUES ($1, $2, $3, $4)
            RETURNING id, user_id, bio, commission_rate, is_available, created_at
        `
        const { rows } = await pool.query(query, [
            barberData.user_id,
            barberData.bio || 'Barbeiro profissional',
            barberData.commission_rate || 50.00,
            barberData.is_available !== undefined ? barberData.is_available : true
        ])
        return rows[0]
    }
}

module.exports = barberRepository