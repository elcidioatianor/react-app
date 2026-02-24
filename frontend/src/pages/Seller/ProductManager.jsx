import { useState, useEffect, useCallback } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import {
    Plus,
    Search,
    PencilSquare,
    Trash,
    //ThreeDotsVertical,
    //Image as ImageIcon,
} from 'react-bootstrap-icons';

function ProductManager() {
    const api = useApi();
    const { showNotification } = useNotification();

    // State
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'Tecnologia',
        stock: '',
        description: '',
        image: '',
    });

    const loadProducts = useCallback(() => {
        return api.get('/products/my-products');
    }, [api])

    

    useEffect(() => {
        loadProducts()
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                showNotification('Erro ao carregar produtos', 'error');
                setLoading(false);
            });
    }, [loadProducts, showNotification]);


    const handleInput = e => {
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
                isActive: true,
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct.id}`, payload);
                showNotification('Produto atualizado!', 'success');
            } else {
                await api.post('/products', payload);
                showNotification('Produto criado com sucesso!', 'success');
            }

            handleCloseModal();
            loadProducts()
            .then(res => {
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                showNotification('Erro ao carregar produtos', 'error');
                setLoading(false);
            });
            
        } catch (error) {
            console.error(error);
            showNotification('Erro ao salvar produto', 'error');
        }
    };

    const handleDelete = async id => {
        if (window.confirm('Tem certeza que deseja apagar este produto?')) {
            try {
                await api.delete(`/products/${id}`);
                showNotification('Produto removido.', 'success');
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                showNotification('Erro ao remover produto: ' + error.message, 'error');
            }
        }
    };

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            const img =
                product.images && Array.isArray(product.images)
                    ? product.images[0]
                    : product.images
                      ? JSON.parse(product.images)[0]
                      : '';
            setFormData({
                name: product.name,
                price: product.price,
                category: product.category,
                stock: product.stock,
                description: product.description || '',
                image: img,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                category: 'Tecnologia',
                stock: '',
                description: '',
                image: '',
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    // Filter Logic
    const filteredProducts = products.filter(
        p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-2xl font-bold">Meus Produtos</h4>
                <button
                    className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-500"
                    onClick={() => openModal()}
                >
                    <Plus size={20} /> Novo Produto
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome ou categoria..."
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estoque</th>
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-5 text-center text-gray-500">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-4 py-5 text-center text-gray-500">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-gray-100 rounded p-1 border">
                                                    <img
                                                        src={
                                                            (p.images &&
                                                                Array.isArray(p.images) &&
                                                                p.images[0]) ||
                                                            (p.images &&
                                                                JSON.parse(p.images)[0]) ||
                                                            'https://via.placeholder.com/50'
                                                        }
                                                        alt=""
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                </div>
                                                <span className="font-semibold text-gray-900">
                                                    {p.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 font-semibold">
                                            {p.price.toLocaleString()} MT
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            {p.stock}
                                        </td>
                                        <td className="px-4 py-4 text-center">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                    p.stock > 0
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}
                                            >
                                                {p.stock > 0 ? 'Ativo' : 'Esgotado'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <button
                                                className="text-blue-600 hover:text-blue-900 p-1"
                                                onClick={() => openModal(p)}
                                            >
                                                <PencilSquare />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-900 p-1"
                                                onClick={() => handleDelete(p.id)}
                                            >
                                                <Trash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Product Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h5 className="text-lg font-bold">
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h5>
                            <button
                                className="text-gray-400 hover:text-gray-600"
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome do Produto
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInput}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Preço (MT)
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInput}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Estoque
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInput}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoria
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInput}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Tecnologia</option>
                                    <option>Moda</option>
                                    <option>Casa</option>
                                    <option>Agro</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Descrição
                                </label>
                                <textarea
                                    rows={3}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInput}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    URL da Imagem
                                </label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInput}
                                    placeholder="https://..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="mt-4">
                                <button
                                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:ring-2 focus:ring-orange-500"
                                    onClick={handleSave}
                                >
                                    Salvar Produto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProductManager;
