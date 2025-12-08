import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

// 3 - Ciar hook para usar o Auth Context 
export default function useAuth() {
    return useContext(AuthContext)
}

//4 - Criar rota privada > ../components/privateRoute.js