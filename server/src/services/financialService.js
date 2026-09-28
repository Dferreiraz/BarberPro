const financialRepository = require('../repositories/financialRepository')

const financialService = {
    getDashboardData: async () => {
        const [dailyData, paymentMethods, barberCommissions] = await Promise.all([
            financialRepository.getDailyRevenueAndCommissions(),
            financialRepository.getRevenueByPaymentMethod(),
            financialRepository.getBarberCommissionsCurrentMonth()
        ])

        // Cálculo de totais gerais para os cards do dashboard
        const totalRevenueMonth = dailyData.reduce((sum, item) => sum + parseFloat(item.total_revenue), 0)
        const totalCommissionMonth = dailyData.reduce((sum, item) => sum + parseFloat(item.total_commission), 0)
        const totalAppointmentsMonth = dailyData.reduce((sum, item) => sum + parseInt(item.total_appointments), 0)

        return {
            summary: {
                totalRevenueMonth: parseFloat(totalRevenueMonth.toFixed(2)),
                totalCommissionMonth: parseFloat(totalCommissionMonth.toFixed(2)),
                totalAppointmentsMonth
            },
            dailyTrend: dailyData,
            paymentMethods,
            barberCommissions
        }
    }
}

module.exports = financialService