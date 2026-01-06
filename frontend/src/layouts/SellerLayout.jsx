import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

export function SellerLayout() {
    const { user, logout } = useAuthContext();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const isActive = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return (
        <div className="container-fluid dark-mode p-0">
            {/* Sidebar */}
            <div className={`sidebar d-lg-block ${isSidebarOpen ? "sidebar-mobile-show" : "d-none"}`}>
                <div className="p-4">
                    {/* Logo & Brand */}
                    <div className="text-center mb-5">
                        <h4 className="text-white fw-bold">DUBANING <span className="text-warning">Seller</span></h4>
                    </div>

                    {/* Navigation */}
                    <nav className="nav flex-column gap-2">
                        <Link to="/seller/dashboard" className={`nav-link py-3 ${isActive("/seller/dashboard")}`}>
                            <i className="bi bi-speedometer2 me-3"></i>
                            <span>Visão Geral</span>
                        </Link>
                        <Link to="/seller/products" className={`nav-link py-3 ${isActive("/seller/products")}`}>
                            <i className="bi bi-box-seam me-3"></i>
                            <span>Produtos</span>
                        </Link>
                        <Link to="/seller/orders" className={`nav-link py-3 ${isActive("/seller/orders")}`}>
                            <i className="bi bi-cart3 me-3"></i>
                            <span>Pedidos</span>
                        </Link>
                        <Link to="/seller/wallet" className={`nav-link py-3 ${isActive("/seller/wallet")}`}>
                            <i className="bi bi-wallet2 me-3"></i>
                            <span>Financeiro</span>
                        </Link>
                        <Link to="/seller/documents" className={`nav-link py-3 ${isActive("/seller/documents")}`}>
                            <i className="bi bi-file-earmark-text me-3"></i>
                            <span>Documentos</span>
                        </Link>
                        <Link to="/seller/settings" className={`nav-link py-3 ${isActive("/seller/settings")}`}>
                            <i className="bi bi-gear me-3"></i>
                            <span>Definições</span>
                        </Link>
                        <button onClick={logout} className="nav-link py-3 text-start border-0 bg-transparent w-100 text-danger">
                            <i className="bi bi-box-arrow-left me-3"></i>
                            <span>Sair</span>
                        </button>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header px-4">
                    <div className="d-flex align-items-center justify-content-between h-100">
                        {/* Mobile menu toggle */}
                        <button
                            className="btn btn-outline-secondary d-lg-none"
                            onClick={toggleSidebar}
                        >
                            <i className="bi bi-list"></i>
                        </button>

                        <div className="d-flex align-items-center ms-auto gap-3">
                            <div className="dropdown">
                                <button className="btn btn-link text-decoration-none dropdown-toggle text-dark" type="button" data-bs-toggle="dropdown">
                                    Olá, {user?.name}
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/profile">Meu Perfil</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li><button className="dropdown-item text-danger" onClick={logout}>Sair</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4">
                    <Outlet />
                </main>
            </div>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay d-lg-none"
                    onClick={() => setIsSidebarOpen(false)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        zIndex: 999
                    }}
                />
            )}
        </div>
    );
}
