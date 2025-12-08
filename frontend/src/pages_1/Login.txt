import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/auth/login", {
        username,
        password
      });

      login(res.data.user);      // guarda user no contexto
      navigate("/profile");      // redireciona
    } catch (err) {
      alert("Credenciais inválidas");
    }
  };

  return (
    <form className="card p-4 shadow-sm" onSubmit={handleLogin}>
      <h3 className="mb-3">Login</h3>

      <input
        className="form-control mb-3"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="form-control mb-3"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn btn-primary w-100">Entrar</button>
    </form>
  );
}