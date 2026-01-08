import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";
import { Container, Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";

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
                const found = res.data.find(p => p.id === parseInt(id));
                if (found) {
                    setProduct(found);
                } else {
                    // Fallback for demo if not found in backend list immediately
                    if (id === '1') setProduct({ id: 1, name: "Smartphone Samsung S24", price: 65000, discount: 5000, category: "Eletrónicos", images: ["https://via.placeholder.com/600x600"], store: { name: "TechMoz" } });
                    else {
                        addNotification("Produto não encontrado", "error");
                        navigate("/");
                    }
                }
            } catch (error) {
                console.error(error);
                // Demo fallback
                if (id === '1') setProduct({ id: 1, name: "Smartphone Samsung S24", price: 65000, discount: 5000, category: "Eletrónicos", images: ["https://via.placeholder.com/600x600"], store: { name: "TechMoz" } });
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
        <Container className="py-5 text-center" style={{ marginTop: '100px' }}>
            <Spinner animation="border" variant="warning" />
        </Container>
    );

    if (!product) return null;

    const images = Array.isArray(product.images) ? product.images : (product.images ? JSON.parse(product.images) : []);

    return (
        <Container className="py-5" style={{ marginTop: "30px" }}>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-decoration-none text-dark">Home</Link></li>
                    <li className="breadcrumb-item active">{product.category || 'Produtos'}</li>
                    <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            <Row className="g-5">
                {/* Images Column */}
                <Col md={6}>
                    <Card className="border-0 shadow-sm overflow-hidden mb-3 rounded-4">
                        <img
                            src={images[selectedImage] || 'https://via.placeholder.com/600x600?text=Sem+Imagem'}
                            className="img-fluid w-100"
                            style={{ height: '500px', objectFit: 'contain' }}
                            alt={product.name}
                        />
                    </Card>
                    {images.length > 1 && (
                        <div className="d-flex gap-2 overflow-auto pb-2">
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`img-thumbnail p-0 border-${selectedImage === idx ? 'warning' : 'light'}`}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    )}
                </Col>

                {/* Info Column */}
                <Col md={6}>
                    <div className="ps-md-4">
                        <small className="text-uppercase fw-bold text-muted tracking-wider">{product.category}</small>
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
                            <span className="display-6 fw-bold text-danger">{(product.price - (product.discount || 0)).toLocaleString()} MT</span>
                            {product.discount > 0 && (
                                <span className="text-decoration-line-through text-muted ms-3 fs-5">{product.price.toLocaleString()} MT</span>
                            )}
                        </div>

                        <div className="bg-light p-3 rounded-4 mb-4 border">
                            <div className="d-flex align-items-center mb-2">
                                <i className="bi bi-shop text-dark me-2"></i>
                                <span className="fw-bold">Vendido por: <Link to={`/store/${product.store?.id || 1}`} className="text-decoration-none text-dark">{product.store?.name || 'TechMoz'}</Link></span>
                            </div>
                            <div className="d-flex gap-2">
                                {product.store?.verified && (
                                    <Badge bg="success" className="bg-opacity-10 text-success border border-success">
                                        <i className="bi bi-patch-check-fill me-1"></i> Vendedor Verificado
                                    </Badge>
                                )}
                                <Badge bg="primary" className="bg-opacity-10 text-primary border border-primary">98% Resposta</Badge>
                            </div>
                        </div>

                        <p className="text-muted mb-4">{product.description || 'Este produto é de alta qualidade e vem com garantia de satisfação.'}</p>

                        <div className="d-grid gap-3 mb-5">
                            <Button variant="warning" size="lg" className="bg-dubaning-orange border-0 shadow-sm text-white fw-bold rounded-pill" onClick={() => addToCart(true)}>
                                <i className="bi bi-lightning-fill me-2"></i>Comprar Agora
                            </Button>

                            <div className="p-3 bg-white border border-dashed rounded-4">
                                <h6 className="fw-bold mb-3 small text-muted">Ações Marketplace:</h6>
                                <Row className="g-2">
                                    <Col xs={12} className="mb-1">
                                        <Button variant="outline-success" className="w-100 rounded-pill" onClick={() => navigate(`/chat/${product.store?.owner_id || 1}`)}>
                                            <i className="bi bi-whatsapp me-2"></i> Chat com Vendedor
                                        </Button>
                                    </Col>
                                    <Col xs={6}>
                                        <Button variant="outline-primary" className="w-100 rounded-pill small" onClick={() => addNotification('Solicitação enviada.', 'success')}>
                                            <i className="bi bi-file-earmark-text me-1"></i> Pedir Cotação
                                        </Button>
                                    </Col>
                                    <Col xs={6}>
                                        <Button variant="outline-secondary" className="w-100 rounded-pill small" onClick={() => addNotification('Proforma enviada.', 'success')}>
                                            <i className="bi bi-file-earmark-pdf me-1"></i> Pedir Proforma
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        </div>

                        {/* Pagamento e Garantia */}
                        <div className="border-top pt-4">
                            <Row className="g-4">
                                <Col sm={6}>
                                    <h6 className="fw-bold mb-3 small text-muted">Pagamento Seguro:</h6>
                                    <div className="d-flex gap-3 align-items-center">
                                        <Badge bg="secondary">M-Pesa</Badge>
                                        <Badge bg="secondary">e-Mola</Badge>
                                        <i className="bi bi-cash-stack fs-4 text-muted" title="Dinheiro"></i>
                                    </div>
                                </Col>
                                <Col sm={6}>
                                    <h6 className="fw-bold mb-3 small text-muted">Confiança:</h6>
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-shield-check text-success fs-4"></i>
                                        <span className="small text-muted">Garantia Dubaning</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductDetails;
