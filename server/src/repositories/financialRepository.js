const pool = require('../database/pool')

const financialRepository = {
    // Busca faturamento e comissões dos últimos 30 dias, agrupado por dia
    getDailyRevenueAndCommissions: async () => {
        const query = `
            SELECT 
                DATE(a.date) as day,
                SUM(a.total_price) as total_revenue,
                SUM(a.total_price * (b.commission_rate / 100.0)) as total_commission,
                COUNT(a.id) as total_appointments
            FROM appointments a
            JOIN barbers b ON a.barber_id = b.id
            WHERE a.status IN ('confirmed', 'completed')
              AND a.date >= CURRENT_DATE - INTERVAL '30 days'
            GROUP BY DATE(a.date)
            ORDER BY day ASC
        `
        const { rows } = await pool.query(query)
        return rows
    },

    // Busca faturamento total por método de pagamento no mês atual
    getRevenueByPaymentMethod: async () => {
        const query = `
            SELECT 
                COALESCE(payment_method, 'não informado') as payment_method,
                SUM(total_price) as total_amount,
                COUNT(id) as count
            FROM appointments
            WHERE status IN ('confirmed', 'completed')
              AND DATE_TRUNC('month', date) = DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY payment_method
            ORDER BY total_amount DESC
        `
        const { rows } = await pool.query(query)
        return rows
    },

    // Busca comissão individual por barbeiro no mês atual
    getBarberCommissionsCurrentMonth: async () => {
        const query = `
            SELECT 
                u.name as barber_name,
                b.commission_rate,
                COUNT(a.id) as total_appointments,
                SUM(a.total_price) as total_revenue_generated,
                SUM(a.total_price * (b.commission_rate / 100.0)) as total_commission_earned
            FROM appointments a
            JOIN barbers b ON a.barber_id = b.id
            JOIN users u ON b.user_id = u.id
            WHERE a.status IN ('confirmed', 'completed')
              AND DATE_TRUNC('month', a.date) = DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY u.name, b.commission_rate
            ORDER BY total_commission_earned DESC
        `
        const { rows } = await pool.query(query)
        return rows
    }
}

module.exports = financialRepository