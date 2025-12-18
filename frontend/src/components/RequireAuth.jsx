import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

export default function RequireAuth() {
	//Verificar o user que vem do AuthContext
	const { user } = useAuth()
	const location = useLocation()
  // Se não estiver logado (usuário nãoexistir), redireciona para /login
  if (!user) {
	//Armazenar url actual antes de redirecionar 
	//const stateFrom = location.pathname + location.search;
	//para persistência (ter o url mesmo após F5 or page refresh)
	//precisamos ter uma forma de obté-lo
	//localStorage.setItem('stateFrom', stateFrom);
	
	//Se o usuário acessar /profile sem login 
	//será redirecionado para /login com state: {from: "/profile" }
	//(altera ou define location.state.from)
    return <Navigate to="/login" replace state={{ from: location }}/>
	//replace evita voltar ao redirect com botao voltar
	/***
	 * Isso permite escrever no Login.jsx
	 * let location = useLocation()
	 * let from = location.state?.from?.pathname || "/" 
	 *
	 * O código permite ao usuário retornar para a página 
	 * de origem
	 */
  }

  // Se estiver logado, renderiza o Outlet 
	//(que representa os componentes filhos da rota protegida)
  return <Outlet />
}
