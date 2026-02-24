import { useState } from 'react';
import { Link/*, NavLink*/, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useCart } from '../hooks/useCart.js';
//import { PersonCircle, Gear, BoxArrowRight, GraphUp } from './Svg';

export function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartItems } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

    const categories = [
        'Eletrónicos',
        'Moda',
        'Casa',
        'Agro',
        'Serviços',
        'Saúde',
        'Veículos',
        'Outros',
    ];

    const handleSearch = e => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        if (selectedCategory !== 'all')
            params.set('category', selectedCategory);
        navigate(`/search?${params.toString()}`);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <header className="sticky top-0 shadow-sm z-[1030]">
            {/* Main Navbar */}
            <nav className="bg-blue-600 text-white py-2">
                <div className="max-w-7xl mx-auto flex items-center gap-2 md:gap-4 px-4">
                    {/* Logo & Mobile Menu Toggle */}
                    <div className="flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 border border-transparent hover:border-white text-white"
                        >
                            <i className="bi bi-list text-2xl"></i>
                        </button>
                        <Link
                            className="flex items-center px-2 group border-b-2 border-transparent hover:border-white"
                            to="/"
                        >
                            <span className="text-3xl font-bold text-orange-500 tracking-tighter">
                                DUBA
                            </span>
                            <span className="text-3xl font-bold text-white tracking-tighter">
                                NING
                            </span>
                        </Link>
                    </div>

                    {/* Location - Hidden on small mobile */}
                    <div className="hidden sm:flex flex-col px-2 whitespace-nowrap group border-b-2 border-transparent hover:border-white">
                        <span className="text-xs text-gray-300 lh-1 ml-3">
                            Enviar para
                        </span>
                        <div className="flex items-center lh-1">
                            <i className="bi bi-geo-alt text-xl mr-1"></i>
                            <span className="font-bold text-sm">
                                Moçambique
                            </span>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form className="flex-grow" onSubmit={handleSearch}>
                        <div className="flex">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="hidden lg:block bg-gray-100 border-0 max-w-[150px] text-xs cursor-pointer px-2 py-1"
                            >
                                <option value="all">Todos</option>
                                {categories.map((c) => (
                                    <option key={c} value={c.toLowerCase()}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="text"
                                className="flex-1 border-0 px-3 py-1"
                                placeholder="Pesquisar na DUBANING"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="bg-orange-500 border-0 text-black px-3 py-1 hover:bg-orange-600"
                            >
                                <i className="bi bi-search"></i>
                            </button>
                        </div>
                    </form>

                    {/* Account & Orders & Cart */}
                    <div className="flex items-center gap-1 md:gap-3">
                        {/* Language/Flag */}
                        <div className="hidden lg:flex items-center px-2 group border-b-2 border-transparent hover:border-white">
                            <span className="font-bold text-sm mr-1">
                                PT
                            </span>
                            <i className="bi bi-caret-down-fill text-gray-300 text-[8px]"></i>
                        </div>

                        {/* Account Links */}
                        {isAuthenticated ? (
                            <div className="relative px-2 min-w-[120px] group border-b-2 border-transparent hover:border-white">
                                <span className="block text-xs lh-1">
                                    Olá, {user.name?.split(' ')[0]}
                                </span>
                                <Link to='/profile' className="flex items-center lh-1">
                                    <span className="font-bold text-sm">
                                        Minha Conta
                                    </span>
                                    <i className="bi bi-caret-down-fill text-gray-300 ml-1 mt-1 text-[8px]"></i>
                                </Link>
                                {/* Dropdown can be added with Tailwind group-hover */}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="px-2 text-white group border-b-2 border-transparent hover:border-white"
                            >
                                <span className="block text-xs lh-1">
                                    Olá, faça seu login
                                </span>
                                <span className="font-bold text-sm">
                                    Contas e Listas
                                </span>
                            </Link>
                        )}

                        {/* Orders */}
                        <Link
                            to="/orders"
                            className="hidden md:flex flex-col px-2 text-white whitespace-nowrap group border-b-2 border-transparent hover:border-white"
                        >
                            <span className="text-xs lh-1">
                                Devoluções
                            </span>
                            <span className="font-bold text-sm lh-1">
                                e Pedidos
                            </span>
                        </Link>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="flex items-end px-2 text-white relative group border-b-2 border-transparent hover:border-white"
                        >
                            <div className="relative">
                                <i className="bi bi-cart3 text-2xl"></i>
                                <span className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold text-xs rounded-full px-1">
                                    {cartCount}
                                </span>
                            </div>
                            <span className="hidden sm:block font-bold text-sm ml-1 mb-1">
                                Carrinho
                            </span>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Secondary Navbar */}
            <div className="bg-gray-800 text-white py-1 pl-3 flex items-center gap-3 overflow-x-auto whitespace-nowrap">
                <button
                    onClick={() => setIsMenuOpen(true)}
                    className="text-white font-bold flex items-center gap-1 px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-list text-xl"></i> Todos
                </button>
                <Link
                    to="/search?promo=flash"
                    className="flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-lightning-fill text-yellow-400"></i> Ofertas do Dia
                </Link>
                <Link
                    to="/stores"
                    className="flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-shop"></i> Lojas em Destaque
                </Link>
                <Link
                    to="/seller/onboarding"
                    className="flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-cash-coin"></i> Vender na DUBANING
                </Link>
                <Link
                    to="/search?category=tecnologia"
                    className="hidden md:flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-laptop"></i> Eletrónicos
                </Link>
                <Link
                    to="/search?category=moda"
                    className="hidden md:flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-bag"></i> Moda
                </Link>
                <Link
                    to="/help"
                    className="flex items-center gap-1 text-white px-2 group border-b-2 border-transparent hover:border-white"
                >
                    <i className="bi bi-headset"></i> Apoio ao Cliente
                </Link>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-[1040]">
                    <div className="flex h-full">
                        <div className="bg-white h-full overflow-y-auto w-[85%] max-w-[350px]">
                            <div className="bg-gray-800 text-white p-3 flex items-center gap-2">
                                <i className="bi bi-person-circle text-2xl"></i>
                                <span className="font-bold text-xl">
                                    Olá,{' '}
                                    {isAuthenticated
                                        ? user.name?.split(' ')[0]
                                        : 'Inicia Sessão'}
                                </span>
                            </div>
                            <div className="p-3">
                                <h5 className="font-bold mb-2">
                                    Comprar por Categoria
                                </h5>
                                <ul className="list-none mb-4">
                                    {categories.map((c) => (
                                        <li key={c} className="mb-2">
                                            <Link
                                                to={`/search?category=${c.toLowerCase()}`}
                                                className="text-black no-underline"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                {c}{' '}
                                                <i className="bi bi-chevron-right float-right text-gray-500"></i>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <hr />
                                <h5 className="font-bold mb-2">
                                    Ajuda e Configurações
                                </h5>
                                <ul className="list-none">
                                    <li className="mb-2">
                                        <Link
                                            to="/profile"
                                            className="text-black no-underline"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Sua Conta
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            to="/seller/onboarding"
                                            className="text-orange-500 font-bold no-underline"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Vender na DUBANING
                                        </Link>
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-globe mr-2"></i> Português
                                    </li>
                                    <li className="mb-2">
                                        <Link
                                            to="/help"
                                            className="text-black no-underline"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            Apoio ao Cliente
                                        </Link>
                                    </li>
                                    {isAuthenticated ? (
                                        <li className="mb-2">
                                            <button
                                                onClick={handleLogout}
                                                className="text-black no-underline p-0 bg-transparent border-0"
                                            >
                                                Sair
                                            </button>
                                        </li>
                                    ) : (
                                        <li className="mb-2">
                                            <Link
                                                to="/login"
                                                className="text-black font-bold no-underline"
                                                onClick={() => setIsMenuOpen(false)}
                                            >
                                                Inicia Sessão
                                            </Link>
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                        <div
                            className="flex-1 bg-black bg-opacity-75"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <button className="text-white text-4xl p-4">
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
