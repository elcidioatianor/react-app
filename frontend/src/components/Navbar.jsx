import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import {
    PersonCircle,
    Gear,
    BoxArrowRight,
    GraphUp
} from './Svg';



export function Navbar() {
    const { user, isAuthenticated, logout } = useAuthContext();
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const categories = [
        "Eletrónicos", "Moda", "Casa", "Agro", "Serviços", "Saúde", "Veículos", "Outros"
    ];

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        if (selectedCategory !== "all") params.set('category', selectedCategory);
        navigate(`/search?${params.toString()}`);
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

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <header className="sticky-top shadow-sm" style={{ zIndex: 1030 }}>
            {/* Main Navbar */}
            <nav className="bg-nav-main text-white py-2">
                <div className="container-fluid d-flex align-items-center gap-2 gap-md-4">

                    {/* Logo & Mobile Menu Toggle */}
                    <div className="d-flex align-items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="btn btn-link text-white text-decoration-none d-lg-none p-2 border border-transparent hover:border-white"
                        >
                            <i className="bi bi-list fs-2"></i>
                        </button>
                        <Link className="d-flex align-items-center nav-link-border px-2" to="/">
                            <span className="fs-3 fw-bold text-dubaning-orange tracking-tighter">DUBA</span>
                            <span className="fs-3 fw-bold text-white tracking-tighter">NING</span>
                        </Link>
                    </div>

                    {/* Location - Hidden on small mobile */}
                    <div className="d-none d-sm-flex flex-column nav-link-border px-2 text-nowrap">
                        <span className="small text-secondary lh-1 ms-3" style={{ fontSize: '11px' }}>Enviar para</span>
                        <div className="d-flex align-items-center lh-1">
                            <i className="bi bi-geo-alt fs-5 me-1"></i>
                            <span className="fw-bold" style={{ fontSize: '14px' }}>Moçambique</span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form className="flex-grow-1" onSubmit={handleSearch}>
                        <div className="input-group">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="form-select d-none d-lg-block bg-light border-0"
                                style={{ maxWidth: '150px', fontSize: '12px', cursor: 'pointer' }}
                            >
                                <option value="all">Todos</option>
                                {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                            </select>
                            <input
                                type="text"
                                className="form-control border-0"
                                placeholder="Pesquisar na DUBANING"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="btn btn-warning bg-dubaning-orange border-0 text-dark"
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    {/* Account & Orders & Cart */}
                    <div className="d-flex align-items-center gap-1 gap-md-3">

                        {/* Language/Flag */}
                        <div className="d-none d-lg-flex align-items-center nav-link-border">
                            <span className="fw-bold me-1" style={{ fontSize: '14px' }}>PT</span>
                            <i className="bi bi-caret-down-fill text-secondary" style={{ fontSize: '8px' }}></i>
                        </div>

                        {/* Account Links */}
                        {isAuthenticated ? (
                            <div className="position-relative nav-link-border px-2 min-width-120 group-hover-target">
                                <span className="d-block small lh-1" style={{ fontSize: '11px' }}>Olá, {user.name?.split(' ')[0]}</span>
                                <div className="d-flex align-items-center lh-1">
                                    <span className="fw-bold" style={{ fontSize: '14px' }}>Minha Conta</span>
                                    <i className="bi bi-caret-down-fill text-secondary ms-1 mt-1" style={{ fontSize: '8px' }}></i>
                                </div>
                                {/* Dropdown handled via standard Bootstrap usually requires click, keeping hover via custom CSS later if needed or relying on CSS hover logic */}
                            </div>
                        ) : (
                            <Link to="/login" className="nav-link-border px-2 text-white">
                                <span className="d-block small lh-1" style={{ fontSize: '11px' }}>Olá, faça seu login</span>
                                <span className="fw-bold" style={{ fontSize: '14px' }}>Contas e Listas</span>
                            </Link>
                        )}

                        {/* Orders */}
                        <Link to="/orders" className="d-none d-md-flex flex-column nav-link-border px-2 text-white text-nowrap">
                            <span className="small lh-1" style={{ fontSize: '11px' }}>Devoluções</span>
                            <span className="fw-bold lh-1" style={{ fontSize: '14px' }}>e Pedidos</span>
                        </Link>

                        {/* Cart */}
                        <Link to="/cart" className="d-flex align-items-end nav-link-border px-2 text-white position-relative">
                            <div className="position-relative">
                                <i className="bi bi-cart3 fs-2"></i>
                                <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-warning text-dark fw-bold" style={{ fontSize: '10px' }}>
                                    {cartCount}
                                </span>
                            </div>
                            <span className="d-none d-sm-block fw-bold ms-1" style={{ fontSize: '14px', marginBottom: '5px' }}>Carrinho</span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Secondary Navbar */}
            <div className="bg-nav-sub text-white py-1 pl-3 d-flex align-items-center gap-3 overflow-auto text-nowrap">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="btn btn-link text-white text-decoration-none fw-bold d-flex align-items-center gap-1 nav-link-border"
                >
                    <i className="bi bi-list fs-5"></i> Todos
                </button>
                <Link to="/search?promo=flash" className="nav-link-border d-flex align-items-center gap-1 text-white">
                    <i className="bi bi-lightning-fill text-warning"></i> Ofertas do Dia
                </Link>
                <Link to="/stores" className="nav-link-border d-flex align-items-center gap-1 text-white">
                    <i className="bi bi-shop"></i> Lojas em Destaque
                </Link>
                <Link to="/seller/onboarding" className="nav-link-border d-flex align-items-center gap-1 text-white">
                    <i className="bi bi-cash-coin"></i> Vender na DUBANING
                </Link>
                <Link to="/search?category=tecnologia" className="d-none d-md-flex nav-link-border align-items-center gap-1 text-white">
                    <i className="bi bi-laptop"></i> Eletrónicos
                </Link>
                <Link to="/search?category=moda" className="d-none d-md-flex nav-link-border align-items-center gap-1 text-white">
                    <i className="bi bi-bag"></i> Moda
                </Link>
                <Link to="/help" className="nav-link-border d-flex align-items-center gap-1 text-white">
                    <i className="bi bi-headset"></i> Apoio ao Cliente
                </Link>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1040 }}>
                    <div className="d-flex h-100">
                        <div className="bg-white h-100 overflow-auto" style={{ width: '85%', maxWidth: '350px' }}>
                            <div className="bg-nav-sub text-white p-3 d-flex align-items-center gap-2">
                                <i className="bi bi-person-circle fs-2"></i>
                                <span className="fw-bold fs-5">Olá, {isAuthenticated ? user.name?.split(' ')[0] : 'Inicia Sessão'}</span>
                            </div>
                            <div className="p-3">
                                <h5 className="fw-bold mb-2">Comprar por Categoria</h5>
                                <ul className="list-unstyled mb-4">
                                    {categories.map(c => (
                                        <li key={c} className="mb-2">
                                            <Link to={`/search?category=${c.toLowerCase()}`} className="text-dark text-decoration-none" onClick={() => setIsMenuOpen(false)}>
                                                {c} <i className="bi bi-chevron-right float-end text-secondary"></i>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <hr />
                                <h5 className="fw-bold mb-2">Ajuda e Configurações</h5>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><Link to="/profile" className="text-dark text-decoration-none" onClick={() => setIsMenuOpen(false)}>Sua Conta</Link></li>
                                    <li className="mb-2"><Link to="/seller/onboarding" className="text-dubaning-orange fw-bold text-decoration-none" onClick={() => setIsMenuOpen(false)}>Vender na DUBANING</Link></li>
                                    <li className="mb-2"><i className="bi bi-globe me-2"></i> Português</li>
                                    <li className="mb-2"><Link to="/help" className="text-dark text-decoration-none" onClick={() => setIsMenuOpen(false)}>Apoio ao Cliente</Link></li>
                                    {isAuthenticated ? (
                                        <li className="mb-2"><button onClick={handleLogout} className="btn btn-link text-dark text-decoration-none p-0">Sair</button></li>
                                    ) : (
                                        <li className="mb-2"><Link to="/login" className="text-dark fw-bold text-decoration-none" onClick={() => setIsMenuOpen(false)}>Inicia Sessão</Link></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div className="flex-grow-1 bg-dark bg-opacity-75" onClick={() => setIsMenuOpen(false)}>
                            <button className="btn btn-link text-white fs-1 p-4">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
