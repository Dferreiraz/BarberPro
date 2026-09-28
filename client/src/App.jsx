import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Login from './pages/Login'
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
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas que compartilham o mesmo Layout */}
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

          {/* Agendamentos: Todos podem ver, mas a UI será diferente */}
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