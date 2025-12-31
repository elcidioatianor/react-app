import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

import { 
  //Search, 
  PersonCircle, 
  Gear, 
  BoxArrowRight,
  GraphUp
} from '../components/Svg';
export function Navbar() {
    const { user, isAuthenticated, logout } = useAuthContext();
    const [imgError, setImgError] = useState(false);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

	const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.log(err.message)
        }
    };

    return (
        <nav className="navbar navbar-expand-lg fixed-top bg-dark" data-bs-theme='dark'>
            <div className="container-fluid">
                {/* Botão Offcanvas */}
                <button
                    className="navbar-toggler p-0 border-0 mx-0"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mainOffcanvas"
                    aria-controls="mainOffcanvas"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Logo */}
                <Link className="navbar-brand mx-2" to="/">
					{/* ADD LOGO HERE */}
					Nexus
                </Link>

                {/* Offcanvas */}
                <div
                    className="offcanvas offcanvas-start offcanvas-lg text-bg-dark"
                    tabIndex="-1"
                    id="mainOffcanvas"
                    aria-labelledby="mainOffcanvasLabel"
                >
                    <div className="offcanvas-header d-lg-none">
                        <h5 className="offcanvas-title" id="mainOffcanvasLabel">
                            {isAuthenticated? (
								<span>Olá, {user.name.split(/\s+/)[0]}</span>
							):(
								<span>Nexus Pro</span>
							)}
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="offcanvas"
                            aria-label="Close"
                        />
                    </div>

                    <div className="offcanvas-body">
                        <ul className="navbar-nav flex-grow-1">
                            <li className="nav-item">
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        isActive
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink
                                    className="nav-link"
                                    to="/notifications"
                                >
                                    Notifications
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/profile">
                                    Profile
                                </NavLink>
                            </li>

                            <li className="nav-item">
                                <NavLink className="nav-link" to="/accounts">
                                    Switch account
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Área direita */}
                {isAuthenticated ? (
                    <div className="dropdown ms-auto">
                        <button
                            className="btn p-0 border-0 bg-transparent"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {user.avatarUrl && !imgError ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="Avatar"
                                    onError={() => setImgError(true)}
                                    className="rounded-circle border"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-dark text-white d-flex justify-content-center align-items-center border-1"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        fontWeight: "800",
                                    }}
                                >
                                    {getInitials(user.name)}
                                </div>
                            )}
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow" data-bs-theme='light'>
							 <li className="dropdown-item p-0">
								<div className="container my-0 py-0">
                      		<h6 className="fw-bold">{user.name}</h6>
                      		<small className="text-secondary">{user.email}</small>
								</div>
                    		</li>
							<li>
								<hr className='dropdown-divider'/>
							</li>
							 	<Link className="dropdown-item" to="/profile">
                                     <GraphUp className="me-2" />Dashboard
                                </Link>
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    <PersonCircle className="me-2" />Meu Perfil
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/settings">
                                    <Gear className="me-2" />Configurações
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <button 
                                    type="button"
                                    className="dropdown-item d-flex"
                                    onClick={handleLogout}
                                >
                                    <span className='d-inline-block'>Sair</span><BoxArrowRight className="ms-auto" />
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                     <Link to="/login" className="btn btn-outline-primary border-1 btn-sm ms-auto me-2">
                    	Entrar
                     </Link>
                )}
            </div>
        </nav>
    );
}
    