import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('@BarberPro:token')
  const { user } = useAuthStore()

  // 1. Verifica se está logado
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // 2. Verifica se a role do usuário está na lista de permitidos (Autorização)
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/dashboard" replace /> // Redireciona para o dashboard se não tiver permissão
  }

  return children
}