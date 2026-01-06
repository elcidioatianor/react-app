import { useState, useEffect } from "react";
import { useApi } from "../../hooks/useApi";
import { useNotification } from "../../contexts/NotificationContext";

export function OrderManager() {
    const api = useApi();
    const { addNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get('/orders/store');
            setOrders(res.data);
        } catch (error) {
            addNotification("Erro ao carregar pedidos", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/orders/${id}/status`, { status });
            addNotification("Status atualizado", "success");
            fetchOrders();
        } catch (error) {
            addNotification("Erro ao atualizar", "error");
        }
    };

    const getStatusBadge = (status) => {
        const maps = {
            'novo': 'bg-primary',
            'confirmado': 'bg-info',
            'preparacao': 'bg-warning',
            'enviado': 'bg-dark',
            'entregue': 'bg-success',
            'cancelado': 'bg-danger'
        };
        return <span className={`badge ${maps[status] || 'bg-secondary'}`}>{status.toUpperCase()}</span>;
    };

    if (loading) return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary"></div>
        </div>
    );

    return (
        <div className="container py-4">
            <h2 className="fw-bold mb-4">Gerenciador de Pedidos</h2>

            <div className="card border-0 shadow-sm overflow-hidden">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">Pedido #</th>
                                <th>Data</th>
                                <th>Cliente</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Pagamento</th>
                                <th className="text-end pe-4">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5 text-muted">Ainda não recebeste pedidos.</td>
                                </tr>
                            ) : orders.map(order => (
                                <tr key={order.id}>
                                    <td className="ps-4 fw-bold text-primary">#{order.id}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className="fw-bold">{order.customerName}</div>
                                        <small className="text-muted">{order.customerPhone}</small>
                                    </td>
                                    <td className="fw-bold">{order.total.toLocaleString()} MT</td>
                                    <td>{getStatusBadge(order.status)}</td>
                                    <td>
                                        <span className={`badge bg-opacity-10 ${order.paymentStatus === 'pago' ? 'bg-success text-success' : 'bg-warning text-warning'}`}>
                                            {order.paymentMethod} - {order.paymentStatus}
                                        </span>
                                    </td>
                                    <td className="text-end pe-4">
                                        <div className="dropdown">
                                            <button className="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                                                Status
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end shadow border-0">
                                                <li><button className="dropdown-item" onClick={() => updateStatus(order.id, 'confirmado')}>Confirmar</button></li>
                                                <li><button className="dropdown-item" onClick={() => updateStatus(order.id, 'preparacao')}>Em Preparação</button></li>
                                                <li><button className="dropdown-item" onClick={() => updateStatus(order.id, 'enviado')}>Enviado</button></li>
                                                <li><button className="dropdown-item" onClick={() => updateStatus(order.id, 'entregue')}>Entregue</button></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><button className="dropdown-item text-danger" onClick={() => updateStatus(order.id, 'cancelado')}>Cancelar</button></li>
                                            </ul>
                                        </div>
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
