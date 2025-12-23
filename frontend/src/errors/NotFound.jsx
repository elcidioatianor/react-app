import { Link } from "react-router-dom";

export function NotFound() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light text-center">
            <h1 className="display-1 fw-bold text-primary">404</h1>

            <h2 className="mb-3 fw-semibold">Ops! Página não encontrada.</h2>

            <p className="text-muted mb-4" style={{ maxWidth: "420px" }}>
                A página que estás a tentar aceder não existe, foi removida,
                teve o nome alterado ou está temporariamente indisponível.
            </p>

            <Link className="btn btn-primary btn-lg px-4" to="/">
                Voltar para o início
            </Link>
        </div>
    );
}
