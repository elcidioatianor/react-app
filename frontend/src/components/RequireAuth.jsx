// src/components/RequireAuth.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingOverlay } from './LoadingOverlay';
import { useAuth } from '../hooks/useAuth.js';

export default function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingOverlay isLoading message="Verificando acesso..." />;
  }

  if (!isAuthenticated) {
    // Redireciona para login, mantendo a rota de origem no state
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Renderiza rotas filhas protegidas
  return <Outlet />;
}