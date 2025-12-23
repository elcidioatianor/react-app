//4 - Criar wrapper para rotas privadas
// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { LoadingOverlay } from "./LoadingOverlay";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
        return (
            <LoadingOverlay isLoading={true} message="Verificando acesso..." />
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

//5 - Tela de login e registro > ../pages/Login.jsx
