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
        <div className='px-4 py-8 max-w-7xl mx-auto' style={{ marginTop: '70px' }}>
            <h2 className='font-bold mb-6 text-center text-2xl'>Finalizar Compra</h2>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                <div className='lg:col-span-2'>
                    {/* Step 1: Entrega */}
                    <div className='bg-white border border-gray-200 rounded-lg shadow p-6 mb-6'>
                        <h5 className='font-bold mb-6 text-lg'>
                            <i className='bi bi-geo-alt text-blue-600 mr-2'></i>
                            Informações de Entrega
                        </h5>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-bold mb-2'>
                                    Nome Completo
                                </label>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                    value={formData.name}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div>
                                <label className='block text-sm font-bold mb-2'>
                                    Telefone
                                </label>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                    value={formData.phone}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className='col-span-1 md:col-span-2'>
                                <label className='block text-sm font-bold mb-2'>
                                    Endereço (Rua, Bairro, Casa)
                                </label>
                                <textarea
                                    className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
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

                        <h6 className='font-bold mt-6 mb-3 text-base'>Método de Entrega</h6>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div>
                                <div
                                    className={`p-3 rounded border-2 bg-gray-50 cursor-pointer transition-colors ${formData.deliveryMethod === 'motoboy' ? 'border-blue-600' : 'border-gray-200'} hover:bg-gray-100`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            deliveryMethod: 'motoboy',
                                        })
                                    }
                                >
                                    <div className='flex justify-between'>
                                        <div>
                                            <h6 className='font-bold mb-0'>
                                                Motoboy DUBANING
                                            </h6>
                                            <small className='text-gray-500'>
                                                Entrega em 24h
                                            </small>
                                        </div>
                                        <span className='font-bold text-blue-600'>
                                            150 MT
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div
                                    className={`p-3 rounded border-2 bg-gray-50 cursor-pointer transition-colors ${formData.deliveryMethod === 'pickup' ? 'border-blue-600' : 'border-gray-200'} hover:bg-gray-100`}
                                    onClick={() =>
                                        setFormData({
                                            ...formData,
                                            deliveryMethod: 'pickup',
                                        })
                                    }
                                >
                                    <div className='flex justify-between'>
                                        <div>
                                            <h6 className='font-bold mb-0'>
                                                Levantamento na Loja
                                            </h6>
                                            <small className='text-gray-500'>
                                                Grátis
                                            </small>
                                        </div>
                                        <span className='font-bold text-green-600'>
                                            0 MT
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Pagamento */}
                    <div className='bg-white border border-gray-200 rounded-lg shadow p-6'>
                        <h5 className='font-bold mb-6 text-lg'>
                            <i className='bi bi-credit-card text-blue-600 mr-2'></i>
                            Pagamento
                        </h5>
                        <div className='space-y-3 mb-6'>
                            <label
                                className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${formData.paymentMethod === 'mpesa' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                            >
                                <input
                                    className='w-4 h-4 mr-3 cursor-pointer accent-blue-600'
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
                                    className='mr-3'
                                    alt='M-Pesa'
                                />
                                <span className='font-bold'>M-Pesa</span>
                            </label>
                            <label
                                className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${formData.paymentMethod === 'emola' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                            >
                                <input
                                    className='w-4 h-4 mr-3 cursor-pointer accent-blue-600'
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
                                <span className='font-bold mr-3'>e-Mola</span>
                                <small className='text-gray-500'>
                                    Carteira móvel Movitel
                                </small>
                            </label>
                            <label
                                className={`flex items-center p-3 border rounded cursor-pointer transition-colors ${formData.paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}
                            >
                                <input
                                    className='w-4 h-4 mr-3 cursor-pointer accent-blue-600'
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
                                <i className='bi bi-wallet2 mr-3 text-lg'></i>
                                <span className='font-bold'>
                                    Pagamento na Entrega (Cash)
                                </span>
                            </label>
                        </div>

                        {formData.paymentMethod !== 'cash' && (
                            <div className='bg-blue-50 p-3 rounded-lg mb-4 border border-blue-200'>
                                <label className='block text-sm font-bold text-blue-600 mb-2'>
                                    Número da Conta Móvel
                                </label>
                                <input
                                    type='text'
                                    className='w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:border-blue-500'
                                    placeholder='Ex: 84 / 85 / 86 / 87'
                                    value={formData.mpesaNumber}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            mpesaNumber: e.target.value,
                                        })
                                    }
                                />
                                <small className='text-gray-500 mt-2 block'>
                                    Você receberá uma notificação no celular
                                    para confirmar.
                                </small>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <div
                        className='bg-white border border-gray-200 rounded-lg shadow p-6 sticky'
                        style={{ top: '100px' }}
                    >
                        <h5 className='font-bold mb-6 text-lg'>Resumo do Pedido</h5>
                        <div
                            className='mb-6 overflow-auto'
                            style={{ maxHeight: '200px' }}
                        >
                            {cartItems.map(item => (
                                <div
                                    key={item.id}
                                    className='flex justify-between mb-2 text-sm'
                                >
                                    <span
                                        className='truncate'
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
                        <div className='flex justify-between mb-2'>
                            <span>Subtotal</span>
                            <span className='font-bold'>
                                {total.toLocaleString()} MT
                            </span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>Entrega</span>
                            <span className='font-bold'>
                                {shipping.toLocaleString()} MT
                            </span>
                        </div>
                        <hr className='my-6' />
                        <div className='flex justify-between mb-6 text-lg'>
                            <span className='font-bold'>Total Geral</span>
                            <span className='font-bold text-blue-600'>
                                {(total + shipping).toLocaleString()} MT
                            </span>
                        </div>
                        <button
                            className='w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors'
                            onClick={handlePlaceOrder}
                        >
                            Confirmar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;