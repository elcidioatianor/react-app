import { Link } from 'react-router-dom';

function NotFound() {
    return (
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center'>
            <h1 className='text-6xl font-thin text-blue-600'>404</h1>

            <h2 className='mb-3 font-semibold text-2xl'>Opá! Página não encontrada.</h2>

            <p className='text-gray-600 mb-4 max-w-md'>
                A página que tentou aceder não existe, foi removida, teve o URL
                alterado ou está temporariamente indisponível.
            </p>

            <Link className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium' to='/'>
                Voltar para o início
            </Link>
        </div>
    );
}

export default NotFound;
