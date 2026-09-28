const pool = require('../database/pool')

const userRepository = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1'
        const { rows } = await pool.query(query, [email])
        return rows[0]
    },

    create: async (userData) => {
        const query = `
            INSERT INTO users (name, email, password_hash, role, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, name, email, role, phone, created_at
        `
        const { rows } = await pool.query(query, [
            userData.name,
            userData.email,
            userData.passwordHash,
            userData.role || 'client',
            userData.phone || null
        ])
        return rows[0]
    },

    findAll: async () => {
        const query = 'SELECT id, name, email, phone, role, created_at FROM users ORDER BY name'
        const { rows } = await pool.query(query)
        return rows
    },

    delete: async (id) => {
        const query = 'DELETE FROM users WHERE id = $1 RETURNING id'
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    updateResetToken: async (userId, token, expires) => {
        const query = 'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3'
        await pool.query(query, [token, expires, userId])
    },

    findByResetToken: async (token) => {
        const query = 'SELECT * FROM users WHERE reset_token = $1'
        const { rows } = await pool.query(query, [token])
        return rows[0]
    },

    updatePassword: async (userId, newPasswordHash) => {
        const query = `
            UPDATE users 
            SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL 
            WHERE id = $2
        `
        await pool.query(query, [newPasswordHash, userId])
    }
}

module.exports = userRepository