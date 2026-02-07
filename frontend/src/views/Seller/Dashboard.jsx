import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import {
    Container,
    Row,
    Col,
    Card,
    Table,
    Button,
    Badge,
} from 'react-bootstrap';
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
    const api = useApi();
    const [stats, setStats] = useState({
        revenue: 0,
        orders: 0,
        products: 0,
        views: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

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
            pending: 'warning',
            shipped: 'info',
            delivered: 'success',
            cancelled: 'danger',
        };
        const labels = {
            pending: 'Pendente',
            shipped: 'Enviado',
            delivered: 'Entregue',
            cancelled: 'Cancelado',
        };
        return (
            <Badge bg={variants[status] || 'secondary'}>
                {labels[status] || status}
            </Badge>
        );
    };

    const StatCard = ({ title, value, icon, color, trend }) => (
        <Card className='border-0 shadow-sm h-100'>
            <Card.Body className='d-flex align-items-center justify-content-between'>
                <div>
                    <h6 className='text-muted small text-uppercase fw-bold mb-1'>
                        {title}
                    </h6>
                    <h3 className='mb-0 fw-bold'>{value}</h3>
                    {trend && (
                        <small
                            className={`d-flex align-items-center mt-2 ${trend > 0 ? 'text-success' : 'text-danger'}`}
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
                    className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color}`}
                >
                    {icon}
                </div>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className='px-0'>
            {/* Stats Grid */}
            <Row className='g-4 mb-4'>
                <Col md={3}>
                    <StatCard
                        title='Vendas Totais'
                        value={`${stats.revenue.toLocaleString()} MT`}
                        icon={<CurrencyDollar size={24} />}
                        color='success'
                        trend={12.5}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title='Pedidos'
                        value={stats.orders}
                        icon={<CartFill size={24} />}
                        color='primary'
                        trend={5.2}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title='Produtos Ativos'
                        value={stats.products}
                        icon={<BoxSeam size={24} />}
                        color='warning'
                        trend={-2.1}
                    />
                </Col>
                <Col md={3}>
                    <StatCard
                        title='Visitas da Loja'
                        value={stats.views}
                        icon={<PeopleFill size={24} />}
                        color='info'
                        trend={8.4}
                    />
                </Col>
            </Row>

            {/* Recent Orders Section */}
            <Card className='border-0 shadow-sm'>
                <Card.Header className='bg-white border-0 py-3 d-flex justify-content-between align-items-center'>
                    <h5 className='mb-0 fw-bold'>Pedidos Recentes</h5>
                    <Link
                        to='/seller/orders'
                        className='btn btn-sm btn-outline-primary rounded-pill'
                    >
                        Ver Todos
                    </Link>
                </Card.Header>
                <Card.Body className='p-0'>
                    <div className='table-responsive'>
                        <Table hover className='mb-0 align-middle'>
                            <thead className='bg-light'>
                                <tr>
                                    <th className='border-0 ps-4'>ID</th>
                                    <th className='border-0'>Cliente</th>
                                    <th className='border-0'>Data</th>
                                    <th className='border-0'>Total</th>
                                    <th className='border-0'>Status</th>
                                    <th className='border-0 text-end pe-4'>
                                        Ação
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td className='ps-4 fw-bold text-primary'>
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
                                        <td className='text-end pe-4'>
                                            <Button
                                                variant='light'
                                                size='sm'
                                                className='rounded-circle'
                                            >
                                                <i className='bi bi-three-dots-vertical'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default SellerDashboard;
