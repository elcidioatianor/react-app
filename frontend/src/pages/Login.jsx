import { useState } from 'react'
import useAuth from '../hooks/useAuth'

//5 - Rotas de login e registro
export default function Login() {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await login(username, password)
            window.location.href = '/'   // redireciona após login
        } catch (err) {
            setError('Credenciais inválidas')
        }
    }

    return (
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username}
                       onChange={e => setUsername(e.target.value)} />

                <input placeholder="Password" type="password" value={password}
                       onChange={e => setPassword(e.target.value)} />

                <button type="submit">Entrar</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

//6 - Configurar router > ../../App. jsx