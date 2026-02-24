import { useRouteError, Link } from 'react-router-dom';

//Este componente captura erros inesperados de runtime
//nas rotas
function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);

    //Refatorar isso
    return (
        <div className='flex flex-col justify-center items-center min-h-screen bg-gray-100 text-center'>
            <h1 className='text-6xl font-bold text-blue-600'>Oops!</h1>

            <h2 className='mb-3 font-semibold text-2xl'>Erro Interno</h2>

            <p className='text-gray-600 mb-4 max-w-md'>
                Algo inesperado ocorreu e não conseguimos carregar esta página.
                Pressione <code>F5</code> para recarregar a página ou voltar à
                página principal
            </p>

            <Link className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium' to='/'>
                Voltar para o início
            </Link>
        </div>
    );
}

export default ErrorBoundary;
