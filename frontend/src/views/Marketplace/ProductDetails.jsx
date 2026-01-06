import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";

export function ProductDetails() {
    const { id } = useParams();
    const api = useApi();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await api.get(`/products`);
                // Since our getAll endpoint returns all, we find the specific one 
                // In a real app we'd have /products/:id
                const found = res.data.find(p => p.id === parseInt(id));
                if (found) {
                    setProduct(found);
                } else {
                    addNotification("Produto não encontrado", "error");
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
                addNotification("Erro ao carregar detalhes", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = (redirect = false) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(item => item.id === product.id);
        const finalPrice = product.price - (product.discount || 0);

        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: finalPrice,
                image: images[0],
                category: product.category,
                quantity: 1
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        addNotification("Adicionado ao carrinho!", "success");
        if (redirect) navigate("/cart");
    };

    if (loading) return (
        <div className="container py-5 text-center" style={{ marginTop: '100px' }}>
            <div className="spinner-border text-primary"></div>
        </div>
    );

    if (!product) return null;

    const images = Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images) : []);

    return (
        <div className="container py-5" style={{ marginTop: "70px" }}>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item active">{product.category || 'Produtos'}</li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <div className="row g-5">
                {/* Coluna Imagens */}
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm overflow-hidden mb-3">
                        <img
                            src={images[selectedImage] || 'https://via.placeholder.com/600x600?text=Sem+Imagem'}
                            className="img-fluid w-100"
                            style={{ height: '500px', objectFit: 'contain' }}
                            alt={product.name}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className="d-flex gap-2 overflow-auto pb-2">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`img-thumbnail p-0 border-${selectedImage === idx ? 'primary' : 'light'}`}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Coluna Info */}
                <div className="col-md-6">
                    <div className="ps-md-4">
                        <small className="text-uppercase text-primary fw-bold tracking-wider">{product.category}</small>
                        <h1 className="fw-bold mb-3">{product.name}</h1>

                        <div className="d-flex align-items-center mb-4">
                            <div className="text-warning me-2">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-half"></i>
                            </div>
                            <small className="text-muted">(4.5 - 12 avaliações)</small>
                        </div>

                        <div className="mb-4">
                            <span className="fs-2 fw-bold text-primary">{(product.price - (product.discount || 0)).toLocaleString()} MT</span>
                            {product.discount > 0 && (
                                <span className="text-decoration-line-through text-muted ms-3 fs-5">{product.price.toLocaleString()} MT</span>
                            )}
                        </div>

                        <div className="bg-light p-3 rounded-3 mb-4">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-shop text-primary me-2"></i>
                                <span className="fw-bold">Vendido por: <Link to={`/store/${product.store?.id}`} className="text-decoration-none">{product.store?.name || 'Vendedor Dubaning'}</Link></span>
                            </div>
                            <div className="d-flex gap-2">
                                <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25">Vendedor Verificado</span>
                                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25">98% Resposta</span>
                            </div>
                        </div>

                        <p className="text-muted mb-4">{product.description || 'Este produto não possui descrição detalhada.'}</p>

                        <div className="d-grid gap-3 mb-5">
                            <button className="btn btn-primary btn-lg" onClick={() => addToCart(true)}>
                                <i className="bi bi-lightning-fill me-2"></i>Comprar Agora
                            </button>
                            <div className="row g-2">
                                <div className="col-6">
                                    <button className="btn btn-outline-success w-100" onClick={() => navigate(`/chat/${product.store?.owner_id || product.store?.ownerId}`)}>
                                        <i className="bi bi-chat-dots me-2"></i>Vendedor
                                    </button>
                                </div>
                                <div className="col-6">
                                    <button className="btn btn-outline-dark w-100" onClick={() => addNotification('Cotação em breve!', 'info')}>
                                        <i className="bi bi-file-earmark-pdf me-2"></i>Solicitar Cotação
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Detalhes de Pagamento */}
                        <div className="border-top pt-4">
                            <h6 className="fw-bold mb-3">Pagamentos Aceites:</h6>
                            <div className="d-flex gap-3 opacity-75">
                                <img src="https://logodownload.org/wp-content/uploads/2021/01/m-pesa-logo-0.png" height="25" alt="M-Pesa" />
                                <span className="fw-bold text-muted">e-Mola</span>
                                <span className="fw-bold text-muted">mKesh</span>
                                <i className="bi bi-cash fs-4" title="Pagamento na entrega"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
