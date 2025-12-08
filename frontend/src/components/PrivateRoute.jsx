import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth' //custom hook

//4 - Criar rota privada
export default function PrivateRoute({ children }) {
    const { user, loading } = useAuth()

    if (loading) return <p>Carregando...</p>

    return user ? children : <Navigate to="/login" />
}

//5 - Tela de login e registro > ../pages/Login.jsx