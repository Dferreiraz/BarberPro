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
    }
}

module.exports = barberRepository