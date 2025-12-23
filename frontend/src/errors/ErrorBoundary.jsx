import { useRouteError, Link } from "react-router-dom";

//Este componente captura erros inesperados de runtime
//nas rotas
export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);

    //Refatorar isso
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            <h1 className="display-1 fw-bold text-primary">Oops!</h1>

            <h2 className="mb-3 fw-semibold">Erro Interno</h2>

            <p className="text-muted mb-4" style={{ maxWidth: "420px" }}>
                Algo inesperado ocorreu e não conseguimos carregar esta página.
                Pressione <code>F5</code> para recarregar a página ou voltar à
                página principal
            </p>

            <Link className="btn btn-primary btn-lg px-4" to="/">
                Voltar para o início
            </Link>
        </div>
    );
}
