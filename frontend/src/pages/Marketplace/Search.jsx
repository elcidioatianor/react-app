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
        <div className='container py-5' style={{ marginTop: '70px' }}>
            <div className='row g-4'>
                {/* Filtros Sidebar */}
                <div className='col-lg-3'>
                    <div
                        className='card border-0 shadow-sm p-4 sticky-top'
                        style={{ top: '100px' }}
                    >
                        <h5 className='fw-bold mb-4'>Filtros</h5>

                        <div className='mb-4'>
                            <label className='form-label small fw-bold'>
                                Categoria
                            </label>
                            <select
                                className='form-select'
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

                        <div className='mb-4'>
                            <label className='form-label small fw-bold'>
                                Cidade
                            </label>
                            <select
                                className='form-select'
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

                        <div className='mb-4'>
                            <label className='form-label small fw-bold'>
                                Preço
                            </label>
                            <div className='d-flex gap-2'>
                                <input
                                    type='number'
                                    className='form-control'
                                    placeholder='Mínimo'
                                />
                                <input
                                    type='number'
                                    className='form-control'
                                    placeholder='Máximo'
                                />
                            </div>
                        </div>

                        <button
                            className='btn btn-outline-primary w-100'
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
                <div className='col-lg-9'>
                    <h4 className='fw-bold mb-4'>
                        {loading
                            ? 'Pesquisando...'
                            : `${products?.length || 0} resultados para "${query}"`}
                    </h4>

                    {loading ? (
                        <div className='text-center py-5'>
                            <div className='spinner-border text-primary'></div>
                        </div>
                    ) : !products || products.length === 0 ? (
                        <div className='text-center py-5 bg-light rounded-3'>
                            <i className='bi bi-search display-1 text-muted opacity-25 mb-4'></i>
                            <h5>Nenhum produto encontrado</h5>
                            <p className='text-muted'>
                                Tente usar outros termos ou limpe os filtros.
                            </p>
                        </div>
                    ) : (
                        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4'>
                            {products.map(product => (
                                <div className='col' key={product.id}>
                                    <Link
                                        to={`/product/${product.id}`}
                                        className='text-decoration-none text-dark'
                                    >
                                        <div className='card h-100 border-0 shadow-sm product-card'>
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
                                                    className='card-img-top h-100 object-fit-cover'
                                                    alt={product.name}
                                                />
                                            </div>
                                            <div className='card-body'>
                                                <small className='text-primary fw-bold'>
                                                    {product.category}
                                                </small>
                                                <h6 className='fw-bold mb-2 text-truncate'>
                                                    {product.name}
                                                </h6>
                                                <div className='fw-bold fs-5 text-primary'>
                                                    {(
                                                        product.price -
                                                        (product.discount || 0)
                                                    ).toLocaleString()}{' '}
                                                    MT
                                                </div>
                                                <div className='mt-2 d-flex align-items-center small text-muted'>
                                                    <i className='bi bi-geo-alt me-1'></i>{' '}
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
