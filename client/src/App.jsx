import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ServicesPage from './pages/ServicesPage'
import AppointmentsPage from './pages/AppointmentsPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
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
          
          {/* Serviços e Clientes: APENAS barbeiro e admin */}
          <Route 
            path="services" 
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <ServicesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="clients" 
            element={
              <ProtectedRoute allowedRoles={['barber', 'admin']}>
                <div className="text-center mt-10 text-[var(--color-text)]">Módulo de Clientes em desenvolvimento (Fase 3)</div>
              </ProtectedRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App