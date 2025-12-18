//assets
import bootstrapLogo from '../assets/bootstrap-logo.svg'
import '../assets/css/signin.css'


import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import toast from 'react-hot-toast';

import useAuth from "../hooks/useAuth"

export default function Login() {
	const { login } = useAuth()
	const navigate = useNavigate() //usar redirecionamento
	const location = useLocation() //acessar rota salva em RequireAuth.jsx
	const [message, setMessage] = useState('');
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	//Obter rota original ou "/", para redirecionamento 
	const stateFrom = location.state?.from;
	const storageStateFrom = localStorage.getItem('stateFrom')
	const fromRoute = stateFrom || storageStateFrom || "/"; //fallback to home
	/*
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
	*/
  const handleSubmit = async (e) => {
    e.preventDefault()
	
	//Mostrar toast durante processamento 
	const loadingToast = toast.loading('A autenticar...')

    try { //Melhorar error handling a partir do context até aqui
      const ok = await login({username, password})

		//Apos sucesso, redirecionar para página de origem ou /
		if (!ok) {
			return setMessage('Erro de login, credenciais inválidas?') //...
		}

		//Reportar
		toast.success('Bem-vindo de volta!')
		
		//destruir toast
		toast.dismiss(loadingToast);

		//limpar redirecionamento salvo (boa prática)
		localStorage.removeItem('stateFrom')
		navigate(fromRoute, {replace: true})

    } catch (err) {
      console.error(err) //para inspecionar no console
      setMessage("Credenciais inválidas")
    }
  }

  return (
    <main className="form-signin w-100 m-auto">
		
            <form onSubmit={handleSubmit}>
				<img className="mb-4" src={bootstrapLogo} alt="" width="72" height="57"/>
        		<h1 className="h3 mb-3 fw-normal">Iniciar sessão</h1>

				{message && <div className="alert alert-danger py-3">{message}</div>}

				<div className="form-floating">
                	<input type="text" className="form-control" id="username" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
					<label htmlFor="username" >Nome de usuário</label>
				</div>

				<div className="form-floating">
                	<input className="form-control" id="password" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
					<label htmlFor="password">Senha</label>
				</div>

                <button className="btn btn-primary w-100 py-2 my-3" type="submit">Iniciar sessão</button>
            </form>

        </main>
  )
}

//6 - Configurar router > ../../App. jsx