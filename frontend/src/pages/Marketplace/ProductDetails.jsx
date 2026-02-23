import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

function ProductDetails() {
    const { id } = useParams();
    const api = useApi();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                //TODO: FETCH SINGLE PRODUCT
                const res = await api.get(`/products`);
                const found = res.data.find(p => p.id === parseInt(id));
                if (found) {
                    setProduct(found);
                } else {
                    // Fallback for demo if not found in backend list immediately
                    if (id === '1')
                        setProduct({
                            id: 1,
                            name: 'Smartphone Samsung S24',
                            price: 65000,
                            discount: 5000,
                            category: 'Eletrónicos',
                            images: ['https://via.placeholder.com/600x600'],
                            store: { name: 'TechMoz' },
                        });
                    else {
                        showNotification('Produto não encontrado', 'error');
                        navigate('/');
                    }
                }
            } catch (error) {
                console.error(error);
                // Demo fallback
                if (id === '1')
                    setProduct({
                        id: 1,
                        name: 'Smartphone Samsung S24',
                        price: 65000,
                        discount: 5000,
                        category: 'Eletrónicos',
                        images: ['https://via.placeholder.com/600x600'],
                        store: { name: 'TechMoz' },
                    });
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, api, showNotification, navigate]);

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
                quantity: 1,
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        showNotification('Adicionado ao carrinho!', 'success');
        if (redirect) navigate('/cart');
    };

    if (loading)
        return (
            <div
                className='py-20 text-center flex justify-center items-center'
                style={{ marginTop: '100px', minHeight: '400px' }}
            >
                <div className='inline-block w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin'></div>
            </div>
        );

    if (!product) return null;

    const images = Array.isArray(product.images)
        ? product.images
        : product.images
          ? JSON.parse(product.images)
          : [];

    return (
        <div className='container mx-auto py-20' style={{ marginTop: '30px' }}>
            <nav aria-label='breadcrumb' className='mb-16'>
                <ol className='flex text-sm'>
                    <li className='flex items-center'>
                        <Link to='/' className='no-underline text-black hover:text-blue-600'>
                            Home
                        </Link>
                        <span className='mx-2 text-gray-400'>/</span>
                    </li>
                    <li className='flex items-center'>
                        <span className='text-gray-700'>
                            {product.category || 'Produtos'}
                        </span>
                        <span className='mx-2 text-gray-400'>/</span>
                    </li>
                    <li className='flex items-center'>
                        <span className='text-gray-700'>
                            {product.name}
                        </span>
                    </li>
                </ol>
            </nav>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-20'>
                {/* Images Column */}
                <div>
                    <div className='bg-white border border-gray-200 shadow-sm overflow-hidden mb-3 rounded-lg'>
                        <img
                            src={
                                images[selectedImage] ||
                                'https://via.placeholder.com/600x600?text=Sem+Imagem'
                            }
                            className='w-full'
                            style={{ height: '500px', objectFit: 'contain' }}
                            alt={product.name}
                        />
                    </div>
                    {images.length > 1 && (
                        <div className='flex gap-2 overflow-x-auto pb-2'>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`flex-shrink-0 p-0 cursor-pointer border-2 rounded-lg ${
                                        selectedImage === idx ? 'border-yellow-400' : 'border-gray-200'
                                    }`}
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Column */}
                <div>
                    <div className='md:ps-4'>
                        <small className='uppercase font-bold text-gray-500 tracking-widest'>
                            {product.category}
                        </small>
                        <h1 className='font-bold mb-3 text-4xl'>{product.name}</h1>

                        <div className='flex items-center mb-16'>
                            <div className='text-yellow-400 mr-2 flex'>
                                <i className='bi bi-star-fill'></i>
                                <i className='bi bi-star-fill'></i>
                                <i className='bi bi-star-fill'></i>
                                <i className='bi bi-star-fill'></i>
                                <i className='bi bi-star-half'></i>
                            </div>
                            <small className='text-gray-500'>
                                (4.5 - 12 avaliações)
                            </small>
                        </div>

                        <div className='mb-16'>
                            <span className='text-5xl font-bold text-red-600'>
                                {(
                                    product.price - (product.discount || 0)
                                ).toLocaleString()}{' '}
                                MT
                            </span>
                            {product.discount > 0 && (
                                <span className='line-through text-gray-500 ml-3 text-lg'>
                                    {product.price.toLocaleString()} MT
                                </span>
                            )}
                        </div>

                        <div className='bg-gray-100 p-3 rounded-lg mb-16 border border-gray-200'>
                            <div className='flex items-center mb-2'>
                                <i className='bi bi-shop text-black mr-2'></i>
                                <span className='font-bold'>
                                    Vendido por:{' '}
                                    <Link
                                        to={`/store/${product.store?.id || 1}`}
                                        className='no-underline text-black hover:text-blue-600'
                                    >
                                        {product.store?.name || 'TechMoz'}
                                    </Link>
                                </span>
                            </div>
                            <div className='flex gap-2'>
                                {product.store?.verified && (
                                    <span className='inline-block px-3 py-1 bg-green-50 text-green-600 border border-green-500 rounded'>
                                        <i className='bi bi-patch-check-fill mr-1'></i>
                                        Vendedor Verificado
                                    </span>
                                )}
                                <span className='inline-block px-3 py-1 bg-blue-50 text-blue-600 border border-blue-500 rounded'>
                                    98% Resposta
                                </span>
                            </div>
                        </div>

                        <p className='text-gray-500 mb-16'>
                            {product.description ||
                                'Este produto é de alta qualidade e vem com garantia de satisfação.'}
                        </p>

                        <div className='flex flex-col gap-3 mb-20'>
                            <button
                                className='w-full py-3 px-6 bg-yellow-400 border-0 shadow-sm text-white font-bold rounded-full hover:bg-yellow-500 transition-colors'
                                style={{ backgroundColor: '#FFD814', color: '#0F1111' }}
                                onClick={() => addToCart(true)}
                            >
                                <i className='bi bi-lightning-fill mr-2'></i>
                                Comprar Agora
                            </button>

                            <div className='p-3 bg-white border border-dashed border-gray-300 rounded-lg'>
                                <h6 className='font-bold mb-3 text-sm text-gray-500'>
                                    Ações Marketplace:
                                </h6>
                                <div className='grid grid-cols-1 gap-2'>
                                    <div className='mb-1'>
                                        <button
                                            className='w-full py-2 px-4 border border-green-500 text-green-600 font-bold rounded-full hover:bg-green-50 transition-colors text-sm'
                                            onClick={() =>
                                                navigate(
                                                    `/chat/${product.store?.owner_id || 1}`
                                                )
                                            }
                                        >
                                            <i className='bi bi-whatsapp mr-2'></i>
                                            Chat com Vendedor
                                        </button>
                                    </div>
                                    <div className='grid grid-cols-2 gap-2'>
                                        <button
                                            className='py-2 px-4 border border-blue-500 text-blue-600 font-bold rounded-full hover:bg-blue-50 transition-colors text-xs'
                                            onClick={() =>
                                                showNotification(
                                                    'Solicitação enviada.',
                                                    'success'
                                                )
                                            }
                                        >
                                            <i className='bi bi-file-earmark-text mr-1'></i>
                                            Pedir Cotação
                                        </button>
                                        <button
                                            className='py-2 px-4 border border-gray-400 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-colors text-xs'
                                            onClick={() =>
                                                showNotification(
                                                    'Proforma enviada.',
                                                    'success'
                                                )
                                            }
                                        >
                                            <i className='bi bi-file-earmark-pdf mr-1'></i>
                                            Pedir Proforma
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pagamento e Garantia */}
                        <div className='border-t pt-16'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-16'>
                                <div>
                                    <h6 className='font-bold mb-3 text-sm text-gray-500'>
                                        Pagamento Seguro:
                                    </h6>
                                    <div className='flex gap-3 items-center'>
                                        <span className='inline-block px-3 py-1 bg-gray-500 text-white rounded text-sm'>M-Pesa</span>
                                        <span className='inline-block px-3 py-1 bg-gray-500 text-white rounded text-sm'>e-Mola</span>
                                        <i
                                            className='bi bi-cash-stack text-2xl text-gray-500'
                                            title='Dinheiro'
                                        ></i>
                                    </div>
                                </div>
                                <div>
                                    <h6 className='font-bold mb-3 text-sm text-gray-500'>
                                        Confiança:
                                    </h6>
                                    <div className='flex items-center gap-2'>
                                        <i className='bi bi-shield-check text-green-600 text-2xl'></i>
                                        <span className='text-sm text-gray-500'>
                                            Garantia Dubaning
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
