import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";
import { Container, Row, Col, Card, Table, Button, Modal, Form, Badge, InputGroup } from "react-bootstrap";
import {
    Plus,
    Search,
    PencilSquare,
    Trash,
    ThreeDotsVertical,
    Image as ImageIcon
} from "react-bootstrap-icons";

export function ProductManager() {
    const api = useApi();
    const { addNotification } = useNotification();

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        price: "",
        category: "Tecnologia",
        stock: "",
        description: "",
        image: ""
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products/my-products');
            setProducts(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            addNotification("Erro ao carregar produtos", "error");
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                stock: parseInt(formData.stock),
                price: parseFloat(formData.price),
                images: formData.image ? [formData.image] : [],
                variations: [],
                isActive: true
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                addNotification("Produto atualizado!", "success");
            } else {
                await api.post('/products', payload);
                addNotification("Produto criado com sucesso!", "success");
            }

            handleCloseModal();
            loadProducts();
        } catch (error) {
            console.error(error);
            addNotification("Erro ao salvar produto", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja apagar este produto?")) {
            try {
                await api.delete(`/products/${id}`);
                addNotification("Produto removido.", "success");
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                addNotification("Erro ao remover produto", "error");
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            const img = product.images && Array.isArray(product.images) ? product.images[0] :
                (product.images ? JSON.parse(product.images)[0] : "");
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                stock: product.stock,
                description: product.description || "",
                image: img
            });
        } else {
            setEditingProduct(null);
            setFormData({ name: "", price: "", category: "Tecnologia", stock: "", description: "", image: "" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    // Filter Logic
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container fluid className="px-0">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">Meus Produtos</h4>
                <Button variant="primary" className="d-flex align-items-center gap-2 bg-dubaning-orange border-0" onClick={() => openModal()}>
                    <Plus size={20} /> Novo Produto
                </Button>
            </div>

            <Card className="border-0 shadow-sm">
                <Card.Body>
                    <div className="mb-4">
                        <InputGroup>
                            <InputGroup.Text className="bg-white border-end-0">
                                <Search className="text-muted" />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder="Pesquisar por nome ou categoria..."
                                className="border-start-0 ps-0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>
                    </div>

                    <div className="table-responsive">
                        <Table hover className="align-middle">
                            <thead className="bg-light">
                                <tr>
                                    <th className="border-0 ps-3">Produto</th>
                                    <th className="border-0">Categoria</th>
                                    <th className="border-0">Preço</th>
                                    <th className="border-0 text-center">Estoque</th>
                                    <th className="border-0 text-center">Status</th>
                                    <th className="border-0 text-end pe-3">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-5">Carregando...</td></tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-5 text-muted">Nenhum produto encontrado.</td></tr>
                                ) : (
                                    filteredProducts.map(p => (
                                        <tr key={p.id}>
                                            <td className="ps-3">
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="bg-light rounded p-1 border">
                                                        <img
                                                            src={(p.images && Array.isArray(p.images) && p.images[0]) || (p.images && JSON.parse(p.images)[0]) || "https://via.placeholder.com/50"}
                                                            alt=""
                                                            style={{ width: 40, height: 40, objectFit: 'cover' }}
                                                        />
                                                    </div>
                                                    <span className="fw-bold text-dark">{p.name}</span>
                                                </div>
                                            </td>
                                            <td><Badge bg="light" text="dark" className="border">{p.category}</Badge></td>
                                            <td className="fw-bold">{p.price.toLocaleString()} MT</td>
                                            <td className="text-center">{p.stock}</td>
                                            <td className="text-center">
                                                <Badge bg={p.stock > 0 ? 'success' : 'danger'} className="bg-opacity-10 text-capitalize" style={{ color: p.stock > 0 ? 'green' : 'red' }}>
                                                    {p.stock > 0 ? 'Ativo' : 'Esgotado'}
                                                </Badge>
                                            </td>
                                            <td className="text-end pe-3">
                                                <Button variant="link" className="text-primary p-1" onClick={() => openModal(p)}>
                                                    <PencilSquare />
                                                </Button>
                                                <Button variant="link" className="text-danger p-1" onClick={() => handleDelete(p.id)}>
                                                    <Trash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* Product Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="fw-bold">{editingProduct ? 'Editar Produto' : 'Novo Produto'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-4 pb-4">
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Nome do Produto</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleInput} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">Preço (MT)</Form.Label>
                                    <Form.Control type="number" name="price" value={formData.price} onChange={handleInput} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="small fw-bold text-muted">Estoque</Form.Label>
                                    <Form.Control type="number" name="stock" value={formData.stock} onChange={handleInput} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Categoria</Form.Label>
                            <Form.Select name="category" value={formData.category} onChange={handleInput}>
                                <option>Tecnologia</option>
                                <option>Moda</option>
                                <option>Casa</option>
                                <option>Agro</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label className="small fw-bold text-muted">Descrição</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleInput} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="small fw-bold text-muted">URL da Imagem</Form.Label>
                            <Form.Control type="text" name="image" value={formData.image} onChange={handleInput} placeholder="https://..." />
                        </Form.Group>
                    </Form>
                    <div className="d-grid mt-4">
                        <Button variant="primary" className="bg-dubaning-orange border-0" onClick={handleSave}>
                            Salvar Produto
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
