import { useState, useEffect } from 'react';
//import { useApi } from '../../hooks/useApi';
import { Link } from 'react-router-dom';
import {
    CurrencyDollar,
    CartFill,
    BoxSeam,
    PeopleFill,
    ArrowUpRight,
    ArrowDownRight,
} from 'react-bootstrap-icons';

function SellerDashboard() {
    //const api = useApi();
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        views: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [, setLoading] = useState(true);

    useEffect(() => {
        // Mock data loading - Replace with real API calls later
        const loadDashboardData = async () => {
            try {
                // await api.get('/seller/stats');
                setStats({
                    revenue: 125000,
                    orders: 45,
                    products: 12,
                    views: 1250,
                });

                setRecentOrders([
                    {
                        id: 'ORD-001',
                        customer: 'João Silva',
                        date: '2026-01-07',
                        total: 4500,
                        status: 'pending',
                    },
                    {
                        id: 'ORD-002',
                        customer: 'Maria Santos',
                        date: '2026-01-06',
                        total: 2100,
                        status: 'shipped',
                    },
                    {
                        id: 'ORD-003',
                        customer: 'Pedro M.',
                        date: '2026-01-06',
                        total: 15000,
                        status: 'delivered',
                    },
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadDashboardData();
    }, []);

    const StatusBadge = ({ status }) => {
        const variants = {
            pending: 'bg-yellow-100 text-yellow-800',
            shipped: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        const labels = {
            pending: 'Pendente',
            shipped: 'Enviado',
            delivered: 'Entregue',
            cancelled: 'Cancelado',
        };
        return (
            <span className={`px-3 py-1 rounded text-xs font-bold ${variants[status] || 'bg-gray-100 text-gray-800'}`}>
                {labels[status] || status}
            </span>
        );
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <div className='bg-white rounded-lg shadow-sm h-full'>
            <div className='p-6 flex items-center justify-between'>
                <div>
                    <h6 className='text-gray-500 text-sm uppercase font-bold mb-1'>
                        {title}
                    </h6>
                    <h3 className='mb-0 font-bold'>{value}</h3>
                    {trend && (
                        <small
                            className={`flex items-center mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {trend > 0 ? (
                                <ArrowUpRight className='me-1' />
                            ) : (
                                <ArrowDownRight className='me-1' />
                            )}
                            {Math.abs(trend)}% vs mês passado
                        </small>
                    )}
                </div>
                <div
                    className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className='px-4 py-8 max-w-7xl mx-auto'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                <div>
                    <StatCard
                        title='Vendas Totais'
                        value={`${stats.revenue.toLocaleString()} MT`}
                        icon={<CurrencyDollar size={24} />}
                        color='success'
                        trend={12.5}
                    />
                </div>
                <div>
                    <StatCard
                        title='Pedidos'
                        value={stats.orders}
                        icon={<CartFill size={24} />}
                        color='primary'
                        trend={5.2}
                    />
                </div>
                <div>
                    <StatCard
                        title='Produtos Ativos'
                        value={stats.products}
                        icon={<BoxSeam size={24} />}
                        color='warning'
                        trend={-2.1}
                    />
                </div>
                <div>
                    <StatCard
                        title='Visitas da Loja'
                        value={stats.views}
                        icon={<PeopleFill size={24} />}
                        color='info'
                        trend={8.4}
                    />
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className='bg-white border border-gray-200 rounded-lg shadow'>
                <div className='bg-white border-b border-gray-200 p-6 flex justify-between items-center'>
                    <h5 className='mb-0 font-bold text-lg'>Pedidos Recentes</h5>
                    <Link
                        to='/seller/orders'
                        className='border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-bold text-sm transition-colors'
                    >
                        Ver Todos
                    </Link>
                </div>
                <div className='p-0'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='border-0 pl-6'>ID</th>
                                    <th className='border-0'>Cliente</th>
                                    <th className='border-0'>Data</th>
                                    <th className='border-0'>Total</th>
                                    <th className='border-0'>Status</th>
                                    <th className='border-0 text-right pr-6'>
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className='pl-6 font-bold text-blue-600'>
                                            #{order.id}
                                        </td>
                                        <td>{order.customer}</td>
                                        <td>{order.date}</td>
                                        <td>
                                            {order.total.toLocaleString()} MT
                                        </td>
                                        <td>
                                            <StatusBadge
                                                status={order.status}
                                            />
                                        </td>
                                        <td className='text-right pr-6'>
                                            <button
                                                className='bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-sm transition-colors'
                                            >
                                                <i className='bi bi-three-dots-vertical'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboard;
