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
    }, [id, api]);

    if (loading)
        return <div className='p-5 text-center'>Gerando Documento...</div>;
    if (!order)
        return (
            <div className='p-5 text-center text-red-600'>
                Pedido não encontrado
            </div>
        );

    const print = () => window.print();

    return (
        <div
            className='bg-white p-0 lg:p-5 min-h-screen'
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

            <div className='no-print max-w-7xl mx-auto mb-4'>
                <div className='flex justify-between items-center bg-gray-100 p-3 rounded-md'>
                    <h5 className='mb-0 font-bold text-xl'>
                        {type === 'quote'
                            ? 'Visualização de Cotação'
                            : 'Visualização de Factura'}
                    </h5>
                    <button className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700' onClick={print}>
                        <i className='bi bi-printer me-2'></i>Imprimir / Salvar
                        PDF
                    </button>
                </div>
            </div>

            <div className='invoice-box bg-white'>
                <div className='flex justify-between mb-5'>
                    <div>
                        <h1 className='font-bold text-blue-600 mb-0'>DUBANING</h1>
                        <small className='text-gray-500'>
                            Marketplace Digital de Moçambique
                        </small>
                    </div>
                    <div className='text-right'>
                        <h3 className='font-bold uppercase'>
                            {type === 'quote' ? 'Cotação' : 'Factura'}
                        </h3>
                        <div className='font-bold'>#{order.id}</div>
                        <div>
                            Data:{' '}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 mb-5'>
                    <div>
                        <h6 className='font-bold border-b pb-2'>Vendedor</h6>
                        <div className='font-bold'>{order.store?.name}</div>
                        <div className='text-gray-500 text-sm'>
                            {order.store?.city}, Moçambique
                        </div>
                    </div>
                    <div className='text-right'>
                        <h6 className='font-bold border-b pb-2'>
                            Comprador
                        </h6>
                        <div className='font-bold'>{order.customerName}</div>
                        <div className='text-gray-500 text-sm'>
                            {order.customerPhone}
                        </div>
                        <div className='text-gray-500 text-sm'>
                            {order.customerAddress}
                        </div>
                    </div>
                </div>

                <table className='table w-full mt-4 border-collapse border border-gray-300'>
                    <thead className='bg-gray-100'>
                        <tr>
                            <th className='border border-gray-300 px-4 py-2 text-left'>Descrição</th>
                            <th className='border border-gray-300 px-4 py-2 text-center'>Qtd</th>
                            <th className='border border-gray-300 px-4 py-2 text-right'>Preço Unit.</th>
                            <th className='border border-gray-300 px-4 py-2 text-right'>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items?.map(item => (
                            <tr key={item.id}>
                                <td className='border border-gray-300 px-4 py-2'>{item.productName}</td>
                                <td className='border border-gray-300 px-4 py-2 text-center'>{item.quantity}</td>
                                <td className='border border-gray-300 px-4 py-2 text-right'>
                                    {item.price.toLocaleString()} MT
                                </td>
                                <td className='border border-gray-300 px-4 py-2 text-right'>
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}{' '}
                                    MT
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='flex justify-end mt-5'>
                    <div className='w-full md:w-2/5'>
                        <div className='flex justify-between mb-2'>
                            <span>Subtotal:</span>
                            <span>{order.total.toLocaleString()} MT</span>
                        </div>
                        <div className='flex justify-between mb-2'>
                            <span>Entrega:</span>
                            <span>Grátis</span>
                        </div>
                        <div className='flex justify-between border-t pt-2 mt-2 text-2xl font-bold text-blue-600'>
                            <span>Total:</span>
                            <span>{order.total.toLocaleString()} MT</span>
                        </div>
                    </div>
                </div>

                <div className='mt-5 pt-5 border-t'>
                    <h6 className='font-bold mb-3'>
                        Notas & Informações de Pagamento
                    </h6>
                    <p className='text-gray-500 text-sm'>
                        Este documento foi gerado automaticamente pelo portal
                        DUBANING. Pagamentos aceites via M-Pesa (84/85), e-Mola
                        (86/87) ou no ato da entrega.
                    </p>
                    <div className='text-center mt-5'>
                        <small className='text-gray-500'>
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
