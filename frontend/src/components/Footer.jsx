import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin } from './Svg';

export function Footer() {
    return (
        <footer className="bg-dark text-white pt-5 pb-3">
            <div className="container-fluid container-xl">
                <div className="row g-4">
                    {/* Brand & Social */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="fw-bolder mb-4">
                            <span style={{ color: '#ff4e00' }}>DUBA</span>
                            <span style={{ color: '#fff' }}>NING</span>
                        </h4>
                        <p className="text-white-50 small">
                            O marketplace pensado para Moçambique. Simples, seguro e rápido.
                        </p>
                        <div className="d-flex gap-3 mt-4">
                            <Link to="#" className="text-white-50"><Facebook width="20" height="20" /></Link>
                            <Link to="#" className="text-white-50"><Instagram width="20" height="20" /></Link>
                            <Link to="#" className="text-white-50"><Twitter width="20" height="20" /></Link>
                            <Link to="#" className="text-white-50"><Linkedin width="20" height="20" /></Link>
                        </div>
                    </div>

                    {/* Links Compradores */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="fw-bold mb-4">Para Compradores</h6>
                        <ul className="list-unstyled small text-white-50">
                            <li className="mb-2"><Link to="/how-to-buy" className="text-decoration-none text-white-50">Como comprar</Link></li>
                            <li className="mb-2"><Link to="/payments" className="text-decoration-none text-white-50">Pagamentos</Link></li>
                            <li className="mb-2"><Link to="/shipping" className="text-decoration-none text-white-50">Entregas</Link></li>
                            <li className="mb-2"><Link to="/reviews" className="text-decoration-none text-white-50">Avaliações</Link></li>
                        </ul>
                    </div>

                    {/* Links Vendedores */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="fw-bold mb-4">Para Vendedores</h6>
                        <ul className="list-unstyled small text-white-50">
                            <li className="mb-2"><Link to="/register?role=seller" className="text-decoration-none text-white-50">Vender na DUBANING</Link></li>
                            <li className="mb-2"><Link to="/seller-center" className="text-decoration-none text-white-50">Centro do Vendedor</Link></li>
                            <li className="mb-2"><Link to="/fees" className="text-decoration-none text-white-50">Taxas & Comissões</Link></li>
                            <li className="mb-2"><Link to="/documents" className="text-decoration-none text-white-50">Documentos Comerciais</Link></li>
                        </ul>
                    </div>

                    {/* Suporte */}
                    <div className="col-lg-2 col-md-6">
                        <h6 className="fw-bold mb-4">Suporte</h6>
                        <ul className="list-unstyled small text-white-50">
                            <li className="mb-2"><Link to="/help" className="text-decoration-none text-white-50">Central de Ajuda</Link></li>
                            <li className="mb-2"><Link to="/faq" className="text-decoration-none text-white-50">FAQs</Link></li>
                            <li className="mb-2"><Link to="/contact" className="text-decoration-none text-white-50">Contacto</Link></li>
                            <li className="mb-2"><Link to="/security" className="text-decoration-none text-white-50">Segurança</Link></li>
                        </ul>
                    </div>

                    {/* Pagamentos Aceites */}
                    <div className="col-lg-3">
                        <h6 className="fw-bold mb-4">Pagamentos Aceites</h6>
                        <div className="d-flex flex-wrap gap-2">
                            <span className="badge border border-secondary p-2 text-white-50">M-Pesa</span>
                            <span className="badge border border-secondary p-2 text-white-50">e-Mola</span>
                            <span className="badge border border-secondary p-2 text-white-50">mKesh</span>
                            <span className="badge border border-secondary p-2 text-white-50">Pagamento na Entrega</span>
                        </div>
                    </div>
                </div>

                <hr className="my-5 border-secondary" />

                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 small text-white-50 text-center">
                    <p className="mb-0">&copy; 2026 DUBANING. Todos os direitos reservados.</p>
                    <div className="d-flex gap-4">
                        <Link to="/terms" className="text-decoration-none text-white-50">Termos & Condições</Link>
                        <Link to="/privacy" className="text-decoration-none text-white-50">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
