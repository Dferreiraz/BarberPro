import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ServicesPage from './pages/ServicesPage'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'

function App() {
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública (sem Layout) */}
        <Route path="/login" element={<Login />} />
        
        {/* Rotas protegidas (com Layout: Sidebar, Header, Footer) */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout /> {/* O Layout contém o <Outlet /> */}
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<ServicesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App