import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Tab,
  Tabs,
  Badge,
  ListGroup,
  Modal,
  Spinner,
  Toast,
  ToastContainer
} from 'react-bootstrap';

import {
  CheckCircle,
  Phone,
  GeoAltFill,
  Edit,
  Check,
  Bag,
  CreditCard,
  Message
} from '../../components/Svg';

import { useAuthContext as useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';

export const Profile = () => {
  const { user: currentUser, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [editMode, setEditMode] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { execute: saveProfile, loading: saving } = useApi();

  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '84XXXXXXX',
    location: currentUser?.location || 'Maputo, Moçambique',
    avatarUrl: currentUser?.avatarUrl || ''
  });

  const [orders, setOrders] = useState([
    { id: 'DB-1001', date: '2026-01-05', status: 'delivered', total: '2.500 MT', items: 'Smartphone Samsung' },
    { id: 'DB-1002', date: '2026-01-06', status: 'pending', total: '1.200 MT', items: 'Auriculares Bluetooth' },
    { id: 'DB-1003', date: '2026-01-07', status: 'cancelled', total: '500 MT', items: 'Capa Protetora' }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      if (updateProfile) {
        await updateProfile(profileData);
      }
      setEditMode(false);
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered': return <Badge bg="success">Entregue</Badge>;
      case 'pending': return <Badge bg="warning" text="dark">Pendente</Badge>;
      case 'cancelled': return <Badge bg="danger">Cancelado</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  if (!currentUser) {
    return (
      <Container className="py-5 mt-5 text-center">
        <h2>Acesso Negado</h2>
        <p>Por favor, faça login para ver seu perfil.</p>
        <Button onClick={() => navigate('/login')}>Entrar</Button>
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ marginTop: '30px' }}>
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
          <Toast.Header className="bg-success text-white border-0">
            <CheckCircle className="me-2" />
            <strong className="me-auto">Sucesso!</strong>
          </Toast.Header>
          <Toast.Body>Perfil atualizado com sucesso!</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="g-4">
        {/* Sidebar */}
        <Col lg={4}>
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center p-4">
              <div className="mb-4">
                {profileData.avatarUrl && !imgError ? (
                  <img
                    src={profileData.avatarUrl}
                    alt="Avatar"
                    onError={() => setImgError(true)}
                    className="rounded-circle border shadow-sm"
                    style={{ width: "120px", height: "120px", objectFit: "cover" }}
                  />
                ) : (
                  <div className="rounded-circle bg-light text-dubaning-orange d-flex justify-content-center align-items-center mx-auto shadow-sm"
                    style={{ width: "120px", height: "120px", fontSize: "40px" }}>
                    <i className="bi bi-person-fill"></i>
                  </div>
                )}
              </div>

              <h4 className="fw-bold mb-1">{profileData.name}</h4>
              <p className="text-muted mb-4">{profileData.location}</p>

              <ListGroup variant="flush" className="text-start mb-4 border-top">
                <ListGroup.Item className="px-0 py-3 border-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded me-3">
                      <Phone className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Telefone</small>
                      <span className="fw-bold text-dark">{profileData.phone}</span>
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="px-0 py-3 border-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-light p-2 rounded me-3">
                      <GeoAltFill className="text-primary" />
                    </div>
                    <div>
                      <small className="text-muted d-block">Localização</small>
                      <span className="fw-bold text-dark">{profileData.location}</span>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>

              {!editMode ? (
                <Button variant="warning" className="w-100 py-2 rounded-pill bg-dubaning-orange border-0 text-white fw-bold" onClick={() => setEditMode(true)}>
                  <Edit className="me-2" /> Editar Info
                </Button>
              ) : (
                <div className="d-grid gap-2">
                  <Button variant="success" className="py-2 rounded-pill border-0 fw-bold" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Spinner size="sm" /> : <><Check className="me-2" /> Salvar</>}
                  </Button>
                  <Button variant="link" className="text-danger text-decoration-none" onClick={() => setEditMode(false)}>Cancelar</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Tabs */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="custom-tabs border-bottom"
              >
                <Tab eventKey="orders" title={<><Bag className="me-2" /> Pedidos</>} />
                <Tab eventKey="wallet" title={<><CreditCard className="me-2" /> Pagamentos</>} />
                <Tab eventKey="messages" title={<><Message className="me-2" /> Chat</>} />
              </Tabs>

              <div className="p-4">
                {activeTab === 'orders' && (
                  <div className="d-grid gap-3">
                    {orders.length > 0 ? orders.map(order => (
                      <Card key={order.id} className="border-0 bg-light mb-2">
                        <Card.Body>
                          <Row className="align-items-center">
                            <Col md={7}>
                              <div className="d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded border">
                                  <Bag className="text-dubaning-orange" />
                                </div>
                                <div>
                                  <h6 className="fw-bold mb-1">{order.items}</h6>
                                  <span className="text-muted small">Pedido #{order.id} • {order.date}</span>
                                </div>
                              </div>
                            </Col>
                            <Col md={3} className="text-center my-2 my-md-0">
                              {getStatusBadge(order.status)}
                            </Col>
                            <Col md={2} className="text-end">
                              <span className="fw-bold text-dark">{order.total}</span>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    )) : (
                      <div className="text-center py-5">
                        <Bag size={48} className="text-muted mb-3" />
                        <p>Ainda não tens pedidos.</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'wallet' && (
                  <div>
                    <h5 className="fw-bold mb-4">Métodos Guardados</h5>
                    <Row className="g-3">
                      <Col md={6}>
                        <div className="border rounded p-3 d-flex align-items-center gap-3 bg-light">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/M-Pesa_Logo.png" alt="M-Pesa" height="30" />
                          <div className="flex-grow-1">
                            <h6 className="mb-0">M-Pesa</h6>
                            <small className="text-success fw-bold">Ativo</small>
                          </div>
                          <CheckCircle className="text-success" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="border border-dashed rounded p-3 d-flex align-items-center justify-content-center gap-2 cursor-pointer hover-bg-light text-primary">
                          <i className="bi bi-plus-circle"></i>
                          <span className="fw-bold">Adicionar e-Mola</span>
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}

                {activeTab === 'messages' && (
                  <div className="text-center py-5">
                    <Message size={48} className="text-muted mb-3" />
                    <h5>Centro de Mensagens</h5>
                    <p className="text-muted">As tuas conversas com vendedores aparecerão aqui.</p>
                    <Button variant="warning" className="bg-dubaning-orange border-0 text-white fw-bold" onClick={() => navigate('/')}>Explorar Produtos</Button>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal show={editMode} onHide={() => setEditMode(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="fw-bold">Editar Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Nome Completo</Form.Label>
              <Form.Control type="text" name="name" value={profileData.name} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Telefone</Form.Label>
              <Form.Control type="text" name="phone" value={profileData.phone} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">Localização</Form.Label>
              <Form.Control type="text" name="location" value={profileData.location} onChange={handleInputChange} />
            </Form.Group>
          </Form>
          <div className="d-grid gap-2 mt-4">
            <Button variant="primary" className="py-2 bg-dubaning-orange border-0 fw-bold" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <Spinner size="sm" /> : "Salvar Alterações"}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile;
