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
        <div className='bg-white rounded-lg shadow-sm h-full border border-gray-100 hover:shadow-md transition-shadow'>
            <div className='p-8 flex items-center justify-between'>
                <div className='flex-1'>
                    <h6 className='text-gray-600 text-xs uppercase font-bold mb-2 tracking-wide'>
                        {title}
                    </h6>
                    <h3 className='mb-0 font-bold text-2xl text-gray-900'>{value}</h3>
                    {trend && (
                        <small
                            className={`flex items-center mt-3 text-sm font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}
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
                    className={`p-4 rounded-full bg-${color}-100 text-${color}-600 ml-4`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className='px-6 py-8 md:px-8 max-w-7xl mx-auto'>
            {/* Stats Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
                <div>
                    <StatCard
                        title='Vendas Totais'
                        value={`${stats.revenue.toLocaleString()} MT`}
                        icon={<CurrencyDollar size={28} />}
                        color='success'
                        trend={12.5}
                    />
                </div>
                <div>
                    <StatCard
                        title='Pedidos'
                        value={stats.orders}
                        icon={<CartFill size={28} />}
                        color='primary'
                        trend={5.2}
                    />
                </div>
                <div>
                    <StatCard
                        title='Produtos Ativos'
                        value={stats.products}
                        icon={<BoxSeam size={28} />}
                        color='warning'
                        trend={-2.1}
                    />
                </div>
                <div>
                    <StatCard
                        title='Visitas da Loja'
                        value={stats.views}
                        icon={<PeopleFill size={28} />}
                        color='info'
                        trend={8.4}
                    />
                </div>
            </div>

            {/* Recent Orders Section */}
            <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
                <div className='bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center'>
                    <h5 className='mb-0 font-bold text-lg text-gray-900'>Pedidos Recentes</h5>
                    <Link
                        to='/seller/orders'
                        className='border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-full font-bold text-sm transition-colors'
                    >
                        Ver Todos
                    </Link>
                </div>
                <div className='overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-t border-b border-gray-200'>
                            <tr>
                                <th className='border-0 pl-8 text-left py-4 font-bold text-gray-700 text-sm'>ID</th>
                                <th className='border-0 text-left py-4 font-bold text-gray-700 text-sm'>Cliente</th>
                                <th className='border-0 text-left py-4 font-bold text-gray-700 text-sm'>Data</th>
                                <th className='border-0 text-left py-4 font-bold text-gray-700 text-sm'>Total</th>
                                <th className='border-0 text-left py-4 font-bold text-gray-700 text-sm'>Status</th>
                                <th className='border-0 text-right pr-8 py-4 font-bold text-gray-700 text-sm'>
                                    Ação
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order, idx) => (
                                <tr key={order.id} className={idx !== recentOrders.length - 1 ? 'border-b border-gray-100' : ''}>
                                    <td className='pl-8 py-4 font-bold text-blue-600 text-sm'>
                                        #{order.id}
                                    </td>
                                    <td className='py-4 text-gray-800 text-sm'>{order.customer}</td>
                                    <td className='py-4 text-gray-600 text-sm'>{order.date}</td>
                                    <td className='py-4 font-bold text-gray-900 text-sm'>
                                        {order.total.toLocaleString()} MT
                                    </td>
                                    <td className='py-4'>
                                        <StatusBadge
                                            status={order.status}
                                        />
                                    </td>
                                    <td className='text-right pr-8 py-4'>
                                        <button
                                            className='bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-sm transition-colors text-gray-600'
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
    );
}

export default SellerDashboard;
