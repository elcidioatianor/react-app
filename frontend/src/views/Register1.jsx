//assets
import bootstrapLogo from "../assets/bootstrap-logo.svg";
import "../assets/css/signin.css";

//
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import useAuth from "../hooks/useAuth";

//5 - Rotas de login e registro
export default function Register() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const loadingToast = toast.loading("A criar conta...");

        try {
            let ok = await register(formData);
            //Normalmente, mostrar um diálogo
            //com botao para continuar após sucesso,
            //e a função de redirecionamento deve acionar
            //apos o clique
            //setMsg('Usuário criado com sucesso')
            toast.dismiss(loadingToast);
            if (!ok) {
                toast.loading("Erro ao cadastrar usuário");
                setMessage("Erro no cadastro. Tente novamente");
            }

            toast.loading("Conta criada! Faça login.");
            //Adicionar logica de lembrar dados digitados mesmo após refrescar a página
            //redirecionar para home
            return navigate("/");
        } catch (err) {
            toast.dismiss(loadingToast);
            console.error(err);
            setMessage("Erro ao criar usuário"); //mais detalhes
            toast.error(err.response?.data?.message || "Erro ao registrar");
        }
    };

    return (
        <main className="form-signin w-100 m-auto">
            <form onSubmit={handleSubmit}>
                <img
                    className="mb-4"
                    src={bootstrapLogo}
                    alt=""
                    width="72"
                    height="57"
                />
                <h1 className="h3 mb-2 fw-normal">Cadastrar-se</h1>

                <p className="text-secondary" style={{ fontSize: "13px" }}>
                    Preencha os campos abaixo com os dados de acesso que
                    pretende usar
                </p>

                {message && (
                    <div className="alert alert-primary py-3">{message}</div>
                )}

                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control"
                        id="username"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="username">Nome de usuário</label>
                </div>

                <div className="form-floating">
                    <input
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Senha</label>
                </div>

                <button
                    className="btn btn-primary w-100 py-2 mt-3"
                    type="submit"
                >
                    Cadastrar-se
                </button>
            </form>
        </main>
    );
}

//6 - Configurar router > ../../App. jsx
