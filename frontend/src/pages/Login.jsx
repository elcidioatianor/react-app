//assets
import bootstrapLogo from '../assets/bootstrap-logo.svg'
import '../assets/css/bootstrap.min.css'
import '../assets/css/signin.css'

//lógica 
import { useState } from 'react'
import useAuth from '../hooks/useAuth'

//5 - Rotas de login e registro
export default function Login() {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
	const [saveLogin, setSaveLogin] = useState('')
    const [error, setError] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
			console.log(saveLogin)
			//adicionar logica de guardar dados de sessao no navegador

            await login({username, password})
            window.location.href = '/'   // redireciona após login
        } catch (err) {
            setError('Credenciais inválidas')
        }
    }

    return (
        <main className="form-signin w-100 m-auto">
		
            <form onSubmit={handleSubmit}>
				<img className="mb-4" src={bootstrapLogo} alt="" width="72" height="57"/>
        		<h1 className="h3 mb-3 fw-normal">Iniciar sessão</h1>

				{error && <div className="alert alert-danger py-3">{error}</div>}

				<div className="form-floating">
                	<input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
					<label htmlFor="username" >Nome de usuário</label>
				</div>

				<div className="form-floating">
                	<input className="form-control" id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					<label htmlFor="password">Senha</label>
				</div>

                <button className="btn btn-primary w-100 py-2 my-3" type="submit">Iniciar sessão</button>
            </form>

        </main>
    )
}

//6 - Configurar router > ../../App. jsx