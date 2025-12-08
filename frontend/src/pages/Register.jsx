import { useState } from 'react'
import useAuth from '../hooks/useAuth'
 
//5 - Rotas de login e registro
export default function Register() {
    const { register } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await register(username, password)
            setMsg('Usuário criado com sucesso')
        } catch (err) {
            setMsg('Erro ao criar usuário')
        }
    }

    return (
        <div>
            <h2>Register</h2>

            <form onSubmit={handleSubmit}>
                <input placeholder="Username" value={username}
                       onChange={e => setUsername(e.target.value)} />

                <input placeholder="Password" type="password" value={password}
                       onChange={e => setPassword(e.target.value)} />

                <button type="submit">Registrar</button>
            </form>

            {msg && <p>{msg}</p>}
        </div>
    )
}

//6 - Configurar router > ../../App. jsx