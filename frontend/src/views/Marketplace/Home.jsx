import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";

export function Home() {
    const api = useApi();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data || []);
        } catch (error) {
            console.error("Erro ao carregar produtos", error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { name: "Tecnologia", icon: "bi-laptop", color: "primary" },
        { name: "Moda", icon: "bi-bag", color: "danger" },
        { name: "Casa", icon: "bi-house", color: "success" },
        { name: "Agro", icon: "bi-tree", color: "warning" },
        { name: "Serviços", icon: "bi-gear", color: "info" }
    ];

    return (
        <div className="home-container" style={{ marginTop: "60px" }}>
            {/* Hero Section */}
            <div className="text-white py-5 mb-5" style={{ background: 'linear-gradient(135deg, #FF6000 0%, #FF8c00 100%)' }}>
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-md-7">
                            <h1 className="display-3 fw-bold mb-3 shadow-text">O Mercado na <span style={{ color: '#000' }}>sua mão.</span></h1>
                            <p className="lead mb-4 fw-bold">Descubra milhares de produtos e serviços em Moçambique com entrega rápida e pagamento seguro via M-Pesa.</p>
                            <div className="d-flex gap-3 mt-4">
                                <a href="#produtos" className="btn btn-dark btn-lg px-5 fw-bold">Comprar Já</a>
                                <Link to="/seller/onboarding" className="btn btn-outline-light btn-lg px-4 border-2 fw-bold">Vender na DUBANING</Link>
                            </div>
                        </div>
                        <div className="col-md-5 text-center d-none d-md-block">
                            <div className="position-relative">
                                <div className="bg-white p-2 rounded-4 shadow-lg rotate-3">
                                    <img
                                        src="/images/hero.png"
                                        className="img-fluid rounded-3"
                                        alt="DUBANING Marketplace"
                                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="position-absolute top-0 start-0 bg-primary text-white px-3 py-1 rounded-pill shadow-sm" style={{ transform: 'translate(-20%, -20%) rotate(-10deg)' }}>
                                    <span className="fw-bold fs-5">100% Moçambicano</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container">
                {/* Categories */}
                <div className="mb-5">
                    <h3 className="fw-bold mb-4">Categorias</h3>
                    <div className="d-flex gap-3 overflow-auto pb-3">
                        {categories.map((cat, index) => (
                            <div key={index} className="card border-0 shadow-sm text-center min-width-card" style={{ minWidth: 120, cursor: 'pointer' }}>
                                <div className="card-body p-3">
                                    <div className={`bg-${cat.color} bg-opacity-10 text-${cat.color} rounded-circle d-inline-flex align-items-center justify-content-center mb-2`} style={{ width: 50, height: 50 }}>
                                        <i className={`bi ${cat.icon} fs-4`}></i>
                                    </div>
                                    <h6 className="mb-0 fw-bold">{cat.name}</h6>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                <div id="produtos" className="mb-5">
                    <div className="d-flex justify-content-between align-items-end mb-4">
                        <h3 className="fw-bold mb-0">Novidades</h3>
                        <a href="#" className="text-decoration-none">Ver tudo</a>
                    </div>

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary"></div>
                        </div>
                    ) : (!products || products.length === 0) ? (
                        <div className="text-center py-5">
                            <i className="bi bi-box-seam display-4 text-muted mb-3"></i>
                            <p className="text-muted">Nenhum produto encontrado. Seja o primeiro a vender!</p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                            {products.map(product => (
                                <div className="col" key={product.id}>
                                    <Link to={`/product/${product.id}`} className="text-decoration-none">
                                        <div className="card h-100 border-0 shadow-sm product-card">
                                            <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        className="card-img-top h-100 object-fit-cover"
                                                        alt={product.name}
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Sem+Imagem' }}
                                                    />
                                                ) : (
                                                    <div className="d-flex align-items-center justify-content-center h-100 bg-light text-muted">
                                                        <i className="bi bi-image fs-1"></i>
                                                    </div>
                                                )}
                                                {product.discount > 0 && (
                                                    <span className="position-absolute top-0 start-0 badge bg-danger m-2">
                                                        -{Math.round((product.discount / product.price) * 100)}%
                                                    </span>
                                                )}
                                            </div>
                                            <div className="card-body d-flex flex-column text-dark">
                                                <small className="text-muted mb-1">{product.category || 'Geral'}</small>
                                                <h5 className="card-title fw-bold text-truncate">{product.name}</h5>
                                                <div className="mt-auto">
                                                    <div className="d-flex align-items-center gap-2 mb-2">
                                                        <span className="fw-bold fs-5 text-primary">{product.price - (product.discount || 0)} MT</span>
                                                        {product.discount > 0 && (
                                                            <span className="text-decoration-line-through text-muted small">{product.price} MT</span>
                                                        )}
                                                    </div>
                                                    <button className="btn btn-outline-primary w-100 rounded-pill" onClick={(e) => {
                                                        e.preventDefault();
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
                                                                quantity: 1
                                                            });
                                                        }
                                                        localStorage.setItem('cart', JSON.stringify(cart));
                                                        window.dispatchEvent(new Event('cartUpdated'));
                                                        addNotification("Adicionado ao carrinho!", "success");
                                                    }}>
                                                        <i className="bi bi-cart-plus me-2"></i> Adicionar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
                .product-card { transition: transform 0.2s; }
                .product-card:hover { transform: translateY(-5px); }
            `}</style>
        </div>
    );
}

export default Home;