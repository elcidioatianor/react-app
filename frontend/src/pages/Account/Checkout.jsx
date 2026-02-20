import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useApi } from '../../hooks/useApi.js';

function Checkout() {
    const { user } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const api = useApi();
    const [cartItems, setCartItems] = useState([]);
    //const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        city: 'Maputo',
        address: '',
        deliveryMethod: 'motoboy',
        paymentMethod: 'mpesa',
        mpesaNumber: user?.phone || '',
    });

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
            .then(items => {
                setCartItems(items)
                if (items.length === 0) navigate('/');
            })
            .catch(() => {
                setCartItems([])
            })
        
    }, [navigate]);

    const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );
    const shipping = formData.deliveryMethod === 'motoboy' ? 150 : 0;

    const handlePlaceOrder = async () => {
        try {
            const orderData = {
                items: cartItems,
                total: total + shipping,
                paymentMethod: formData.paymentMethod,
                deliveryMethod: formData.deliveryMethod,
                customerName: formData.name,
                customerPhone: formData.phone,
                customerAddress: formData.address,
            };

            const res = await api.post('/orders', orderData);

            if (res) {
                showNotification('Pedido realizado com sucesso!', 'success');
                showNotification(
                    'Pague no seu celular agora (M-Pesa/e-Mola)',
                    'info'
                );
                localStorage.removeItem('cart');
                window.dispatchEvent(new Event('cartUpdated'));
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            showNotification('Erro ao processar pedido', 'error');
        }
    };

    return (
        <div className='container py-5' style={{ marginTop: '70px' }}>
            <h2 className='fw-bold mb-4 text-center'>Finalizar Compra</h2>

            <div className='row g-4'>
                <div className='col-lg-8'>
                    {/* Step 1: Entrega */}
                    <div className='card border-0 shadow-sm p-4 mb-4'>
                        <h5 className='fw-bold mb-4'>
                            <i className='bi bi-geo-alt text-primary me-2'></i>
                            Informações de Entrega
                        </h5>
                        <div className='row g-3'>
                            <div className='col-md-6'>
                                <label className='form-label small fw-bold'>
                                    Nome Completo
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className='col-md-6'>
                                <label className='form-label small fw-bold'>
                                    Telefone
                                </label>
                                <input
                                    type='text'
                                    className='form-control'
                                    value={formData.phone}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className='col-md-12'>
                                <label className='form-label small fw-bold'>
                                    Endereço (Rua, Bairro, Casa)
                                </label>
                                <textarea
                                    className='form-control'
                                    rows='2'
                                    value={formData.address}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            address: e.target.value,
                                        })
                                    }
                                ></textarea>
                            </div>
                        </div>

                        <h6 className='fw-bold mt-4 mb-3'>Método de Entrega</h6>
                        <div className='row g-3'>
                            <div className='col-md-6'>
                                <div
                                    className={`card p-3 border-${formData.deliveryMethod === 'motoboy' ? 'primary' : 'light'} bg-light pointer`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            deliveryMethod: 'motoboy',
                                        })
                                    }
                                >
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <h6 className='fw-bold mb-0'>
                                                Motoboy DUBANING
                                            </h6>
                                            <small className='text-muted'>
                                                Entrega em 24h
                                            </small>
                                        </div>
                                        <span className='fw-bold text-primary'>
                                            150 MT
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div
                                    className={`card p-3 border-${formData.deliveryMethod === 'pickup' ? 'primary' : 'light'} bg-light pointer`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            deliveryMethod: 'pickup',
                                        })
                                    }
                                >
                                    <div className='d-flex justify-content-between'>
                                        <div>
                                            <h6 className='fw-bold mb-0'>
                                                Levantamento na Loja
                                            </h6>
                                            <small className='text-muted'>
                                                Grátis
                                            </small>
                                        </div>
                                        <span className='fw-bold text-success'>
                                            0 MT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Pagamento */}
                    <div className='card border-0 shadow-sm p-4'>
                        <h5 className='fw-bold mb-4'>
                            <i className='bi bi-credit-card text-primary me-2'></i>
                            Pagamento
                        </h5>
                        <div className='list-group mb-3'>
                            <label
                                className={`list-group-item d-flex align-items-center p-3 border-${formData.paymentMethod === 'mpesa' ? 'primary' : 'light'} bg-light`}
                            >
                                <input
                                    className='form-check-input me-3'
                                    type='radio'
                                    name='pay'
                                    checked={formData.paymentMethod === 'mpesa'}
                                    onChange={() =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod: 'mpesa',
                                        })
                                    }
                                />
                                <img
                                    src='https://logodownload.org/wp-content/uploads/2021/01/m-pesa-logo-0.png'
                                    height='20'
                                    className='me-3'
                                    alt='M-Pesa'
                                />
                                <span className='fw-bold'>M-Pesa</span>
                            </label>
                            <label
                                className={`list-group-item d-flex align-items-center p-3 border-${formData.paymentMethod === 'emola' ? 'primary' : 'light'} bg-light`}
                            >
                                <input
                                    className='form-check-input me-3'
                                    type='radio'
                                    name='pay'
                                    checked={formData.paymentMethod === 'emola'}
                                    onChange={() =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod: 'emola',
                                        })
                                    }
                                />
                                <span className='fw-bold me-3'>e-Mola</span>
                                <small className='text-muted'>
                                    Carteira móvel Movitel
                                </small>
                            </label>
                            <label
                                className={`list-group-item d-flex align-items-center p-3 border-${formData.paymentMethod === 'cash' ? 'primary' : 'light'} bg-light`}
                            >
                                <input
                                    className='form-check-input me-3'
                                    type='radio'
                                    name='pay'
                                    checked={formData.paymentMethod === 'cash'}
                                    onChange={() =>
                                        setFormData({
                                            ...formData,
                                            paymentMethod: 'cash',
                                        })
                                    }
                                />
                                <i className='bi bi-wallet2 me-3 fs-5'></i>
                                <span className='fw-bold'>
                                    Pagamento na Entrega (Cash)
                                </span>
                            </label>
                        </div>

                        {formData.paymentMethod !== 'cash' && (
                            <div className='bg-primary bg-opacity-10 p-3 rounded-3 mb-4 border border-primary border-opacity-25'>
                                <label className='form-label small fw-bold text-primary'>
                                    Número da Conta Móvel
                                </label>
                                <input
                                    type='text'
                                    className='form-control border-primary border-opacity-50'
                                    placeholder='Ex: 84 / 85 / 86 / 87'
                                    value={formData.mpesaNumber}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            mpesaNumber: e.target.value,
                                        })
                                    }
                                />
                                <small className='text-muted mt-2 d-block'>
                                    Você receberá uma notificação no celular
                                    para confirmar.
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                <div className='col-lg-4'>
                    <div
                        className='card border-0 shadow-sm p-4 sticky-top'
                        style={{ top: '100px' }}
                    >
                        <h5 className='fw-bold mb-4'>Resumo do Pedido</h5>
                        <div
                            className='mb-4 overflow-auto'
                            style={{ maxHeight: '200px' }}
                        >
                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    className='d-flex justify-content-between mb-2 small'
                                >
                                    <span
                                        className='text-truncate'
                                        style={{ maxWidth: '150px' }}
                                    >
                                        {item.quantity}x {item.name}
                                    </span>
                                    <span>
                                        {(
                                            item.price * item.quantity
                                        ).toLocaleString()}{' '}
                                        MT
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Subtotal</span>
                            <span className='fw-bold'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Entrega</span>
                            <span className='fw-bold'>
                                {shipping.toLocaleString()} MT
                            </span>
                        </div>
                        <hr className='my-4' />
                        <div className='d-flex justify-content-between mb-4 fs-5'>
                            <span className='fw-bold'>Total Geral</span>
                            <span className='fw-bold text-primary'>
                                {(total + shipping).toLocaleString()} MT
                            </span>
                        </div>
                        <button
                            className='btn btn-primary btn-lg w-100'
                            onClick={handlePlaceOrder}
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .pointer { cursor: pointer; }
                .pointer:hover { background-color: #f8f9fa !important; border-color: #0d6efd !important; }
            `}</style>
        </div>
    );
}

export default Checkout;