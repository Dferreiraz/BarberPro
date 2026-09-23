const pool = require('../database/pool')

const userRepository = {
    findByEmail: async (email) => {
        const query = 'SELECT * FROM users WHERE email = $1'
        const { rows } = await pool.query(query, [email])
        return rows[0]
    },

    findAll: async () => {
        const query = 'SELECT * FROM users'
        const { rows } = await pool.query(query)
        return rows
    },

    create: async (userData) => {
        const query = `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role, created_at
        `

        const { rows } = await pool.query(query, [
            userData.name,
            userData.email,
            userData.passwordHash,
            userData.role
        ])
        return rows[0]
    }
}

module.exports = userRepository