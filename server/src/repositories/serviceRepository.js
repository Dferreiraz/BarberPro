const pool = require('../database/pool')

const serviceRepository = {
    findByName: async (name) => {
        const query = 'SELECT * FROM services WHERE name = $1'
        const { rows } = await pool.query(query, [name])
        return rows[0]
    },

    findById: async (id) => {
        const query = 'SELECT * FROM services WHERE id = $1'
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    findAll: async () => {
        const query = 'SELECT * FROM services WHERE is_active = true ORDER BY name'
        const { rows } = await pool.query(query)
        return rows
    },

    create: async (serviceData) => {
        const query = `
            INSERT INTO services (name, description, price, duration_minutes)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `
        const { rows } = await pool.query(query, [
            serviceData.name,
            serviceData.description,
            serviceData.price,
            serviceData.duration_minutes
        ])
        return rows[0]
    },

    update: async (id, serviceData) => {
        const query = `
            UPDATE services 
            SET name = $1, description = $2, price = $3, duration_minutes = $4, is_active = $5
            WHERE id = $6
            RETURNING *
        `
        const { rows } = await pool.query(query, [
            serviceData.name,
            serviceData.description,
            serviceData.price,
            serviceData.duration_minutes,
            serviceData.is_active !== undefined ? serviceData.is_active : true,
            id
        ])
        return rows[0]
    },

    delete: async (id) => {
        const query = 'DELETE FROM services WHERE id = $1 RETURNING id'
        const { rows } = await pool.query(query, [id])
        return rows[0]
    }
}

module.exports = serviceRepository