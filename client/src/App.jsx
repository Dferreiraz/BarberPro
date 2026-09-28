import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword' 
import ResetPassword from './pages/ResetPassword'   
import Dashboard from './pages/Dashboard'
import ServicesPage from './pages/ServicesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import FinancialDashboard from './pages/FinancialDashboard'
import ProfilePage from './pages/ProfilePage'
import ClientsPage from './pages/ClientsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ Rotas Públicas (Não requerem login) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rotas Protegidas que compartilham o mesmo Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />

          {/* Serviços, Financeiro, Perfil e Clientes: APENAS barbeiro e admin */}
          <Route
            path="services"
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <ServicesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="financial"
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <FinancialDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="clients"
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <ClientsPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App