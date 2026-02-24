import { useState, useEffect } from 'react';
import { useApi } from '../../hooks/useApi';
import {
    Search,
    Filter,
    ThreeDotsVertical,
    Eye,
    Truck,
    CheckCircle,
} from 'react-bootstrap-icons';
import { useNotification } from '../../hooks/useNotification';

function OrderManager() {
    const api = useApi();
    const { showNotification } = useNotification();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/store');
                setOrders(res.data);
            } catch (error) {
                console.error('Failed to load orders', error);
                showNotification('Erro ao carregar pedidos', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [api, showNotification]);

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
            showNotification('Status atualizado com sucesso', 'success');
        } catch (error) {
            console.error('Update failed', error);
            showNotification('Erro ao atualizar status', 'error');
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
            novo: { bg: 'bg-blue-500', text: 'text-white', textLabel: 'Novo', icon: null },
            confirmado: { bg: 'bg-blue-100', text: 'text-blue-800', textLabel: 'Confirmado', icon: null },
            preparacao: { bg: 'bg-yellow-100', text: 'text-yellow-800', textLabel: 'Preparação', icon: null },
            enviado: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                textLabel: 'Enviado',
                icon: <Truck className='w-3 h-3 mr-1' />,
            },
            entregue: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                textLabel: 'Entregue',
                icon: <CheckCircle className='w-3 h-3 mr-1' />,
            },
            cancelado: { bg: 'bg-red-100', text: 'text-red-800', textLabel: 'Cancelado', icon: null },
            // Fallbacks for compatibility
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', textLabel: 'Pendente', icon: null },
            shipped: {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                textLabel: 'Enviado',
                icon: <Truck className='w-3 h-3 mr-1' />,
            },
            delivered: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                textLabel: 'Entregue',
                icon: <CheckCircle className='w-3 h-3 mr-1' />,
            },
            cancelled: { bg: 'bg-red-100', text: 'text-red-800', textLabel: 'Cancelado', icon: null },
        };
        const style = styles[status] || { bg: 'bg-gray-100', text: 'text-gray-800', textLabel: status };

        return (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
                {style.icon}
                {style.textLabel}
            </span>
        );
    };

    return (
        <div className="w-full p-4 bg-gray-50 min-h-screen">
            <h4 className="text-2xl font-bold mb-4 text-gray-900">Gestão de Pedidos</h4>

            <div className="bg-white shadow-lg rounded-lg p-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div className="relative max-w-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar pedido ou cliente..."
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <select
                            className="block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="novo">Novo</option>
                            <option value="confirmado">Confirmado</option>
                            <option value="preparacao">Em Preparação</option>
                            <option value="enviado">Enviado</option>
                            <option value="entregue">Entregue</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                        <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Filter className="w-4 h-4 mr-2" /> Filtrar
                        </button>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 border-collapse">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider">ID Pedido</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider">Data</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider text-center">Itens</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider text-right">Total</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-3 font-medium text-gray-900 uppercase tracking-wider text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        Carregando...
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-4 text-center">
                                        Nenhum pedido encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-600">
                                            #{order.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs">
                                                    {(order.customerName || 'C').charAt(0)}
                                                </div>
                                                {order.customerName || 'Cliente'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                                                {order.items?.length || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold">
                                            {Number(order.total).toLocaleString()} MT
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            {getStatusBadge(order.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right relative">
                                            <button
                                                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                onClick={() => setOpenDropdown(openDropdown === order.id ? null : order.id)}
                                            >
                                                <ThreeDotsVertical className="w-4 h-4" />
                                            </button>
                                            {openDropdown === order.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                                        <Eye className="w-4 h-4 mr-2" /> Detalhes
                                                    </button>
                                                    {order.status === 'novo' && (
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                            onClick={() => handleStatusChange(order.id, 'confirmado')}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar
                                                        </button>
                                                    )}
                                                    {order.status === 'confirmado' && (
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                            onClick={() => handleStatusChange(order.id, 'preparacao')}
                                                        >
                                                            <Truck className="w-4 h-4 mr-2" /> Preparar
                                                        </button>
                                                    )}
                                                    {order.status === 'preparacao' && (
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                            onClick={() => handleStatusChange(order.id, 'enviado')}
                                                        >
                                                            <Truck className="w-4 h-4 mr-2" /> Enviar
                                                        </button>
                                                    )}
                                                    {order.status === 'enviado' && (
                                                        <button
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                                            onClick={() => handleStatusChange(order.id, 'entregue')}
                                                        >
                                                            <CheckCircle className="w-4 h-4 mr-2" /> Confirmar Entrega
                                                        </button>
                                                    )}
                                                    <div className="border-t border-gray-200"></div>
                                                    <button
                                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                                                        onClick={() => handleStatusChange(order.id, 'cancelado')}
                                                    >
                                                        Cancelar Pedido
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default OrderManager;
