// Exemplo 1: Hook useFetch
import {useState} from 'react'
import { useApi, useFetch } from "../hooks/useApi";

function UserList() {
    const { data: users, loading, error } = useFetch("/users");

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error.message}</div>;

    return (
		<>
			<h1>Lista de usuários</h1>
        <ul>
            {users?.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
		</>
    );
}

// Exemplo 2: Hook useApi para operações
function CreateUser() {
    const [name, setName] = useState("");
    const { post, loading, error } = useApi();

    const handleSubmit = async () => {
        try {
            await post("/users", { name });
            alert("Usuário criado!");
            setName("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
            />
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Criando..." : "Criar"}
            </button>
            {error && <div className="error">{error.message}</div>}
        </div>
    );
}

export function Dashboard() {
    return (
        <>
            <CreateUser />
            <UserList />
        </>
    );
}
