import { useEffect, useState } from "react";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";

export function ProductManager() {
    const api = useApi();
    const { addNotification } = useNotification();

    // Data State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        category: "Tecnologia",
        images: "", // Using single URL for MVP or comma separated
        isActive: true
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const res = await api.get('/products/my-products');
            setProducts(res.data);
        } catch (error) {
            console.error("Erro ao carregar produtos", error);
            addNotification("Erro ao carregar produtos", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const openModal = (product = null) => {
        if (product) {
            setIsEditing(true);
            setCurrentId(product.id);
            setFormData({
                name: product.name,
                description: product.description || "",
                price: product.price,
                discount: product.discount || "",
                stock: product.stock || 0,
                category: product.category || "Tecnologia",
                images: Array.isArray(product.images) ? product.images[0] : (product.images || ""),
                isActive: product.isActive
            });
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setFormData({
                name: "",
                description: "",
                price: "",
                discount: "",
                stock: "",
                category: "Tecnologia",
                images: "",
                isActive: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        // Prepare payload - handle images as array
        const payload = {
            ...formData,
            images: formData.images ? [formData.images] : [],
            variations: [] // Placeholder for now
        };

        try {
            if (isEditing) {
                await api.put(`/products/${currentId}`, payload);
                addNotification("Produto atualizado com sucesso!", "success");
            } else {
                await api.post('/products', payload);
                addNotification("Produto criado com sucesso!", "success");
            }
            closeModal();
            loadProducts();
        } catch (error) {
            console.error(error);
            addNotification("Erro ao salvar produto", "error");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Tem certeza que deseja remover este produto?")) {
            try {
                await api.delete(`/products/${id}`);
                addNotification("Produto removido", "success");
                loadProducts();
            } catch (error) {
                addNotification("Erro ao remover produto", "error");
            }
        }
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Meus Produtos</h2>
                <button className="btn btn-primary" onClick={() => openModal()}>
                    <i className="bi bi-plus-lg me-2"></i>
                    Novo Produto
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-primary"></div>
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-5 bg-white rounded shadow-sm">
                    <i className="bi bi-box-seam display-1 text-muted mb-3"></i>
                    <h4>Nenhum produto cadastrado</h4>
                    <p className="text-muted">Comece a vender adicionando seu primeiro produto.</p>
                </div>
            ) : (
                <div className="card border-0 shadow-sm">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="ps-4">Produto</th>
                                    <th>Preço</th>
                                    <th>Stock</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded d-flex align-items-center justify-content-center me-3" style={{ width: 40, height: 40 }}>
                                                    {product.images && product.images.length > 0 ? (
                                                        <img src={Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images)[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                                                    ) : (
                                                        <i className="bi bi-image text-muted"></i>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="fw-bold">{product.name}</div>
                                                    <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                                        {product.category}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>{product.price} MT</div>
                                            {product.discount > 0 && <small className="text-danger">Promo: {product.discount} MT</small>}
                                        </td>
                                        <td>{product.stock}</td>
                                        <td>
                                            {product.isActive ?
                                                <span className="badge bg-success bg-opacity-10 text-success">Ativo</span> :
                                                <span className="badge bg-secondary bg-opacity-10 text-secondary">Inativo</span>
                                            }
                                        </td>
                                        <td>
                                            <button className="btn btn-sm btn-light text-primary me-2" onClick={() => openModal(product)}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-sm btn-light text-danger" onClick={() => handleDelete(product.id)}>
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <form onSubmit={handleSave}>
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-md-8 mb-3">
                                            <label className="form-label">Nome do Produto</label>
                                            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Categoria</label>
                                            <select className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                                                <option value="Tecnologia">Tecnologia</option>
                                                <option value="Moda">Moda</option>
                                                <option value="Casa">Casa</option>
                                                <option value="Agro">Agro</option>
                                                <option value="Serviços">Serviços</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descrição</label>
                                        <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={handleInputChange}></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Preço (MT)</label>
                                            <input type="number" className="form-control" name="price" value={formData.price} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Preço Promocional (Opcional)</label>
                                            <input type="number" className="form-control" name="discount" value={formData.discount} onChange={handleInputChange} />
                                        </div>
                                        <div className="col-md-4 mb-3">
                                            <label className="form-label">Estoque (Qtd)</label>
                                            <input type="number" className="form-control" name="stock" value={formData.stock} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">URL da Imagem</label>
                                        <input type="text" className="form-control" name="images" value={formData.images} onChange={handleInputChange} placeholder="https://..." />
                                        <div className="form-text">Cole o link da imagem do produto. (Upload de arquivo será implementado em breve)</div>
                                    </div>

                                    <div className="form-check form-switch">
                                        <input className="form-check-input" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} />
                                        <label className="form-check-label">Produto Ativo (Visível na loja)</label>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancelar</button>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Produto'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
