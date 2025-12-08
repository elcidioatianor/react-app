//assets
import bootstrapLogo from '../assets/bootstrap-logo.svg'
import '../assets/css/bootstrap.min.css'
import '../assets/css/signin.css'

//
import { useState } from 'react'
import useAuth from '../hooks/useAuth'
 
//5 - Rotas de login e registro
export default function Register() {
    const { register } = useAuth() //acessar hook em authContext
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            await register({username, password})
            setMsg('Usuário criado com sucesso')
        } catch (err) {
            setMsg('Erro ao criar usuário')
        }
    }

    return (
		<main className="form-signin w-100 m-auto">
		
            <form onSubmit={handleSubmit}>
				<img className="mb-4" src={bootstrapLogo} alt="" width="72" height="57"/>
        		<h1 className="h3 mb-2 fw-normal">Olá</h1>
				
				<p class="text-secondary" style={{fontSize: "13px"}}>Preencha os campos abaixo com os dados que pretende usar para acessar</p>

				{msg && <div className="alert alert-primary py-3">{msg}</div>}

				<div className="form-floating">
                	<input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
					<label htmlFor="username" >Nome de usuário</label>
				</div>

				<div className="form-floating">
                	<input className="form-control" id="password" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
					<label htmlFor="password" >Senha</label>
				</div> 

                <button className="btn btn-primary w-100 py-2 mt-3" type="submit">Cadastrar-se</button>
            </form>

        </main>
    )
}

//6 - Configurar router > ../../App. jsx