import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

function DocumentViewer() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'quote';
    const api = useApi();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await api.get('/orders/my');
                const found = res.data.find(o => o.id === parseInt(id));
                setOrder(found);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading)
        return <div className='p-5 text-center'>Gerando Documento...</div>;
    if (!order)
        return (
            <div className='p-5 text-center text-danger'>
                Pedido não encontrado
            </div>
        );

    const print = () => window.print();

    return (
        <div
            className='bg-white p-0 p-lg-5 min-vh-100'
            style={{ marginTop: '70px' }}
        >
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body { margin: 0; padding: 0; }
                    .invoice-box { box-shadow: none !important; border: none !important; width: 100% !important; margin: 0 !important; }
                }
                .invoice-box {
                    max-width: 800px;
                    margin: auto;
                    padding: 40px;
                    border: 1px solid #eee;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
                    font-size: 16px;
                    line-height: 1.6;
                    color: #333;
                }
            `}</style>

            <div className='no-print container mb-4'>
                <div className='d-flex justify-content-between align-items-center bg-light p-3 rounded-3'>
                    <h5 className='mb-0 fw-bold'>
                        {type === 'quote'
                            ? 'Visualização de Cotação'
                            : 'Visualização de Factura'}
                    </h5>
                    <button className='btn btn-primary' onClick={print}>
                        <i className='bi bi-printer me-2'></i>Imprimir / Salvar
                        PDF
                    </button>
                </div>
            </div>

            <div className='invoice-box bg-white'>
                <div className='d-flex justify-content-between mb-5'>
                    <div>
                        <h1 className='fw-bold text-primary mb-0'>DUBANING</h1>
                        <small className='text-muted'>
                            Marketplace Digital de Moçambique
                        </small>
                    </div>
                    <div className='text-end'>
                        <h3 className='fw-bold text-uppercase'>
                            {type === 'quote' ? 'Cotação' : 'Factura'}
                        </h3>
                        <div className='fw-bold'>#{order.id}</div>
                        <div>
                            Data:{' '}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className='row mb-5'>
                    <div className='col-6'>
                        <h6 className='fw-bold border-bottom pb-2'>Vendedor</h6>
                        <div className='fw-bold'>{order.store?.name}</div>
                        <div className='text-muted small'>
                            {order.store?.city}, Moçambique
                        </div>
                    </div>
                    <div className='col-6 text-end'>
                        <h6 className='fw-bold border-bottom pb-2'>
                            Comprador
                        </h6>
                        <div className='fw-bold'>{order.customerName}</div>
                        <div className='text-muted small'>
                            {order.customerPhone}
                        </div>
                        <div className='text-muted small'>
                            {order.customerAddress}
                        </div>
                    </div>
                </div>

                <table className='table mt-4'>
                    <thead className='table-light'>
                        <tr>
                            <th>Descrição</th>
                            <th className='text-center'>Qtd</th>
                            <th className='text-end'>Preço Unit.</th>
                            <th className='text-end'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map(item => (
                            <tr key={item.id}>
                                <td>{item.productName}</td>
                                <td className='text-center'>{item.quantity}</td>
                                <td className='text-end'>
                                    {item.price.toLocaleString()} MT
                                </td>
                                <td className='text-end'>
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}{' '}
                                    MT
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='row justify-content-end mt-5'>
                    <div className='col-md-5'>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Subtotal:</span>
                            <span>{order.total.toLocaleString()} MT</span>
                        </div>
                        <div className='d-flex justify-content-between mb-2'>
                            <span>Entrega:</span>
                            <span>Grátis</span>
                        </div>
                        <div className='d-flex justify-content-between border-top pt-2 mt-2 fs-4 fw-bold text-primary'>
                            <span>Total:</span>
                            <span>{order.total.toLocaleString()} MT</span>
                        </div>
                    </div>
                </div>

                <div className='mt-5 pt-5 border-top'>
                    <h6 className='fw-bold mb-3'>
                        Notas & Informações de Pagamento
                    </h6>
                    <p className='text-muted small'>
                        Este documento foi gerado automaticamente pelo portal
                        DUBANING. Pagamentos aceites via M-Pesa (84/85), e-Mola
                        (86/87) ou no ato da entrega.
                    </p>
                    <div className='text-center mt-5'>
                        <small className='text-muted'>
                            Obrigado por utilizar a DUBANING - O Mercado na sua
                            mão.
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DocumentViewer;
