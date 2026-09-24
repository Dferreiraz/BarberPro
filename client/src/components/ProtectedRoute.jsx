import { Navigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function ProtectedRoute({ children }) {
  const { token } = useAuthStore()

  if (!token) {
    // Redireciona para o login se não houver token
    return <Navigate to="/login" replace />
  }

  return children
}