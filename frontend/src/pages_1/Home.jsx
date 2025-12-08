import useAuth from '../hooks/useAuth'

//7 - Pagina protegida
export default function Home() {
    const { user, logout } = useAuth()

    return (
        <div>
            <h1>Bem-vindo, {user?.username}</h1>

            <button onClick={logout}>Sair</button>
        </div>
    )
}