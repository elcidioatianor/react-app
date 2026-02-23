import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const api = useApi();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: '',
        city: '',
        minPrice: '',
        maxPrice: '',
    });
    //TODO: USE REACT QUERY
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await api.get('/products');
                const resData = res.data || [];
                let filtered = resData.filter(
                    p =>
                        p.name.toLowerCase().includes(query.toLowerCase()) ||
                        p.description
                            .toLowerCase()
                            .includes(query.toLowerCase())
                );

                if (filters.category) {
                    filtered = filtered.filter(
                        p => p.category === filters.category
                    );
                }
                if (filters.city) {
                    filtered = filtered.filter(
                        p => p.store?.city === filters.city
                    );
                }

                setProducts(filtered);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query, api, filters]);

    const categories = ['Tecnologia', 'Moda', 'Casa', 'Agro', 'Serviços'];
    const cities = ['Maputo', 'Matola', 'Beira', 'Nampula', 'Tete'];

    return (
        <div className='container mx-auto py-20' style={{ marginTop: '70px' }}>
            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                {/* Filtros Sidebar */}
                <div className='lg:col-span-1'>
                    <div
                        className='bg-white border border-gray-200 rounded-lg shadow-sm p-16 sticky'
                        style={{ top: '100px' }}
                    >
                        <h5 className='font-bold mb-16'>Filtros</h5>

                        <div className='mb-16'>
                            <label className='block text-sm font-bold text-gray-700 mb-2'>
                                Categoria
                            </label>
                            <select
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                value={filters.category}
                                onChange={e =>
                                    setFilters({
                                        ...filters,
                                        category: e.target.value,
                                    })
                                }
                            >
                                <option value=''>Todas</option>
                                {categories.map(c => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-16'>
                            <label className='block text-sm font-bold text-gray-700 mb-2'>
                                Cidade
                            </label>
                            <select
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                value={filters.city}
                                onChange={e =>
                                    setFilters({
                                        ...filters,
                                        city: e.target.value,
                                    })
                                }
                            >
                                <option value=''>Todo o país</option>
                                {cities.map(c => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className='mb-16'>
                            <label className='block text-sm font-bold text-gray-700 mb-2'>
                                Preço
                            </label>
                            <div className='flex gap-2'>
                                <input
                                    type='number'
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                    placeholder='Mínimo'
                                />
                                <input
                                    type='number'
                                    className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'
                                    placeholder='Máximo'
                                />
                            </div>
                        </div>

                        <button
                            className='w-full py-2 px-4 border border-blue-500 text-blue-500 font-bold rounded-lg hover:bg-blue-50 transition-colors'
                            onClick={() =>
                                setFilters({
                                    category: '',
                                    city: '',
                                    minPrice: '',
                                    maxPrice: '',
                                })
                            }
                        >
                            Limpar filtros
                        </button>
                    </div>
                </div>

                {/* Resultados */}
                <div className='lg:col-span-3'>
                    <h4 className='font-bold mb-16 text-2xl'>
                        {loading
                            ? 'Pesquisando...'
                            : `${products?.length || 0} resultados para "${query}"`}
                    </h4>

                    {loading ? (
                        <div className='text-center py-20'>
                            <div className='inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
                        </div>
                    ) : !products || products.length === 0 ? (
                        <div className='text-center py-20 bg-gray-100 rounded-lg'>
                            <i className='bi bi-search text-9xl text-gray-400 opacity-25 mb-16 block'></i>
                            <h5 className='font-bold text-lg mb-4'>Nenhum produto encontrado</h5>
                            <p className='text-gray-500'>
                                Tente usar outros termos ou limpe os filtros.
                            </p>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                            {products.map(product => (
                                <div className='col' key={product.id}>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className='no-underline text-black'
                                    >
                                        <div className='bg-white h-full border border-gray-200 rounded-lg shadow-sm overflow-hidden product-card hover:shadow-lg transition-shadow'>
                                            <div
                                                style={{
                                                    height: '180px',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <img
                                                    src={
                                                        product.images?.[0] ||
                                                        'https://via.placeholder.com/300x200'
                                                    }
                                                    className='w-full h-full object-cover'
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className='p-4'>
                                                <small className='text-blue-600 font-bold'>
                                                    {product.category}
                                                </small>
                                                <h6 className='font-bold mb-2 truncate'>
                                                    {product.name}
                                                </h6>
                                                <div className='font-bold text-xl text-blue-600'>
                                                    {(
                                                        product.price -
                                                        (product.discount || 0)
                                                    ).toLocaleString()}{' '}
                                                    MT
                                                </div>
                                                <div className='mt-2 flex items-center text-sm text-gray-500'>
                                                    <i className='bi bi-geo-alt mr-1'></i>{' '}
                                                    {product.store?.city ||
                                                        'Maputo'}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .product-card { transition: transform 0.2s; }
                .product-card:hover { transform: translateY(-5px); }
            `}</style>
        </div>
    );
}

export default Search;
