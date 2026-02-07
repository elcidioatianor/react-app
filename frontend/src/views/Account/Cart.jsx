import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../contexts/NotificationContext';

export default function Cart() {
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(savedCart);
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
        addNotification('Item removido', 'info');
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    if (cartItems.length === 0)
        return (
            <div
                className='container py-5 text-center'
                style={{ marginTop: '100px' }}
            >
                <i className='bi bi-cart-x display-1 text-muted mb-4'></i>
                <h3>Seu carrinho está vazio</h3>
                <p className='text-muted mb-4'>
                    Que tal explorar nossos produtos e encontrar algo incrível?
                </p>
                <Link to='/' className='btn btn-primary btn-lg px-5'>
                    Ir para o Shopping
                </Link>
            </div>
        );

    return (
        <div className='container py-5' style={{ marginTop: '70px' }}>
            <h2 className='fw-bold mb-5'>Seu Carrinho</h2>

            <div className='row g-4'>
                <div className='col-lg-8'>
                    <div className='card border-0 shadow-sm p-4 mb-4'>
                        {cartItems.map((item, idx) => (
                            <div
                                key={item.id}
                                className={`d-flex align-items-center py-3 ${idx !== cartItems.length - 1 ? 'border-bottom' : ''}`}
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
                                <div className='ms-3 flex-grow-1'>
                                    <h6 className='fw-bold mb-0'>
                                        {item.name}
                                    </h6>
                                    <small className='text-muted'>
                                        {item.category}
                                    </small>
                                    <div className='mt-2 text-primary fw-bold'>
                                        {item.price.toLocaleString()} MT
                                    </div>
                                </div>
                                <div className='d-flex align-items-center gap-2'>
                                    <button
                                        className='btn btn-sm btn-outline-secondary rounded-circle'
                                        style={{ width: 30, height: 30 }}
                                        onClick={() =>
                                            updateQuantity(item.id, -1)
                                        }
                                    >
                                        -
                                    </button>
                                    <span className='fw-bold mx-2'>
                                        {item.quantity}
                                    </span>
                                    <button
                                        className='btn btn-sm btn-outline-secondary rounded-circle'
                                        style={{ width: 30, height: 30 }}
                                        onClick={() =>
                                            updateQuantity(item.id, 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className='btn btn-link text-danger ms-3'
                                    onClick={() => removeItem(item.id)}
                                >
                                    <i className='bi bi-trash'></i>
                                </button>
                            </div>
                        ))}
                    </div>
                    <Link to='/' className='text-decoration-none text-muted'>
                        <i className='bi bi-arrow-left me-2'></i> Continuar
                        Comprando
                    </Link>
                </div>

                <div className='col-lg-4'>
                    <div className='card border-0 shadow-sm p-4'>
                        <h5 className='fw-bold mb-4'>Resumo do Pedido</h5>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Subtotal</span>
                            <span className='fw-bold'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Entrega</span>
                            <span className='text-success fw-bold'>Grátis</span>
                        </div>
                        <hr className='my-4' />
                        <div className='d-flex justify-content-between mb-4 fs-5'>
                            <span className='fw-bold'>Total</span>
                            <span className='fw-bold text-primary'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <button
                            className='btn btn-primary btn-lg w-100'
                            onClick={() => navigate('/checkout')}
                        >
                            Finalizar Compra
                        </button>
                        <div className='mt-4 text-center'>
                            <small className='text-muted mb-2 d-block'>
                                Pague com facilidade:
                            </small>
                            <div className='d-flex justify-content-center gap-3 opacity-50'>
                                <img
                                    src='https://logodownload.org/wp-content/uploads/2021/01/m-pesa-logo-0.png'
                                    height='15'
                                    alt='M-Pesa'
                                />
                                <span className='small fw-bold'>e-Mola</span>
                                <span className='small fw-bold'>mKesh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
