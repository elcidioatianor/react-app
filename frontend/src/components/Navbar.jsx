import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

import bootstrapLogo from "../assets/bootstrap-logo.svg";

export function Navbar() {
    const { user, logout } = useAuthContext();
    const [imgError, setImgError] = useState(false);

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-lg fixed-top">
            <div className="container-fluid">
                {/* Botão Offcanvas */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#mainOffcanvas"
                    aria-controls="mainOffcanvas"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Logo */}
                <Link className="navbar-brand ms-2" to="/">
                    <img
                        src={bootstrapLogo}
                        width="42"
                        height="32"
                        alt="Bootstrap"
                    />
                </Link>

                {/* Área direita */}
                {user ? (
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
                                    className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center border-0"
                                    style={{
                                        width: "32px",
                                        height: "32px",
                                        fontWeight: "300",
                                    }}
                                >
                                    {/*getInitials(user.name)*/}
                                </div>
                            )}
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end shadow">
                            <li>
                                <Link className="dropdown-item" to="/profile">
                                    Profile
                                </Link>
                            </li>
                            <li>
                                <Link className="dropdown-item" to="/settings">
                                    Settings
                                </Link>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="dropdown-item"
                                    onClick={logout}
                                >
                                    Sair
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <Link
                                className="btn btn-outline-primary"
                                to="/login"
                            >
                                Entrar
                            </Link>
                        </li>
                    </ul>
                )}

                {/* Offcanvas */}
                <div
                    className="offcanvas offcanvas-start offcanvas-lg text-bg-dark"
                    tabIndex="-1"
                    id="mainOffcanvas"
                    aria-labelledby="mainOffcanvasLabel"
                >
                    <div className="offcanvas-header d-lg-none">
                        <h5 className="offcanvas-title" id="mainOffcanvasLabel">
                            Olá, {user.name.split(/\s+/)[0]}
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
            </div>
        </nav>
    );
}
