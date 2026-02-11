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
        <div className='container py-5' style={{ marginTop: '60px' }}>
            <div className='d-flex justify-content-between align-items-center mb-5'>
                <div>
                    <h1 className='fw-bold'>Minha Conta</h1>
                    <p className='text-muted'>
                        Bem-vindo de volta, {user?.name}
                    </p>
                </div>
                <Link to='/' className='btn btn-outline-primary'>
                    <i className='bi bi-arrow-left me-2'></i>
                    Continuar Comprando
                </Link>
            </div>

            <div className='row g-4 mb-5'>
                {/* Meus Pedidos Card */}
                <div className='col-md-4'>
                    <div className='card h-100 border-0 shadow-sm hover-card'>
                        <div className='card-body p-4'>
                            <div className='d-flex align-items-center mb-3'>
                                <div
                                    className='bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center'
                                    style={{ width: 48, height: 48 }}
                                >
                                    <i className='bi bi-box-seam fs-4'></i>
                                </div>
                                <h5 className='card-title fw-bold mb-0 ms-3'>
                                    Meus Pedidos
                                </h5>
                            </div>
                            <p className='card-text text-muted small'>
                                Gerencie suas compras e acompanhe o envio.
                            </p>
                            <div className='fs-3 fw-bold text-primary'>
                                {orders.length}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mensagens Card */}
                <div className='col-md-4'>
                    <div
                        className='card h-100 border-0 shadow-sm hover-card shadow-hover'
                        style={{ cursor: 'pointer' }}
                        onClick={() => alert('Chat em breve!')}
                    >
                        <div className='card-body p-4'>
                            <div className='d-flex align-items-center mb-3'>
                                <div
                                    className='bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center'
                                    style={{ width: 48, height: 48 }}
                                >
                                    <i className='bi bi-chat-dots fs-4'></i>
                                </div>
                                <h5 className='card-title fw-bold mb-0 ms-3'>
                                    Mensagens
                                </h5>
                            </div>
                            <p className='card-text text-muted small'>
                                Converse com vendedores em tempo real.
                            </p>
                            <div className='fs-3 fw-bold text-success'>0</div>
                        </div>
                    </div>
                </div>

                {/* Perfil Card */}
                <div className='col-md-4'>
                    <Link
                        to='/profile'
                        className='text-decoration-none text-dark'
                    >
                        <div className='card h-100 border-0 shadow-sm hover-card shadow-hover'>
                            <div className='card-body p-4'>
                                <div className='d-flex align-items-center mb-3'>
                                    <div
                                        className='bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center'
                                        style={{ width: 48, height: 48 }}
                                    >
                                        <i className='bi bi-person fs-4'></i>
                                    </div>
                                    <h5 className='card-title fw-bold mb-0 ms-3'>
                                        Dados Pessoais
                                    </h5>
                                </div>
                                <p className='card-text text-muted small'>
                                    Edite seu perfil e endereços de entrega.
                                </p>
                                <div className='fs-3 fw-bold text-warning'>
                                    <i className='bi bi-pencil-square fs-5'></i>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Lista de Pedidos Recentes */}
            <div className='card border-0 shadow-sm p-4 mb-5'>
                <h4 className='fw-bold mb-4'>Pedidos Recentes</h4>
                {loading ? (
                    <div className='text-center py-4'>
                        <div className='spinner-border text-primary'></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className='text-center py-5 text-muted'>
                        <i className='bi bi-cart-x fs-1 opacity-25 d-block mb-3'></i>
                        Ainda não realizaste nenhum pedido.
                    </div>
                ) : (
                    <div className='table-responsive'>
                        <table className='table table-hover align-middle'>
                            <thead>
                                <tr className='text-muted small'>
                                    <th>PEDIDO</th>
                                    <th>DATA</th>
                                    <th>LOJA</th>
                                    <th>VALOR</th>
                                    <th>STATUS</th>
                                    <th className='text-end'>AÇÃO</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map(order => (
                                    <tr key={order.id}>
                                        <td className='fw-bold'>#{order.id}</td>
                                        <td>
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString()}
                                        </td>
                                        <td>{order.store?.name}</td>
                                        <td className='fw-bold'>
                                            {order.total.toLocaleString()} MT
                                        </td>
                                        <td>
                                            <span
                                                className={`badge ${order.status === 'entregue' ? 'bg-success' : 'bg-primary'} bg-opacity-10 text-${order.status === 'entregue' ? 'success' : 'primary'}`}
                                            >
                                                {order.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className='text-end'>
                                            <div className='btn-group'>
                                                <Link
                                                    to={`/orders/${order.id}/document?type=quote`}
                                                    className='btn btn-sm btn-outline-primary'
                                                    title='Ver Cotação'
                                                >
                                                    <i className='bi bi-file-earmark-pdf'></i>
                                                </Link>
                                                <Link
                                                    to={`/orders/${order.id}/document?type=invoice`}
                                                    className='btn btn-sm btn-outline-dark'
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
                <div className='mt-5 p-5 bg-dark text-white rounded-3 shadow text-center position-relative overflow-hidden'>
                    <div className='position-relative z-1'>
                        <h2 className='fw-bold mb-3'>
                            Quer vender na DUBANING?
                        </h2>
                        <p className='lead mb-4'>
                            Abra sua loja gratuitamente e alcance milhares de
                            clientes em Moçambique.
                        </p>
                        <Link
                            to='/seller/onboarding'
                            className='btn btn-light btn-lg px-5 fw-bold text-primary'
                        >
                            Começar a Vender
                        </Link>
                    </div>
                    {/* Decorative Circle */}
                    <div
                        className='position-absolute top-0 end-0 bg-white opacity-10 rounded-circle'
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
