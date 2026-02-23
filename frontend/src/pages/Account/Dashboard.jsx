import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';

export default function Dashboard() {
    const { user } = useAuth();
    const api = useApi();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/my');
                setOrders(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchOrders();
    }, [setOrders, setLoading, api]);

    return (
        <div className='px-4 py-8 max-w-7xl mx-auto' style={{ marginTop: '60px' }}>
            <div className='flex justify-between items-center mb-8'>
                <div>
                    <h1 className='font-bold'>Minha Conta</h1>
                    <p className='text-gray-500'>
                        Bem-vindo de volta, {user?.name}
                    </p>
                </div>
                <Link to='/' className='border border-blue-600 text-blue-600 hover:bg-blue-50 p-2 rounded text-sm transition-colors inline-flex items-center gap-2'>
                    <i className='bi bi-arrow-left'></i>
                    Continuar Comprando
                </Link>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                {/* Meus Pedidos Card */}
                <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full'>
                    <div className='p-6'>
                        <div className='flex items-center mb-4'>
                            <div
                                className='bg-blue-100 text-blue-600 rounded-full flex items-center justify-center'
                                style={{ width: 48, height: 48 }}
                            >
                                <i className='bi bi-box-seam text-lg'></i>
                            </div>
                            <h5 className='font-bold mb-0 ml-4 text-lg'>
                                Meus Pedidos
                            </h5>
                        </div>
                        <p className='text-gray-500 text-sm'>
                            Gerencie suas compras e acompanhe o envio.
                        </p>
                        <div className='text-3xl font-bold text-blue-600'>
                            {orders.length}
                        </div>
                    </div>
                </div>

                {/* Mensagens Card */}
                <div
                    className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full'
                    style={{ cursor: 'pointer' }}
                    onClick={() => alert('Chat em breve!')}
                >
                    <div className='p-6'>
                        <div className='flex items-center mb-4'>
                            <div
                                className='bg-green-100 text-green-600 rounded-full flex items-center justify-center'
                                style={{ width: 48, height: 48 }}
                            >
                                <i className='bi bi-chat-dots text-lg'></i>
                            </div>
                            <h5 className='font-bold mb-0 ml-4 text-lg'>
                                Mensagens
                            </h5>
                        </div>
                        <p className='text-gray-500 text-sm'>
                            Converse com vendedores em tempo real.
                        </p>
                        <div className='text-3xl font-bold text-green-600'>0</div>
                    </div>
                </div>

                {/* Perfil Card */}
                <div>
                    <Link
                        to='/profile'
                        className='no-underline text-gray-900 block h-full'
                    >
                        <div className='bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow h-full'>
                            <div className='p-6'>
                                <div className='flex items-center mb-4'>
                                    <div
                                        className='bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center'
                                        style={{ width: 48, height: 48 }}
                                    >
                                        <i className='bi bi-person text-lg'></i>
                                    </div>
                                    <h5 className='font-bold mb-0 ml-4 text-lg'>
                                        Dados Pessoais
                                    </h5>
                                </div>
                                <p className='text-gray-500 text-sm'>
                                    Edite seu perfil e endereços de entrega.
                                </p>
                                <div className='text-3xl font-bold text-yellow-600'>
                                    <i className='bi bi-pencil-square text-base'></i>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Lista de Pedidos Recentes */}
            <div className='bg-white border border-gray-200 rounded-lg shadow p-6 mb-8'>
                <h4 className='font-bold mb-6 text-lg'>Pedidos Recentes</h4>
                {loading ? (
                    <div className='text-center py-4'>
                        <div className='inline-block animate-spin border-4 border-gray-300 border-t-blue-600 rounded-full text-2xl' style={{ width: '2rem', height: '2rem' }}></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className='text-center py-5 text-gray-500'>
                        <i className='bi bi-cart-x text-4xl opacity-25 block mb-3'></i>
                        Ainda não realizaste nenhum pedido.
                    </div>
                ) : (
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead>
                                <tr className='text-gray-500 text-sm border-b'>
                                    <th className='text-left py-3 px-4'>PEDIDO</th>
                                    <th className='text-left py-3 px-4'>DATA</th>
                                    <th className='text-left py-3 px-4'>LOJA</th>
                                    <th className='text-left py-3 px-4'>VALOR</th>
                                    <th className='text-left py-3 px-4'>STATUS</th>
                                    <th className='text-right py-3 px-4'>AÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id} className='border-b hover:bg-gray-50'>
                                        <td className='font-bold py-3 px-4'>#{order.id}</td>
                                        <td className='py-3 px-4'>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className='py-3 px-4'>{order.store?.name}</td>
                                        <td className='font-bold py-3 px-4'>
                                            {order.total.toLocaleString()} MT
                                        </td>
                                        <td className='py-3 px-4'>
                                            <span
                                                className={`px-3 py-1 ${order.status === 'entregue' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'} text-xs font-bold rounded`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className='text-right py-3 px-4'>
                                            <div className='flex justify-end gap-2'>
                                                <Link
                                                    to={`/orders/${order.id}/document?type=quote`}
                                                    className='border border-blue-600 text-blue-600 hover:bg-blue-50 p-2 rounded text-sm transition-colors'
                                                    title='Ver Cotação'
                                                >
                                                    <i className='bi bi-file-earmark-pdf'></i>
                                                </Link>
                                                <Link
                                                    to={`/orders/${order.id}/document?type=invoice`}
                                                    className='border border-gray-400 text-gray-600 hover:bg-gray-50 p-2 rounded text-sm transition-colors'
                                                    title='Ver Factura'
                                                >
                                                    <i className='bi bi-receipt'></i>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Destaque para Vendedores */}
            {!user?.role || user?.role === 'client' ? (
                <div className='mt-8 p-8 bg-gray-900 text-white rounded-3xl shadow-lg text-center relative overflow-hidden'>
                    <div className='relative z-10'>
                        <h2 className='font-bold mb-3 text-2xl'>
                            Quer vender na DUBANING?
                        </h2>
                        <p className='text-lg mb-6'>
                            Abra sua loja gratuitamente e alcance milhares de
                            clientes em Moçambique.
                        </p>
                        <Link
                            to='/seller/onboarding'
                            className='bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-gray-100 inline-block transition-colors'
                        >
                            Começar a Vender
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div
                        className='absolute top-0 right-0 bg-white opacity-10 rounded-full'
                        style={{
                            width: 300,
                            height: 300,
                            transform: 'translate(30%, -30%)',
                        }}
                    ></div>
                </div>
            ) : null}
        </div>
    );
}
