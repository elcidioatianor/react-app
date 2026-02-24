import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { xhr } from '../../services/api';
//import { useNotification } from '../../hooks/useNotification';

function Home() {
    //const api = useApi();
    const navigate = useNavigate();
    //const { showNotification } = useNotification();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [index, setIndex] = useState(0);
    /*
    const handleSelect = selectedIndex => {
        setIndex(selectedIndex);
    };
    */
    const cities = [
        'Maputo',
        'Beira',
        'Nampula',
        'Quelimane',
        'Tete',
        'Chimoio',
        'Pemba',
        'Nacala',
        'Lichinga',
        'Maxixe',
    ];

    const categories = [
        {
            name: 'Tecnologia',
            icon: 'bi-laptop',
            emoji: '💻',
            color: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
        },
        {
            name: 'Moda',
            icon: 'bi-bag',
            emoji: '👗',
            color: 'linear-gradient(135deg, #e83e8c 0%, #c2185b 100%)',
        },
        {
            name: 'Casa',
            icon: 'bi-house',
            emoji: '🏠',
            color: 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)',
        },
        {
            name: 'Agro',
            icon: 'bi-tree',
            emoji: '🌾',
            color: 'linear-gradient(135deg, #ffc107 0%, #d39e00 100%)',
        },
        {
            name: 'Serviços',
            icon: 'bi-gear',
            emoji: '⚙️',
            color: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)',
        },
        {
            name: 'Saúde',
            icon: 'bi-heart-pulse',
            emoji: '💊',
            color: 'linear-gradient(135deg, #dc3545 0%, #bd2130 100%)',
        },
        {
            name: 'Veículos',
            icon: 'bi-car-front',
            emoji: '🚗',
            color: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)',
        },
        {
            name: 'Outros',
            icon: 'bi-grid',
            emoji: '📦',
            color: 'linear-gradient(135deg, #17a2b8 0%, #117a8b 100%)',
        },
    ];

    const featuredStores = [
        {
            id: 1,
            name: 'TechMoz',
            emoji: '💻',
            rating: 4.8,
            products: 156,
            verified: true,
        },
        {
            id: 2,
            name: 'ModaAfrika',
            emoji: '👜',
            rating: 4.6,
            products: 89,
            verified: true,
        },
        {
            id: 3,
            name: 'AgroMoz',
            emoji: '🌺',
            rating: 4.9,
            products: 234,
            verified: true,
        },
        {
            id: 4,
            name: 'CasaBela',
            emoji: '💡',
            rating: 4.5,
            products: 67,
            verified: false,
        },
        {
            id: 5,
            name: 'AutoPeças MZ',
            emoji: '🔧',
            rating: 4.7,
            products: 198,
            verified: true,
        },
    ];

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const res = await xhr.get('/products');
                let data = [];
                try {
                    data = await res.json();
                } catch (e) {
                    console.error('Invalid JSON response', e);
                }

                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('API returned non-array:', data);
                    setProducts([]);
                }
                setLoading(false);
            } catch (error) {
                console.error('Erro ao carregar produtos', error);
                setProducts([]);
                setLoading(false);
            }
        };

        loading && loadProducts();
    }, [loading, setLoading]);

    const handleSearch = e => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        if (selectedCity) params.set('city', selectedCity);
        navigate(`/search?${params.toString()}`);
    };
    /*
    const addToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price - (product.discount || 0),
                image: product.images?.[0],
                category: product.category,
                quantity: 1,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        showNotification('Adicionado ao carrinho!', 'success');
    };
    */
    return (
        <div className='bg-gray-50 min-h-screen font-sans pb-5'>
            {/* Hero Section */}
            <div className='relative bg-gray-900 overflow-hidden' style={{ height: '450px' }}>
                <div className='relative h-full'>
                    {/* Carousel Item 1 */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${index === 0 ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            className='w-full h-full object-cover'
                            src='/images/banners/black-friday.png'
                            alt='Black Dubaning'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center'>
                            <div className='container mx-auto px-4'>
                                <div className='max-w-lg text-white'>
                                    <h1 className='text-5xl font-bold mb-4'>
                                        BLACK DUBANING
                                    </h1>
                                    <p className='text-xl mb-6'>
                                        Descontos de até{' '}
                                        <span className='text-yellow-400 font-bold'>
                                            70%
                                        </span>{' '}
                                        em Tecnologia e Moda.
                                    </p>
                                    <a
                                        href='#promocoes'
                                        className='inline-block bg-yellow-400 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition-colors'
                                    >
                                        Ver Ofertas
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Item 2 */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${index === 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            className='w-full h-full object-cover'
                            src='/images/banners/agro.png'
                            alt='Agro Moz'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center'>
                            <div className='container mx-auto px-4'>
                                <div className='max-w-lg text-white'>
                                    <h1 className='text-5xl font-bold mb-4 text-green-400'>
                                        Fresco do Campo
                                    </h1>
                                    <p className='text-xl mb-6'>
                                        Diretamente dos produtores para a sua mesa.
                                    </p>
                                    <a
                                        href='#agro'
                                        className='inline-block bg-green-500 text-white px-8 py-3 rounded-full font-bold hover:bg-green-400 transition-colors'
                                    >
                                        Comprar Agora
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Item 3 */}
                    <div className={`absolute inset-0 transition-opacity duration-500 ${index === 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <img
                            className='w-full h-full object-cover'
                            src='/images/banners/tech.png'
                            alt='Tech Promo'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-40 flex items-center'>
                            <div className='container mx-auto px-4'>
                                <div className='max-w-lg text-white'>
                                    <h1 className='text-5xl font-bold mb-4 text-blue-400'>
                                        Tecnologia de Ponta
                                    </h1>
                                    <p className='text-xl mb-6'>
                                        Os últimos lançamentos em um só lugar.
                                    </p>
                                    <a
                                        href='#tech'
                                        className='inline-block bg-blue-500 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-400 transition-colors'
                                    >
                                        Explorar
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel Controls */}
                <button
                    className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all'
                    onClick={() => setIndex(index === 0 ? 2 : index - 1)}
                >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                    </svg>
                </button>
                <button
                    className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all'
                    onClick={() => setIndex(index === 2 ? 0 : index + 1)}
                >
                    <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                </button>

                {/* Carousel Indicators */}
                <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                    {[0, 1, 2].map((slideIndex) => (
                        <button
                            key={slideIndex}
                            className={`w-3 h-3 rounded-full transition-all ${
                                index === slideIndex ? 'bg-white' : 'bg-white bg-opacity-50'
                            }`}
                            onClick={() => setIndex(slideIndex)}
                        />
                    ))}
                </div>

                {/* Overlaid Search Bar */}
                <div className='absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-4xl px-4'>
                    <div className='bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-lg p-2'>
                        <form onSubmit={handleSearch} className='flex items-center'>
                            <div className='flex items-center px-3'>
                                <svg className='w-5 h-5 text-gray-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                            <input
                                type='text'
                                placeholder='O que você procura?'
                                className='flex-1 bg-transparent border-0 outline-none px-2'
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                            <select
                                className='hidden md:block bg-transparent border-0 border-l border-gray-300 outline-none px-3 max-w-xs'
                                value={selectedCity}
                                onChange={e => setSelectedCity(e.target.value)}
                            >
                                <option value=''>📍 Todas cidades</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            <button
                                type='submit'
                                className='bg-yellow-400 text-gray-900 px-6 py-2 rounded-r-lg font-bold hover:bg-yellow-300 transition-colors'
                            >
                                Buscar
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Campaign Banner Strip */}
            <div className='bg-gray-900 text-white py-2 shadow-sm mb-5'>
                <div className='container mx-auto px-4'>
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-3'>
                            <span className='bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium'>
                                🔥 BLACK DUBANING
                            </span>
                            <span className='hidden md:inline'>
                                Até 70% de desconto em milhares de produtos!
                            </span>
                        </div>
                        <Link
                            to='/search?promo=black'
                            className='text-yellow-400 font-bold hover:text-yellow-300 transition-colors'
                        >
                            Ver ofertas →
                        </Link>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-2'>
                {/* Categories */}
                <div className='mb-5'>
                    <h2 className='font-bold text-2xl mb-4'>Explorar categorias</h2>
                    <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3'>
                        {categories.map(cat => (
                            <Link
                                key={cat.name}
                                to={`/search?category=${cat.name.toLowerCase()}`}
                                className='text-decoration-none text-dark block text-center hover:transform hover:scale-105 transition-transform p-3 rounded-lg bg-white border border-gray-200 hover:shadow-md'
                            >
                                <div
                                    className='w-12 h-12 rounded-full flex items-center justify-center text-xl mx-auto mb-2'
                                    style={{ background: cat.color }}
                                >
                                    {cat.emoji}
                                </div>
                                <span className='font-semibold text-sm'>
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Daily Highlights */}
                <div className='mb-5 bg-white p-4 rounded-lg shadow-sm border border-gray-200'>
                    <div className='flex justify-between items-center mb-4'>
                        <div className='flex items-center gap-3'>
                            <h2 className='font-bold text-xl m-0 text-gray-900'>
                                ⚡ Destaques do dia
                            </h2>
                            <span className='bg-red-100 text-red-600 border border-red-300 px-3 py-1 rounded-full text-sm'>
                                ⏰ Termina em 05:22:15
                            </span>
                        </div>
                        <Link
                            to='/search?highlight=true'
                            className='text-yellow-600 font-bold hover:text-yellow-500 transition-colors'
                        >
                            Ver todos →
                        </Link>
                    </div>

                    <div className='flex overflow-x-auto scrollbar-hide gap-4 pb-2'>
                        {products.length === 0 && !loading && (
                            <div className='flex-shrink-0 w-full text-center py-5 text-gray-500'>
                                <svg className='w-12 h-12 mx-auto mb-2 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' />
                                </svg>
                                <p>Carregando produtos...</p>
                            </div>
                        )}
                        {products.map(product => (
                            <div
                                key={product.id}
                                className='flex-shrink-0 w-48'
                            >
                                <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200'>
                                    <div className='relative h-48'>
                                        <img
                                            className='w-full h-full object-cover'
                                            src={
                                                product.images?.[0] ||
                                                'https://via.placeholder.com/300x300?text=No+Image'
                                            }
                                            alt={product.name}
                                        />
                                        {product.discount > 0 && (
                                            <span className='absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium'>
                                                -{Math.round((product.discount / product.price) * 100)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className='p-3'>
                                        <small className='text-gray-500 uppercase text-xs'>
                                            {product.category || 'Geral'}
                                        </small>
                                        <h3 className='text-sm font-bold text-gray-900 truncate mb-2' title={product.name}>
                                            {product.name}
                                        </h3>
                                        <div className='flex items-baseline gap-2'>
                                            <span className='text-red-600 font-bold text-lg'>
                                                {(product.price - (product.discount || 0)).toLocaleString()} MT
                                            </span>
                                            {product.discount > 0 && (
                                                <small className='text-gray-500 line-through text-sm'>
                                                    {product.price.toLocaleString()} MT
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className='absolute inset-0'
                                    ></Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Featured Stores */}
                <div className='mb-5'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='font-bold text-xl'>🏪 Lojas em destaque</h2>
                        <Link
                            to='/stores'
                            className='text-yellow-600 font-bold hover:text-yellow-500 transition-colors'
                        >
                            Ver todas →
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
                        {featuredStores.map(store => (
                            <div key={store.id} className='relative'>
                                <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center border border-gray-200'>
                                    <div className='w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-2xl mx-auto mb-3'>
                                        {store.emoji}
                                    </div>
                                    <h6 className='font-bold mb-1'>
                                        {store.name}
                                    </h6>
                                    <div className='text-yellow-500 mb-2 text-sm flex items-center justify-center'>
                                        <svg className='w-4 h-4 mr-1' fill='currentColor' viewBox='0 0 20 20'>
                                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                        </svg>
                                        {store.rating}
                                        {store.verified && (
                                            <svg
                                                className='w-4 h-4 ml-1 text-blue-500'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                                title='Verificado'
                                            >
                                                <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd' />
                                            </svg>
                                        )}
                                    </div>
                                    <small className='text-gray-500'>
                                        {store.products} produtos
                                    </small>
                                </div>
                                <Link
                                    to={`/store/${store.id}`}
                                    className='absolute inset-0'
                                ></Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seller CTA Banner */}
                <div className='bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg overflow-hidden mb-5 text-white shadow-lg relative'>
                    <div className='absolute inset-0 bg-black bg-opacity-20'></div>
                    <div className='relative p-6 md:flex md:justify-between md:items-center'>
                        <div className='mb-4 md:mb-0'>
                            <h2 className='font-bold text-3xl mb-2'>
                                Tem algo para vender?
                            </h2>
                            <p className='text-xl opacity-90 mb-4 md:mb-0'>
                                Registe-se gratuitamente e comece a vender para milhares de clientes.
                            </p>
                        </div>
                        <Link
                            to='/seller/onboarding'
                            className='inline-block bg-white text-yellow-600 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition-colors'
                        >
                            Criar Minha Loja Grátis
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className='bg-gray-900 text-gray-400 py-5 mt-auto'>
                <div className='container mx-auto px-4'>
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                        <div>
                            <h5 className='text-white font-bold mb-3'>
                                🧭 DUBANING
                            </h5>
                            <ul className='list-none space-y-2'>
                                <li>
                                    <Link
                                        to='/about'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Sobre a DUBANING
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/how-it-works'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Como funciona
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/terms'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Termos & Condições
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/privacy'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Política de Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className='text-white font-bold mb-3'>
                                🛍️ Compradores
                            </h5>
                            <ul className='list-none space-y-2'>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Como comprar
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Pagamentos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Entregas
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className='text-white font-bold mb-3'>
                                🏪 Vendedores
                            </h5>
                            <ul className='list-none space-y-2'>
                                <li>
                                    <Link
                                        to='/seller/onboarding'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Vender na DUBANING
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/seller/login'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Login Vendedor
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/fees'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Comissões
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h5 className='text-white font-bold mb-3'>
                                📞 Suporte
                            </h5>
                            <ul className='list-none space-y-2'>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Central de ajuda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/contact'
                                        className='text-gray-400 hover:text-white transition-colors'
                                    >
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <hr className='border-gray-600 my-6' />
                    <div className='flex flex-col md:flex-row justify-between items-center'>
                        <small>
                            © 2026 DUBANING. Todos os direitos reservados.
                        </small>
                        <div className='flex gap-2 mt-3 md:mt-0'>
                            <span className='bg-gray-600 text-white px-3 py-1 rounded text-sm'>M-Pesa</span>
                            <span className='bg-gray-600 text-white px-3 py-1 rounded text-sm'>e-Mola</span>
                            <span className='bg-gray-600 text-white px-3 py-1 rounded text-sm'>mKesh</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
