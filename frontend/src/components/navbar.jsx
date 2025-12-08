import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand bg-lignt rounded">
      <div className="container">
        <Link className="navbar-brand" to="/">Aplicação</Link>

        <ul className="navbar-nav ms-auto">
 
          {!user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" style={{fontSize: "13px"}} to="/">Entrar</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" style={{fontSize: "13px"}} to="/register">Cadastro</Link>
              </li>
            </>
          )}

          {user && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">
                  {user.username}
                </Link>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger btn-sm ms-3" onClick={logout}>
                  Sair
                </button>
              </li>
            </>
          )}

        </ul>
      </div>
    </nav>
  );
}