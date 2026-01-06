import { useNavigate } from "react-router-dom";
// src/views/Profile.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Form, 
  Image, 
  Tab, 
  Tabs, 
  Badge,
  ProgressBar,
  ListGroup,
  Modal,
  Alert,
  Spinner,
  InputGroup,
  Dropdown,
  Toast,
  ToastContainer
} from 'react-bootstrap';

import { 
  PersonCircle, 
  Gear, 
  Camera, 
  CheckCircle,
  Star,
  Award,
  Clock,
  Calendar,
  Envelope,
  Phone,
  GeoAltFill,
  Globe,
  Lock,
  Share,
  Download,
  Edit,
  Trash,
  Plus,
  Check,
  X,
  Upload,
  Bell,
  Shield,
  CreditCard,
  Activity,
  BarChart,
  FileText,
  Bookmark,
  Heart,
  Message,
  People,
  Building,
  Briefcase,
  GraduationCap,
  Link,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Github
} from '../../components/Svg';

import { useAuthContext as useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../hooks/useApi';

export const Profile = () => {
  const { user: currentUser, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [editMode, setEditMode] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
	const {imgError, setImgError} = useState(null)
  
  const { execute: saveProfile, loading: saving } = useApi();
  
  // Dados do perfil (inicial com dados do usuário atual)
  const [profileData, setProfileData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: 'Desenvolvedor apaixonado por tecnologia e inovação.',
    location: 'Lisboa, Portugal',
    website: 'https://meusite.com',
    phone: '+351 912 345 678',
    company: 'Tech Solutions Inc.',
    position: 'Senior Developer',
    education: 'MSc Computer Science',
    skills: ['React', 'Node.js', 'TypeScript', 'Bootstrap', 'MongoDB'],
    interests: ['Programação', 'Design', 'Música', 'Viagens', 'Esportes'],
    social: {
      twitter: '@username',
      github: 'githubuser',
      linkedin: 'linkedinuser'
    }
  });

  // Dados simulados para gráficos
  const [stats, setStats] = useState({
    completedProjects: 42,
    ongoingProjects: 5,
    totalContributions: 128,
    communityRating: 4.8,
    accountLevel: 'Pro',
    memberSince: '2022-03-15'
  });

  // Atividades recentes
  const [activities, setActivities] = useState([
    { id: 1, action: 'Projeto "E-commerce" concluído', time: '2 horas atrás', icon: <CheckCircle />, color: 'success' },
    { id: 2, action: 'Nova conexão: Ana Silva', time: '1 dia atrás', icon: <People />, color: 'primary' },
    { id: 3, action: 'Artigo publicado: "React Best Practices"', time: '3 dias atrás', icon: <FileText />, color: 'info' },
    { id: 4, action: 'Certificação Bootstrap 5 obtida', time: '1 semana atrás', icon: <Award />, color: 'warning' },
    { id: 5, action: 'Profile atualizado', time: '2 semanas atrás', icon: <Gear />, color: 'secondary' }
  ]);

  // Projetos recentes
  const [projects, setProjects] = useState([
    { id: 1, name: 'Dashboard Analytics', status: 'active', progress: 75, team: 4, deadline: '2024-03-15' },
    { id: 2, name: 'Mobile App Redesign', status: 'completed', progress: 100, team: 3, deadline: '2024-02-28' },
    { id: 3, name: 'API Integration', status: 'active', progress: 40, team: 2, deadline: '2024-04-10' },
    { id: 4, name: 'Documentation', status: 'pending', progress: 10, team: 1, deadline: '2024-03-30' }
  ]);

  useEffect(() => {
    // Simular carregamento de dados do perfil
    const timer = setTimeout(() => {
      setShowSuccessToast(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
 const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(/\s+/);
        return parts.length >= 2
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0][0].toUpperCase();
    };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // Simular API call
      await saveProfile('/api/profile', {
        method: 'PUT',
        body: profileData
      });
      
      // Atualizar contexto de autenticação
      if (updateProfile) {
        await updateProfile(profileData);
      }
      
      setEditMode(false);
      setShowSuccessToast(true);
      
      // Esconder toast após 3 segundos
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Simular upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        
        // Simular progresso de upload
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setShowAvatarModal(false);
              setUploadProgress(0);
            }, 500);
          }
        }, 100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddSkill = (skill) => {
    if (skill && !profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'active': return <Badge bg="primary">Ativo</Badge>;
      case 'completed': return <Badge bg="success">Concluído</Badge>;
      case 'pending': return <Badge bg="warning">Pendente</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-4 profile-page">
      {/* Toast de Sucesso */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
          <Toast.Header className="bg-success text-white">
            <CheckCircle className="me-2" />
            <strong className="me-auto">Sucesso!</strong>
          </Toast.Header>
          <Toast.Body>Perfil atualizado com sucesso!</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="g-4 mt-3">
        {/* Coluna Lateral - Perfil */}
        <Col lg={4} md={5}>
          <Card className="shadow border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Body className="text-center p-4">
              {/* Avatar Section */}
              <div className="position-relative mb-4">
                <div className="avatar-container mx-auto">
					 {currentUser.avatarUrl && !imgError ? (
                                <img
                                    src={currentUser.avatarUrl || `https://ui-avatars.com/api/?name=${profileData.name}&background=667eea&color=fff&size=150`}
                                    alt="Avatar"
                                    onError={() => setImgError(true)}
                                    className="img-fluid rounded-circle border-2 border-white shadow"
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        objectFit: "cover",
                                    }}
                                />
                            ) : (
                                <div
                                    className="rounded-circle bg-light text-secondary d-flex justify-content-center align-items-center border-1"
									  onClick={() => setShowAvatarModal(true)}
                                    style={{
                                        width: "150px",
                                        height: "150px",
                                        fontWeight: 700,
										fontSize: '45px'
                                    }}
                                >
                                    {getInitials(currentUser.name)}
                                </div>
                            )}
                </div>
			
                <div className="mt-3">
                  <h3 className="fw-bold mb-1">{profileData.name}</h3>
                  <p className="text-muted mb-2">{profileData.position}</p>
                  
                  <Badge bg="primary" className="px-3 py-2 mb-3">
                    <Award className="me-1" /> {stats.accountLevel}
                  </Badge>
                </div>
              </div>

              {/* Stats Overview */}
              <Row className="g-3 mb-4">
                <Col xs={6}>
                  <div className="bg-light rounded p-3">
                    <div className="display-6 fw-bold text-primary">{stats.completedProjects}</div>
                    <small className="text-muted">Projetos</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="bg-light rounded p-3">
                    <div className="display-6 fw-bold text-success">{stats.totalContributions}</div>
                    <small className="text-muted">Contribuições</small>
                  </div>
                </Col>
              </Row>

              {/* Rating */}
              <div className="d-flex align-items-center justify-content-center mb-4">
                <div className="me-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={i < Math.floor(stats.communityRating) ? "text-warning" : "text-muted"} 
                      fill={i < stats.communityRating ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="fw-bold">{stats.communityRating}/5</span>
              </div>

              {/* Contact Info */}
              <ListGroup variant="flush" className="text-start mb-4">
                <ListGroup.Item className="border-0 px-0 py-2">
                  <Envelope className="me-2 text-primary" />
                  <a href={`mailto:${profileData.email}`} className="text-decoration-none">
                    {profileData.email}
                  </a>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0 py-2">
                  <Phone className="me-2 text-primary" />
                  {profileData.phone}
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0 py-2">
                  <GeoAltFill className="me-2 text-primary" size='18'/>
                  {profileData.location}
                </ListGroup.Item>
                <ListGroup.Item className="border-0 px-0 py-2">
                  <Globe className="me-2 text-primary" />
                  <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                    {profileData.website}
                  </a>
                </ListGroup.Item>
              </ListGroup>

              {/* Social Links */}
              <div className="d-flex justify-content-center gap-3 mb-4">
                <Button variant="outline-primary" size="sm" className="rounded-circle">
                  <Twitter />
                </Button>
                <Button variant="outline-primary" size="sm" className="rounded-circle">
                  <Github />
                </Button>
                <Button variant="outline-primary" size="sm" className="rounded-circle">
                  <Linkedin />
                </Button>
                <Button variant="outline-primary" size="sm" className="rounded-circle">
                  <Instagram />
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="d-grid gap-2">
                <Button 
                  variant={editMode ? "outline-secondary" : "primary"}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? (
                    <>
                      <X className="me-2" /> Cancelar Edição
                    </>
                  ) : (
                    <>
                      <Edit className="me-2" /> Editar Perfil
                    </>
                  )}
                </Button>
                
                {editMode && (
                  <Button 
                    variant="success" 
                    onClick={handleSaveProfile}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Spinner size="sm" animation="border" className="me-2" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Check className="me-2" /> Salvar Alterações
                      </>
                    )}
                  </Button>
                )}
                
                <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)}>
                  <Trash className="me-2" /> Excluir Conta
                </Button>
              </div>
            </Card.Body>
            
            <Card.Footer className="text-center bg-light">
              <small className="text-muted">
                <Clock className="me-1" /> Membro desde {new Date(stats.memberSince).toLocaleDateString('pt-PT')}
              </small>
            </Card.Footer>
          </Card>
        </Col>

        {/* Coluna Principal - Conteúdo */}
        <Col lg={8} md={7}>
          {/* Tabs de Navegação */}
          <Card className="shadow border-0 mb-4">
            <Card.Body className="p-0">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
                className="nav-tabs-profile px-3 pt-3"
                fill
              >
                <Tab eventKey="overview" title={
                  <>
                    <PersonCircle className="me-2" /> Visão Geral
                  </>
                } />
                <Tab eventKey="projects" title={
                  <>
                    <Briefcase className="me-2" /> Projetos
                  </>
                } />
                <Tab eventKey="activity" title={
                  <>
                    <Activity className="me-2" /> Atividade
                  </>
                } />
                <Tab eventKey="settings" title={
                  <>
                    <Gear className="me-2" /> Configurações
                  </>
                } />
              </Tabs>
            </Card.Body>
          </Card>

          {/* Conteúdo das Tabs */}
          {activeTab === 'overview' && (
            <>
              {/* Bio Section */}
              <Card className="shadow border-0 mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">
                      <PersonCircle className="me-2" /> Sobre Mim
                    </Card.Title>
                    {editMode && (
                      <Button variant="outline-primary" size="sm">
                        <Edit size={14} />
                      </Button>
                    )}
                  </div>
                  
                  {editMode ? (
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        rows={4}
                        name="bio"
                        value={profileData.bio}
                        onChange={handleInputChange}
                        placeholder="Conte um pouco sobre você..."
                      />
                    </Form.Group>
                  ) : (
                    <p className="text-muted">{profileData.bio}</p>
                  )}
                </Card.Body>
              </Card>

              {/* Skills Section */}
              <Card className="shadow border-0 mb-4">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">
                      <Award className="me-2" /> Habilidades
                    </Card.Title>
                    {editMode && (
                      <Dropdown>
                        <Dropdown.Toggle variant="outline-primary" size="sm">
                          <Plus size={14} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => handleAddSkill('JavaScript')}>JavaScript</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAddSkill('Python')}>Python</Dropdown.Item>
                          <Dropdown.Item onClick={() => handleAddSkill('UI/UX Design')}>UI/UX Design</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </div>
                  
                  <div className="d-flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <Badge key={index} bg="light" text="dark" className="p-2 d-flex align-items-center">
                        {skill}
                        {editMode && (
                          <Button 
                            variant="link" 
                            size="sm" 
                            className="p-0 ms-2 text-danger"
                            onClick={() => handleRemoveSkill(skill)}
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>

              {/* Info Section */}
              <Row className="g-4">
                <Col md={6}>
                  <Card className="shadow border-0 h-100">
                    <Card.Body>
                      <Card.Title className="mb-3">
                        <Briefcase className="me-2" /> Informações Profissionais
                      </Card.Title>
                      
                      <ListGroup variant="flush">
                        <ListGroup.Item className="border-0 px-0 py-2">
                          <strong>Empresa:</strong> {profileData.company}
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 px-0 py-2">
                          <strong>Cargo:</strong> {profileData.position}
                        </ListGroup.Item>
                        <ListGroup.Item className="border-0 px-0 py-2">
                          <strong>Educação:</strong> {profileData.education}
                        </ListGroup.Item>
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="shadow border-0 h-100">
                    <Card.Body>
                      <Card.Title className="mb-3">
                        <Heart className="me-2" /> Interesses
                      </Card.Title>
                      
                      <div className="d-flex flex-wrap gap-2">
                        {profileData.interests.map((interest, index) => (
                          <Badge key={index} bg="info" className="p-2">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          {activeTab === 'projects' && (
            <Card className="shadow border-0">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Card.Title className="mb-0">
                    <Briefcase className="me-2" /> Meus Projetos
                  </Card.Title>
                  <Button variant="primary" size="sm">
                    <Plus className="me-2" /> Novo Projeto
                  </Button>
                </div>
                
                {projects.map((project) => (
                  <Card key={project.id} className="mb-3 border">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col xs={12} md={6}>
                          <h6 className="fw-bold mb-1">{project.name}</h6>
                          <div className="d-flex align-items-center gap-2">
                            {getStatusBadge(project.status)}
                            <small className="text-muted">
                              <People size={12} className="me-1" /> {project.team} membros
                            </small>
                            <small className="text-muted">
                              <Calendar size={12} className="me-1" /> {project.deadline}
                            </small>
                          </div>
                        </Col>
                        
                        <Col xs={12} md={6}>
                          <div className="mt-2 mt-md-0">
                            <div className="d-flex justify-content-between mb-1">
                              <small>Progresso</small>
                              <small className="fw-bold">{project.progress}%</small>
                            </div>
                            <ProgressBar 
                              now={project.progress} 
                              variant={
                                project.progress < 30 ? "danger" :
                                project.progress < 70 ? "warning" : "success"
                              }
                            />
                          </div>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card className="shadow border-0">
              <Card.Body>
                <Card.Title className="mb-4">
                  <Activity className="me-2" /> Atividade Recente
                </Card.Title>
                
                {activities.map((activity) => (
                  <div key={activity.id} className="d-flex align-items-start mb-3">
                    <div className={`bg-${activity.color} bg-opacity-10 rounded-circle p-2 me-3`}>
                      <div className={`text-${activity.color}`}>
                        {activity.icon}
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-1">{activity.action}</p>
                      <small className="text-muted">
                        <Clock size={12} className="me-1" /> {activity.time}
                      </small>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="shadow border-0">
              <Card.Body>
                <Card.Title className="mb-4">
                  <Gear className="me-2" /> Configurações
                </Card.Title>
                
                <Tabs defaultActiveKey="account" className="mb-3">
                  <Tab eventKey="account" title="Conta">
                    <ListGroup variant="flush" className="mt-3">
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <Shield className="me-2" />
                          <strong>Segurança da Conta</strong>
                          <p className="text-muted mb-0 small">Gerencie senha e autenticação</p>
                        </div>
                        <Button variant="outline-primary" size="sm">Configurar</Button>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <Bell className="me-2" />
                          <strong>Notificações</strong>
                          <p className="text-muted mb-0 small">Prefereências de email e push</p>
                        </div>
                        <Button variant="outline-primary" size="sm">Configurar</Button>
                      </ListGroup.Item>
                      
                      <ListGroup.Item className="d-flex justify-content-between align-items-center">
                        <div>
                          <CreditCard className="me-2" />
                          <strong>Assinatura</strong>
                          <p className="text-muted mb-0 small">Plano atual: {stats.accountLevel}</p>
                        </div>
                        <Button variant="outline-primary" size="sm">Gerenciar</Button>
                      </ListGroup.Item>
                    </ListGroup>
                  </Tab>
                  
                  <Tab eventKey="privacy" title="Privacidade">
                    <div className="mt-3">
                      <Form>
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="profile-visibility"
                            label="Perfil público"
                            defaultChecked
                          />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                          <Form.Check 
                            type="switch"
                            id="activity-visibility"
                            label="Mostrar atividade recente"
                            defaultChecked
                          />
                        </Form.Group>
                        
                        <Button variant="primary">Salvar Preferências</Button>
                      </Form>
                    </div>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Modal de Upload de Avatar */}
      <Modal show={showAvatarModal} onHide={() => setShowAvatarModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Foto de Perfil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '150px', height: '150px' }}>
              {avatarPreview ? (
                <Image src={avatarPreview} roundedCircle fluid style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <PersonCircle size={80} className="text-muted" />
              )}
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-3">
                <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
              </div>
            )}
            
            <Form.Group>
              <Form.Label className="btn btn-primary cursor-pointer">
                <Upload className="me-2" /> Escolher Imagem
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  className="d-none" 
                  onChange={handleAvatarUpload}
                />
              </Form.Label>
            </Form.Group>
            
            <p className="text-muted small mt-2">
              Tamanho máximo: 5MB. Formatos: JPG, PNG, GIF.
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="text-danger">
            <Trash className="me-2" /> Excluir Conta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <Alert.Heading>Atenção!</Alert.Heading>
            <p>
              Esta ação é permanente e não pode ser desfeita. Todos os seus dados,
              projetos e configurações serão permanentemente removidos.
            </p>
          </Alert>
          
          <Form.Group className="mb-3">
            <Form.Label>Digite sua senha para confirmar:</Form.Label>
            <Form.Control type="password" placeholder="Sua senha" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={() => {
            setShowDeleteModal(false);
            logout();
          }}>
            Confirmar Exclusão
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

// Estilos CSS adicionais
const profileStyles = `
.profile-page {
  background: linear-gradient(135deg, #667eea0d 0%, #764ba20d 100%);
  min-height: 100vh;
}

.avatar-container {
  position: relative;
  display: inline-block;
}

.avatar-img {
  transition: transform 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.nav-tabs-profile .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: #6c757d;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
}

.nav-tabs-profile .nav-link.active {
  color: #667eea;
  border-bottom-color: #667eea;
  background: transparent;
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.cursor-pointer {
  cursor: pointer;
}
`;

// Adicionar estilos ao documento
if (typeof document !== 'undefined') {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = profileStyles;
  document.head.appendChild(styleTag);
}
