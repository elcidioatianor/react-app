import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../contexts/NotificationContext';
import {
    Container,
    Row,
    Col,
    Carousel,
    Card,
    Button,
    Form,
    InputGroup,
} from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

function Home() {
    const api = useApi();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [index, setIndex] = useState(0);

    const handleSelect = selectedIndex => {
        setIndex(selectedIndex);
    };

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
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data || []);
        } catch (error) {
            console.error('Erro ao carregar produtos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = e => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery);
        if (selectedCity) params.set('city', selectedCity);
        navigate(`/search?${params.toString()}`);
    };

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
        addNotification('Adicionado ao carrinho!', 'success');
    };

    return (
        <div className='bg-light min-vh-100 font-sans pb-5'>
            {/* Hero Section */}
            <div
                className='position-relative bg-dark'
                style={{ height: '450px', overflow: 'hidden' }}
            >
                <Carousel
                    activeIndex={index}
                    onSelect={handleSelect}
                    fade
                    controls={false}
                    indicators={false}
                    interval={5000}
                >
                    <Carousel.Item style={{ height: '450px' }}>
                        <img
                            className='d-block w-100 h-100'
                            src='/images/banners/black-friday.png'
                            alt='Black Dubaning'
                            style={{ objectFit: 'cover' }}
                        />
                        <Carousel.Caption className='hero-caption text-start text-white'>
                            <h1 className='display-4 fw-bold mb-2'>
                                BLACK DUBANING
                            </h1>
                            <p className='fs-4 mb-4'>
                                Descontos de até{' '}
                                <span className='text-warning fw-bold'>
                                    70%
                                </span>{' '}
                                em Tecnologia e Moda.
                            </p>
                            <Button
                                href='#promocoes'
                                variant='warning'
                                size='lg'
                                className='rounded-pill px-5 fw-bold text-dark'
                            >
                                Ver Ofertas
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item style={{ height: '450px' }}>
                        <img
                            className='d-block w-100 h-100'
                            src='/images/banners/agro.png'
                            alt='Agro Moz'
                            style={{ objectFit: 'cover' }}
                        />
                        <Carousel.Caption className='hero-caption text-start text-white'>
                            <h1 className='display-4 fw-bold mb-2 text-success'>
                                Fresco do Campo
                            </h1>
                            <p className='fs-4 mb-4'>
                                Diretamente dos produtores para a sua mesa.
                            </p>
                            <Button
                                href='#agro'
                                variant='success'
                                size='lg'
                                className='rounded-pill px-5 fw-bold'
                            >
                                Comprar Agora
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item style={{ height: '450px' }}>
                        <img
                            className='d-block w-100 h-100'
                            src='/images/banners/tech.png'
                            alt='Tech Promo'
                            style={{ objectFit: 'cover' }}
                        />
                        <Carousel.Caption className='hero-caption text-start text-white'>
                            <h1 className='display-4 fw-bold mb-2 text-info'>
                                Tecnologia de Ponta
                            </h1>
                            <p className='fs-4 mb-4'>
                                Os últimos lançamentos em um só lugar.
                            </p>
                            <Button
                                href='#tech'
                                variant='primary'
                                size='lg'
                                className='rounded-pill px-5 fw-bold'
                            >
                                Explorar
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>

                {/* Overlaid Search Bar */}
                <Container
                    className='position-absolute top-0 start-50 translate-middle-x mt-4'
                    style={{ zIndex: 10 }}
                >
                    <Card
                        className='border-0 shadow-lg'
                        style={{
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <Card.Body className='p-2'>
                            <Form onSubmit={handleSearch}>
                                <InputGroup>
                                    <InputGroup.Text className='bg-transparent border-0'>
                                        <i className='bi bi-search'></i>
                                    </InputGroup.Text>
                                    <Form.Control
                                        type='text'
                                        placeholder='O que você procura?'
                                        className='border-0 bg-transparent shadow-none'
                                        value={searchQuery}
                                        onChange={e =>
                                            setSearchQuery(e.target.value)
                                        }
                                    />
                                    <Form.Select
                                        className='border-0 bg-transparent shadow-none d-none d-md-block'
                                        style={{
                                            maxWidth: '200px',
                                            borderLeft: '1px solid #dee2e6',
                                        }}
                                        value={selectedCity}
                                        onChange={e =>
                                            setSelectedCity(e.target.value)
                                        }
                                    >
                                        <option value=''>
                                            📍 Todas cidades
                                        </option>
                                        {cities.map(city => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Button
                                        variant='warning'
                                        type='submit'
                                        className='px-4 fw-bold text-dark rounded-end'
                                    >
                                        Buscar
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>

            {/* Campaign Banner Strip */}
            <div className='bg-dark text-white py-2 shadow-sm mb-5'>
                <Container className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center gap-3'>
                        <span className='badge bg-danger rounded-pill px-3 py-2'>
                            🔥 BLACK DUBANING
                        </span>
                        <span className='d-none d-md-inline'>
                            Até 70% de desconto em milhares de produtos!
                        </span>
                    </div>
                    <Link
                        to='/search?promo=black'
                        className='text-warning fw-bold text-decoration-none'
                    >
                        Ver ofertas <i className='bi bi-arrow-right'></i>
                    </Link>
                </Container>
            </div>

            <Container className='py-2'>
                {/* Categories */}
                <div className='mb-5'>
                    <h2 className='fw-bold mb-4'>Explorar categorias</h2>
                    <Row xs={2} sm={4} lg={8} className='g-3'>
                        {categories.map(cat => (
                            <Col key={cat.name}>
                                <Link
                                    to={`/search?category=${cat.name.toLowerCase()}`}
                                    className='text-decoration-none text-dark d-block text-center hover-lift p-3 rounded-4 bg-white border'
                                >
                                    <div
                                        className='category-circle'
                                        style={{ background: cat.color }}
                                    >
                                        {cat.emoji}
                                    </div>
                                    <span className='fw-semibold small'>
                                        {cat.name}
                                    </span>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Daily Highlights */}
                <div className='mb-5 bg-white p-4 rounded-4 shadow-sm border'>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <div className='d-flex align-items-center gap-3'>
                            <h2 className='fw-bold m-0 text-dark'>
                                ⚡ Destaques do dia
                            </h2>
                            <span className='badge bg-danger-subtle text-danger border border-danger p-2 rounded-pill'>
                                ⏰ Termina em 05:22:15
                            </span>
                        </div>
                        <Link
                            to='/search?highlight=true'
                            className='text-warning fw-bold text-decoration-none'
                        >
                            Ver todos <i className='bi bi-arrow-right'></i>
                        </Link>
                    </div>

                    <Row className='flex-nowrap overflow-auto scrollbar-hide g-4 pb-2'>
                        {products.length === 0 && !loading && (
                            <Col
                                xs={12}
                                className='text-center py-5 text-muted'
                            >
                                <i className='bi bi-box-seam fs-1 mb-2'></i>
                                <p>Carregando produtos...</p>
                            </Col>
                        )}
                        {products.map(product => (
                            <Col
                                xs={6}
                                md={3}
                                lg={2}
                                key={product.id}
                                style={{ minWidth: '200px' }}
                            >
                                <Card className='h-100 border-0 shadow-sm hover-lift overflow-hidden rounded-4'>
                                    <div
                                        className='position-relative'
                                        style={{ height: '200px' }}
                                    >
                                        <Card.Img
                                            variant='top'
                                            src={
                                                product.images?.[0] ||
                                                'https://via.placeholder.com/300x300?text=No+Image'
                                            }
                                            style={{
                                                height: '100%',
                                                objectFit: 'cover',
                                            }}
                                        />
                                        {product.discount > 0 && (
                                            <span className='position-absolute top-0 start-0 m-2 badge bg-danger rounded-pill'>
                                                -
                                                {Math.round(
                                                    (product.discount /
                                                        product.price) *
                                                        100
                                                )}
                                                %
                                            </span>
                                        )}
                                    </div>
                                    <Card.Body className='p-3'>
                                        <small
                                            className='text-muted text-uppercase'
                                            style={{ fontSize: '0.75rem' }}
                                        >
                                            {product.category || 'Geral'}
                                        </small>
                                        <Card.Title
                                            className='fs-6 fw-bold text-dark text-truncate mb-2'
                                            title={product.name}
                                        >
                                            {product.name}
                                        </Card.Title>
                                        <div className='d-flex align-items-baseline gap-2'>
                                            <span className='text-danger fw-bold fs-5'>
                                                {(
                                                    product.price -
                                                    (product.discount || 0)
                                                ).toLocaleString()}{' '}
                                                MT
                                            </span>
                                            {product.discount > 0 && (
                                                <small
                                                    className='text-muted text-decoration-line-through'
                                                    style={{
                                                        fontSize: '0.8rem',
                                                    }}
                                                >
                                                    {product.price.toLocaleString()}{' '}
                                                    MT
                                                </small>
                                            )}
                                        </div>
                                    </Card.Body>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className='stretched-link'
                                    ></Link>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Featured Stores */}
                <div className='mb-5'>
                    <div className='d-flex justify-content-between align-items-center mb-4'>
                        <h2 className='fw-bold mb-0'>🏪 Lojas em destaque</h2>
                        <Link
                            to='/stores'
                            className='text-warning fw-bold text-decoration-none'
                        >
                            Ver todas <i className='bi bi-arrow-right'></i>
                        </Link>
                    </div>
                    <Row xs={2} md={3} lg={5} className='g-3'>
                        {featuredStores.map(store => (
                            <Col key={store.id}>
                                <Card className='h-100 text-center border-0 shadow-sm hover-lift rounded-4 p-3'>
                                    <div
                                        className='category-circle bg-warning bg-gradient mx-auto mb-3'
                                        style={{
                                            width: '64px',
                                            height: '64px',
                                            fontSize: '2rem',
                                        }}
                                    >
                                        {store.emoji}
                                    </div>
                                    <h6 className='fw-bold mb-1'>
                                        {store.name}
                                    </h6>
                                    <div className='text-warning mb-2 small'>
                                        <i className='bi bi-star-fill me-1'></i>
                                        {store.rating}
                                        {store.verified && (
                                            <i
                                                className='bi bi-patch-check-fill text-primary ms-1'
                                                title='Verificado'
                                            ></i>
                                        )}
                                    </div>
                                    <small className='text-muted'>
                                        {store.products} produtos
                                    </small>
                                    {/* Make card clickable */}
                                    <Link
                                        to={`/store/${store.id}`}
                                        className='stretched-link'
                                    ></Link>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Seller CTA Banner */}
                <Card className='border-0 shadow-lg rounded-4 overflow-hidden mb-5 text-white bg-gradient-primary'>
                    <div className='position-absolute w-100 h-100 opacity-25 pattern-bg'></div>
                    <Card.Body className='p-5 position-relative d-md-flex justify-content-between align-items-center'>
                        <div>
                            <h2 className='fw-bold display-6 mb-2'>
                                Tem algo para vender?
                            </h2>
                            <p className='fs-5 opacity-75 mb-4 md-mb-0'>
                                Registe-se gratuitamente e comece a vender para
                                milhares de clientes.
                            </p>
                        </div>
                        <Button
                            as={Link}
                            to='/seller/onboarding'
                            variant='light'
                            size='lg'
                            className='rounded-pill px-5 fw-bold text-warning shadow'
                        >
                            Criar Minha Loja Grátis
                        </Button>
                    </Card.Body>
                </Card>
            </Container>

            {/* Footer */}
            <footer className='bg-dark text-secondary py-5 mt-auto'>
                <Container>
                    <Row className='g-4'>
                        <Col md={3}>
                            <h5 className='text-white fw-bold mb-3'>
                                🧭 DUBANING
                            </h5>
                            <ul className='list-unstyled'>
                                <li>
                                    <Link
                                        to='/about'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Sobre a DUBANING
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/how-it-works'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Como funciona
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/terms'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Termos & Condições
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/privacy'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Política de Privacidade
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h5 className='text-white fw-bold mb-3'>
                                🛍️ Compradores
                            </h5>
                            <ul className='list-unstyled'>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Como comprar
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Pagamentos
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Entregas
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h5 className='text-white fw-bold mb-3'>
                                🏪 Vendedores
                            </h5>
                            <ul className='list-unstyled'>
                                <li>
                                    <Link
                                        to='/seller/onboarding'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Vender na DUBANING
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/seller/login'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Login Vendedor
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/fees'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Comissões
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                        <Col md={3}>
                            <h5 className='text-white fw-bold mb-3'>
                                📞 Suporte
                            </h5>
                            <ul className='list-unstyled'>
                                <li>
                                    <Link
                                        to='/help'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Central de ajuda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to='/contact'
                                        className='text-secondary text-decoration-none hover-white'
                                    >
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                    <hr className='border-secondary my-4' />
                    <div className='d-flex flex-column flex-md-row justify-content-between align-items-center'>
                        <small>
                            © 2026 DUBANING. Todos os direitos reservados.
                        </small>
                        <div className='d-flex gap-2 mt-3 mt-md-0'>
                            <span className='badge bg-secondary'>M-Pesa</span>
                            <span className='badge bg-secondary'>e-Mola</span>
                            <span className='badge bg-secondary'>mKesh</span>
                        </div>
                    </div>
                </Container>
            </footer>
        </div>
    );
}

export default Home;
