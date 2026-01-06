import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    useEffect(() => {
        const updateCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
        };
        updateCount();
        window.addEventListener('cartUpdated', updateCount);
        return () => window.removeEventListener('cartUpdated', updateCount);
    }, []);

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

    //
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
                <Link className="navbar-brand mx-2 fw-bold d-flex align-items-center" to="/" style={{ fontSize: '1.6rem', letterSpacing: '-1px' }}>
                    <span style={{ color: '#FF6000' }}>DUBA</span>
                    <span className="text-white">NING</span>
                </Link>

                {/* Barra de Pesquisa (Desktop) */}
                <form className="d-none d-lg-flex flex-grow-1 mx-4" onSubmit={handleSearch}>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control bg-light border-0"
                            placeholder="Pesquisar produtos, lojas ou serviços..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="btn btn-primary" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </form>

                {/* Offcanvas */}
                <div
                    className="offcanvas offcanvas-start offcanvas-lg text-bg-dark"
                    tabIndex="-1"
                    id="mainOffcanvas"
                    aria-labelledby="mainOffcanvasLabel"
                >
                    <div className="offcanvas-header d-lg-none">
                        <h5 className="offcanvas-title" id="mainOffcanvasLabel">
                            {isAuthenticated && user ? (
                                <span>Olá, {user.name?.split(/\s+/)[0]}</span>
                            ) : (
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
                            {user?.role === 'seller' && (
                                <li className="nav-item">
                                    <NavLink
                                        to="/seller/dashboard"
                                        className={({ isActive }) =>
                                            isActive
                                                ? "nav-link active"
                                                : "nav-link"
                                        }
                                    >
                                        Painel do Vendedor
                                    </NavLink>
                                </li>
                            )}

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
                <div className="d-flex align-items-center ms-auto">
                    {/* Carrinho Icon */}
                    <Link to="/cart" className="btn btn-link position-relative me-2 text-white text-decoration-none p-0">
                        <i className="bi bi-cart3 fs-4"></i>
                        {cartCount > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary" style={{ fontSize: '0.65rem', padding: '0.25em 0.5em' }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="dropdown ms-2">
                            <button
                                className="btn p-0 border-0 bg-transparent"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {user?.avatarUrl && !imgError ? (
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
                                        {getInitials(user?.name)}
                                    </div>
                                )}
                            </button>

                            <ul className="dropdown-menu dropdown-menu-end shadow" data-bs-theme='light'>
                                <li className="dropdown-item p-0">
                                    <div className="container my-0 py-0">
                                        <h6 className="fw-bold">{user?.name}</h6>
                                        <small className="text-secondary">{user?.email}</small>
                                    </div>
                                </li>
                                <li>
                                    <hr className='dropdown-divider' />
                                </li>
                                <Link className="dropdown-item" to={user?.role === 'seller' ? "/seller/dashboard" : "/profile"}>
                                    <GraphUp className="me-2" />{user?.role === 'seller' ? "Painel do Vendedor" : "Minha Conta"}
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
            </div>
        </nav>
    );
}
