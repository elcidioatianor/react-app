import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { Container, Row, Col, Nav, Navbar, Dropdown, Offcanvas, Button } from "react-bootstrap";
import {
    Speedometer2,
    BoxSeam,
    Cart3,
    Wallet2,
    FileEarmarkText,
    Gear,
    BoxArrowLeft,
    List,
    PersonCircle
} from "react-bootstrap-icons";

export function SellerLayout() {
    const { user, logout } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [showSidebar, setShowSidebar] = useState(false);

    const handleClose = () => setShowSidebar(false);
    const handleShow = () => setShowSidebar(true);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path ? "active bg-primary text-white" : "text-dark";

    const SidebarContent = () => (
        <div className="d-flex flex-column h-100">
            <div className="p-3 text-center mb-4 border-bottom">
                <h4 className="fw-bold text-dark">DUBANING <span className="text-warning">Seller</span></h4>
            </div>
            <Nav className="flex-column px-2 gap-1 flex-grow-1">
                <Nav.Item>
                    <Link to="/seller/dashboard" className={`nav-link rounded ${isActive("/seller/dashboard")}`} onClick={handleClose}>
                        <Speedometer2 className="me-2" /> Visão Geral
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/seller/products" className={`nav-link rounded ${isActive("/seller/products")}`} onClick={handleClose}>
                        <BoxSeam className="me-2" /> Produtos
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/seller/orders" className={`nav-link rounded ${isActive("/seller/orders")}`} onClick={handleClose}>
                        <Cart3 className="me-2" /> Pedidos
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/seller/wallet" className={`nav-link rounded ${isActive("/seller/wallet")}`} onClick={handleClose}>
                        <Wallet2 className="me-2" /> Financeiro
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/seller/documents" className={`nav-link rounded ${isActive("/seller/documents")}`} onClick={handleClose}>
                        <FileEarmarkText className="me-2" /> Documentos
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/seller/settings" className={`nav-link rounded ${isActive("/seller/settings")}`} onClick={handleClose}>
                        <Gear className="me-2" /> Definições
                    </Link>
                </Nav.Item>
            </Nav>
            <div className="p-3 border-top">
                <Button variant="outline-danger" className="w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
                    <BoxArrowLeft /> Sair
                </Button>
            </div>
        </div>
    );

    return (
        <div className="min-vh-100 bg-light">
            {/* Mobile Header */}
            <Navbar bg="white" expand={false} className="d-lg-none shadow-sm sticky-top px-3">
                <Button variant="link" className="text-dark p-0" onClick={handleShow}>
                    <List size={28} />
                </Button>
                <Navbar.Brand className="mx-auto fw-bold">Seller Panel</Navbar.Brand>
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-dark p-0 border-0 no-caret">
                        {user?.avatarUrl ? (
                            <img src={user.avatarUrl} alt="User" className="rounded-circle" width="32" height="32" />
                        ) : (
                            <PersonCircle size={28} />
                        )}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item as={Link} to="/profile">Meu Perfil</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={handleLogout} className="text-danger">Sair</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Navbar>

            <Container fluid>
                <Row>
                    {/* Desktop Sidebar */}
                    <Col lg={2} className="d-none d-lg-block vh-100 bg-white shadow-sm position-fixed top-0 start-0 overflow-auto">
                        <SidebarContent />
                    </Col>

                    {/* Mobile Offcanvas Sidebar */}
                    <Offcanvas show={showSidebar} onHide={handleClose} responsive="lg">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Menu</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className="p-0">
                            <SidebarContent />
                        </Offcanvas.Body>
                    </Offcanvas>

                    {/* Main Content */}
                    <Col lg={{ span: 10, offset: 2 }} className="p-4" style={{ marginTop: '0px' }}>
                        {/* Desktop Header */}
                        <div className="d-none d-lg-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <h2 className="h4 fw-bold text-dark mb-0">Painel do Vendedor</h2>
                            <div className="d-flex align-items-center gap-3">
                                <div className="text-end">
                                    <small className="d-block text-muted">Bem-vindo,</small>
                                    <span className="fw-bold">{user?.name}</span>
                                </div>
                                <Dropdown align="end">
                                    <Dropdown.Toggle variant="light" className="rounded-circle p-0 border-0" id="dropdown-profile">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} alt="User" className="rounded-circle shadow-sm" width="40" height="40" />
                                        ) : (
                                            <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                                                <PersonCircle size={24} />
                                            </div>
                                        )}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item as={Link} to="/profile">Meu Perfil</Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="text-danger">Sair</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        </div>

                        <Outlet />
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
