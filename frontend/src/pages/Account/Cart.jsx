import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';

export default function Cart() {
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        function getCartItems() {
            return new Promise(resolve => {
                const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
                
                setTimeout(()=> {
                    resolve(savedCart)
                })
            })
        }
        getCartItems()
            .then(items => setCartItems(items))
            .catch(() => {
                setCartItems([])
            })
    }, []);

    const updateQuantity = (id, delta) => {
        const updated = cartItems.map(item => {
            if (item.id === id) {
                const newQty = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQty };
            }
            return item;
        });
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = id => {
        const updated = cartItems.filter(item => item.id !== id);
        setCartItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        showNotification('Item removido', 'info');
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0)
        return (
            <div
                className='container mx-auto py-20 text-center flex flex-col items-center justify-center'
                style={{ marginTop: '100px', minHeight: '400px' }}
            >
                <i className='bi bi-cart-x text-9xl text-gray-400 mb-16'></i>
                <h3 className='text-2xl font-bold'>Seu carrinho está vazio</h3>
                <p className='text-gray-500 mb-16'>
                    Que tal explorar nossos produtos e encontrar algo incrível?
                </p>
                <Link to='/' className='bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-700 transition-colors'>
                    Ir para o Shopping
                </Link>
            </div>
        );

    return (
        <div className='container mx-auto py-20' style={{ marginTop: '70px' }}>
            <h2 className='font-bold mb-20 text-3xl'>Seu Carrinho</h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                <div className='lg:col-span-2'>
                    <div className='bg-white border-0 shadow-sm p-16 mb-16 rounded-lg'>
                        {cartItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`flex items-center py-3 ${idx !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}
                            >
                                <img
                                    src={
                                        item.image ||
                                        'https://via.placeholder.com/100'
                                    }
                                    className='rounded'
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                    }}
                                    alt={item.name}
                                />
                                <div className='ml-3 flex-grow'>
                                    <h6 className='font-bold mb-0'>
                                        {item.name}
                                    </h6>
                                    <small className='text-gray-500'>
                                        {item.category}
                                    </small>
                                    <div className='mt-2 text-blue-600 font-bold'>
                                        {item.price.toLocaleString()} MT
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <button
                                        className='w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors'
                                        onClick={() =>
                                            updateQuantity(item.id, -1)
                                        }
                                    >
                                        −
                                    </button>
                                    <span className='font-bold mx-2 w-6 text-center'>
                                        {item.quantity}
                                    </span>
                                    <button
                                        className='w-7 h-7 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors'
                                        onClick={() =>
                                            updateQuantity(item.id, 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className='no-underline text-red-600 ml-3 hover:opacity-70 transition-opacity'
                                    onClick={() => removeItem(item.id)}
                                >
                                    <i className='bi bi-trash'></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <Link to='/' className='no-underline text-gray-500 hover:text-gray-700 transition-colors'>
                        <i className='bi bi-arrow-left mr-2'></i> Continuar
                        Comprando
                    </Link>
                </div>

                <div className='lg:col-span-1'>
                    <div className='bg-white border-0 shadow-sm p-16 rounded-lg'>
                        <h5 className='font-bold mb-16 text-lg'>Resumo do Pedido</h5>
                        <div className='flex justify-between mb-2'>
                            <span>Subtotal</span>
                            <span className='font-bold'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>Entrega</span>
                            <span className='text-green-600 font-bold'>Grátis</span>
                        </div>
                        <hr className='my-16' />
                        <div className='flex justify-between mb-16 text-lg'>
                            <span className='font-bold'>Total</span>
                            <span className='font-bold text-blue-600'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <button
                            className='w-full py-3 px-6 bg-blue-600 text-white font-bold text-lg rounded-lg hover:bg-blue-700 transition-colors'
                            onClick={() => navigate('/checkout')}
                        >
                            Finalizar Compra
                        </button>
                        <div className='mt-16 text-center'>
                            <small className='text-gray-500 mb-2 block'>
                                Pague com facilidade:
                            </small>
                            <div className='flex justify-center gap-3 opacity-50'>
                                <img
                                    src='https://logodownload.org/wp-content/uploads/2021/01/m-pesa-logo-0.png'
                                    height='15'
                                    alt='M-Pesa'
                                />
                                <span className='text-sm font-bold'>e-Mola</span>
                                <span className='text-sm font-bold'>mKesh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
