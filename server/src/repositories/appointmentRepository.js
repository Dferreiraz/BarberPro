const pool = require('../database/pool')

const appointmentRepository = {
    checkAvailability: async (barberId, date, time) => {
        const query = `
            SELECT id FROM appointments
            WHERE barber_id = $1 AND date = $2 AND time = $3 AND status != 'cancelled'
        `
        const { rows } = await pool.query(query, [barberId, date, time])
        return rows.length > 0
    },

    create: async (appointmentData) => {
        const query = `
            INSERT INTO appointments (client_id, barber_id, service_id, date, time, total_price, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, client_id, barber_id, service_id, date, time, status, total_price, notes, created_at
        `
        const { rows } = await pool.query(query, [
            appointmentData.clientId,
            appointmentData.barberId,
            appointmentData.serviceId,
            appointmentData.date,
            appointmentData.time,
            appointmentData.totalPrice,
            appointmentData.notes || null
        ])
        return rows[0]
    },

    findByIdWithDetails: async (id) => {
        const query = `
            SELECT a.id, a.date, a.time, a.status, a.total_price, a.notes, a.payment_method,
                u.name AS client_name, u.phone AS client_phone,
                b_user.name AS barber_name, b_user.phone AS barber_phone,
                s.name AS service_name
            FROM appointments a
            JOIN users u ON a.client_id = u.id
            JOIN barbers b ON a.barber_id = b.id
            JOIN users b_user ON b.user_id = b_user.id
            JOIN services s ON a.service_id = s.id
            WHERE a.id = $1
        `
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    findAll: async () => {
        const query = `
            SELECT a.id, a.date, a.time, a.status, a.total_price, a.payment_method,
                u.name AS client_name, b_user.name AS barber_name, s.name AS service_name
            FROM appointments a
            JOIN users u ON a.client_id = u.id
            JOIN barbers b ON a.barber_id = b.id
            JOIN users b_user ON b.user_id = b_user.id
            JOIN services s ON a.service_id = s.id
            ORDER BY a.date DESC, a.time DESC
        `
        const { rows } = await pool.query(query)
        return rows
    },

    updateStatus: async (id, status, paymentMethod = null) => {
        let query = 'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP'
        let params = [status, id]

        if (paymentMethod && (status === 'confirmed' || status === 'completed')) {
            query = 'UPDATE appointments SET status = $1, payment_method = $2, updated_at = CURRENT_TIMESTAMP'
            params = [status, paymentMethod, id]
        }

        query += ' WHERE id = $' + params.length + ' RETURNING *'
        const { rows } = await pool.query(query, params)
        return rows[0]
    },

    cancel: async (id) => {
        const query = `
            UPDATE appointments 
            SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND status NOT IN ('completed', 'cancelled')
            RETURNING *
        `
        const { rows } = await pool.query(query, [id])
        return rows[0]
    },

    update: async (id, appointmentData) => {
        const query = `
            UPDATE appointments 
            SET date = $1, time = $2, notes = $3, updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 AND status NOT IN ('completed', 'cancelled')
            RETURNING *
        `
        const { rows } = await pool.query(query, [
            appointmentData.date,
            appointmentData.time,
            appointmentData.notes || null,
            id
        ])
        return rows[0]
    }
}

module.exports = appointmentRepository