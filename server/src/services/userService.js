const pool = require('../database/pool')
const userRepository = require('../repositories/userRepository')

const userService = {
    getAllUsers: async () => {
        return await userRepository.findAll()
    },

    getBarbers: async () => {
        const users = await userRepository.findAll()
        return users.filter(user => user.role === 'barber')
    },

    getClients: async () => {
        const users = await userRepository.findAll()
        return users.filter(user => user.role === 'client')
    },

    deleteUser: async (id, currentUserId) => {
        // Proteção: Não permitir que o usuário se exclua por aqui
        if (parseInt(id) === parseInt(currentUserId)) {
            throw new Error('Você não pode excluir sua própria conta pela lista de gerenciamento.')
        }

        // Proteção: Verificar se o cliente possui agendamentos no histórico
        const { rows } = await pool.query('SELECT id FROM appointments WHERE client_id = $1', [id])
        if (rows.length > 0) {
            throw new Error('Não é possível excluir um cliente que possui histórico de agendamentos.')
        }

        // Se estiver tudo certo, exclui o usuário
        const deleted = await userRepository.delete(id)
        if (!deleted) {
            throw new Error('Usuário não encontrado.')
        }
        return deleted
    }
}

module.exports = userService