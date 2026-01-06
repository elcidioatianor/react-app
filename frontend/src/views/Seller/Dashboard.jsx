import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useApi } from "../../hooks/useApi";

export function SellerDashboard() {
    const api = useApi();
    const [stats, setStats] = useState({
        ordersToday: 0,
        salesMonth: 0,
        activeProducts: 0,
        rating: 5.0
    });
    const [store, setStore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // Load Store Data
            // In a real implementation this would fetch from /stores/my-store
            // For now specific implementation pending backend connection
            const storeRes = await api.get('/stores/my-store');
            setStore(storeRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
    }

    if (!store) {
        return (
            <div className="container py-5 text-center">
                <i className="bi bi-shop display-1 text-muted mb-4"></i>
                <h2 className="mb-3">Você ainda não tem uma loja</h2>
                <p className="text-muted mb-4">Crie sua loja agora para começar a vender na DUBANING.</p>
                <Link to="/seller/onboarding" className="btn btn-primary btn-lg px-5">
                    Criar Minha Loja
                </Link>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <h2 className="mb-4">Visão Geral</h2>

            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2">Pedidos Hoje</h6>
                            <h3 className="mb-0">{stats.ordersToday}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2">Vendas (Mês)</h6>
                            <h3 className="mb-0">{stats.salesMonth} MT</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2">Produtos Ativos</h6>
                            <h3 className="mb-0">{stats.activeProducts}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2">Avaliação</h6>
                            <h3 className="mb-0 text-warning">
                                {stats.rating} <i className="bi bi-star-fill fs-6"></i>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Últimos Pedidos</h5>
                        </div>
                        <div className="card-body text-center py-5 text-muted">
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                            Nenhum pedido recente
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0">Alertas</h5>
                        </div>
                        <div className="list-group list-group-flush">
                            <div className="list-group-item">Bem-vindo à DUBANING!</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
