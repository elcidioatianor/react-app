import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import {
    Container,
    Card,
    Table,
    Badge,
    Button,
    Form,
    InputGroup,
    Dropdown,
    Row,
    Col,
} from 'react-bootstrap';
import {
    Search,
    Filter,
    ThreeDotsVertical,
    Eye,
    Truck,
    CheckCircle,
} from 'react-bootstrap-icons';
import { useNotification } from '../../contexts/NotificationContext';

function OrderManager() {
    const api = useApi();
    const { addNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/store');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to load orders', error);
                addNotification('Erro ao carregar pedidos', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        // Optimistic update
        const previousOrders = [...orders];
        setOrders(
            orders.map(o =>
                o.id === orderId ? { ...o, status: newStatus } : o
            )
        );

        try {
            await api.patch(`/orders/${orderId}/status`, { status: newStatus });
            addNotification('Status atualizado com sucesso', 'success');
        } catch (error) {
            console.error('Update failed', error);
            addNotification('Erro ao atualizar status', 'error');
            setOrders(previousOrders); // Revert
        }
    };

    const filteredOrders = orders.filter(order => {
        const customerName = order.customerName || '';
        const matchesSearch =
            String(order.id).includes(searchTerm) ||
            customerName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = status => {
        const styles = {
            novo: { bg: 'primary', text: 'Novo', icon: null },
            confirmado: { bg: 'info', text: 'Confirmado', icon: null },
            preparacao: { bg: 'warning', text: 'Preparação', icon: null },
            enviado: {
                bg: 'secondary',
                text: 'Enviado',
                icon: <Truck className='me-1' />,
            },
            entregue: {
                bg: 'success',
                text: 'Entregue',
                icon: <CheckCircle className='me-1' />,
            },
            cancelado: { bg: 'danger', text: 'Cancelado', icon: null },
            // Fallbacks for compatibility
            pending: { bg: 'warning', text: 'Pendente', icon: null },
            shipped: {
                bg: 'info',
                text: 'Enviado',
                icon: <Truck className='me-1' />,
            },
            delivered: {
                bg: 'success',
                text: 'Entregue',
                icon: <CheckCircle className='me-1' />,
            },
            cancelled: { bg: 'danger', text: 'Cancelado', icon: null },
        };
        const style = styles[status] || { bg: 'secondary', text: status };

        return (
            <Badge
                bg={style.bg}
                className='d-flex align-items-center justify-content-center text-capitalize'
                style={{ width: 'fit-content' }}
            >
                {style.icon}
                {style.text}
            </Badge>
        );
    };

    return (
        <Container fluid className='px-0'>
            <h4 className='fw-bold mb-4'>Gestão de Pedidos</h4>

            <Card className='border-0 shadow-sm'>
                <Card.Body>
                    {/* Filters */}
                    <div className='d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4'>
                        <InputGroup style={{ maxWidth: '300px' }}>
                            <InputGroup.Text className='bg-white border-end-0'>
                                <Search className='text-muted' />
                            </InputGroup.Text>
                            <Form.Control
                                placeholder='Buscar pedido ou cliente...'
                                className='border-start-0 ps-0'
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </InputGroup>

                        <div className='d-flex gap-2'>
                            <Form.Select
                                style={{ width: 'auto' }}
                                value={statusFilter}
                                onChange={e => setStatusFilter(e.target.value)}
                            >
                                <option value='all'>Todos os Status</option>
                                <option value='novo'>Novo</option>
                                <option value='confirmado'>Confirmado</option>
                                <option value='preparacao'>
                                    Em Preparação
                                </option>
                                <option value='enviado'>Enviado</option>
                                <option value='entregue'>Entregue</option>
                                <option value='cancelado'>Cancelado</option>
                            </Form.Select>
                            <Button variant='outline-secondary'>
                                <Filter /> Filtrar
                            </Button>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className='table-responsive'>
                        <Table hover className='align-middle'>
                            <thead className='bg-light'>
                                <tr>
                                    <th className='border-0 ps-3'>ID Pedido</th>
                                    <th className='border-0'>Cliente</th>
                                    <th className='border-0'>Data</th>
                                    <th className='border-0 text-center'>
                                        Itens
                                    </th>
                                    <th className='border-0 text-end'>Total</th>
                                    <th className='border-0 text-center'>
                                        Status
                                    </th>
                                    <th className='border-0 text-end pe-3'>
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td
                                            colSpan='7'
                                            className='text-center py-5'
                                        >
                                            Carregando...
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan='7'
                                            className='text-center py-5'
                                        >
                                            Nenhum pedido encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className='ps-3 fw-bold text-primary'>
                                                #{order.id}
                                            </td>
                                            <td>
                                                <div className='d-flex align-items-center gap-2'>
                                                    <div
                                                        className='rounded-circle bg-light d-flex align-items-center justify-content-center text-muted fw-bold'
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {(
                                                            order.customerName ||
                                                            'C'
                                                        ).charAt(0)}
                                                    </div>
                                                    {order.customerName ||
                                                        'Cliente'}
                                                </div>
                                            </td>
                                            <td className='text-muted small'>
                                                {order.createdAt
                                                    ? new Date(
                                                          order.createdAt
                                                      ).toLocaleDateString()
                                                    : '-'}
                                            </td>
                                            <td className='text-center'>
                                                <Badge
                                                    bg='light'
                                                    text='dark'
                                                    className='border rounded-pill'
                                                >
                                                    {order.items?.length || 0}
                                                </Badge>
                                            </td>
                                            <td className='text-end fw-bold'>
                                                {Number(
                                                    order.total
                                                ).toLocaleString()}{' '}
                                                MT
                                            </td>
                                            <td>
                                                <div className='d-flex justify-content-center'>
                                                    {getStatusBadge(
                                                        order.status
                                                    )}
                                                </div>
                                            </td>
                                            <td className='text-end pe-3'>
                                                <Dropdown align='end'>
                                                    <Dropdown.Toggle
                                                        variant='light'
                                                        size='sm'
                                                        className='rounded-circle no-caret'
                                                    >
                                                        <ThreeDotsVertical />
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item href='#'>
                                                            <Eye className='me-2' />{' '}
                                                            Detalhes
                                                        </Dropdown.Item>
                                                        {order.status ===
                                                            'novo' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        'confirmado'
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle className='me-2' />{' '}
                                                                Confirmar
                                                            </Dropdown.Item>
                                                        )}
                                                        {order.status ===
                                                            'confirmado' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        'preparacao'
                                                                    )
                                                                }
                                                            >
                                                                <Truck className='me-2' />{' '}
                                                                Preparar
                                                            </Dropdown.Item>
                                                        )}
                                                        {order.status ===
                                                            'preparacao' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        'enviado'
                                                                    )
                                                                }
                                                            >
                                                                <Truck className='me-2' />{' '}
                                                                Enviar
                                                            </Dropdown.Item>
                                                        )}
                                                        {order.status ===
                                                            'enviado' && (
                                                            <Dropdown.Item
                                                                onClick={() =>
                                                                    handleStatusChange(
                                                                        order.id,
                                                                        'entregue'
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle className='me-2' />{' '}
                                                                Confirmar
                                                                Entrega
                                                            </Dropdown.Item>
                                                        )}
                                                        <Dropdown.Divider />
                                                        <Dropdown.Item
                                                            className='text-danger'
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    order.id,
                                                                    'cancelado'
                                                                )
                                                            }
                                                        >
                                                            Cancelar Pedido
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default OrderManager;
