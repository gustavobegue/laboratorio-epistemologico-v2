import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'

import { useAuth } from './hooks/useAuth'
import { useAuthStore } from './stores/authStore'
import { AuthPage } from './pages/AuthPage'
import { HomePage } from './pages/HomePage'
import { LaboratorioPage } from './pages/LaboratorioPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, cargando } = useAuthStore()
  const location = useLocation()

  if (cargando) {
    return (
      <div className="min-h-screen bg-crema flex items-center justify-center">
        <p className="text-pizarra text-sm animate-pulse">Cargando…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  useAuth()

  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route path="/lab/:labId" element={<LaboratorioPage />} />
    </Routes>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
