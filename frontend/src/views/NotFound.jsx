import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center'>
            <h1 className='display-1 fw-thin text-primary'>404</h1>

            <h2 className='mb-3 fw-semibold'>Opá! Página não encontrada.</h2>

            <p className='text-muted mb-4' style={{ maxWidth: '420px' }}>
                A página que tentou aceder não existe, foi removida, teve o URL
                alterado ou está temporariamente indisponível.
            </p>

            <Link className='btn btn-primary btn-sm px-4' to='/'>
                Voltar para o início
            </Link>
        </div>
    );
}

export default NotFound;
