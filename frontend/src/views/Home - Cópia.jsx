// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext as useAuth } from "../contexts/AuthContext";
import { useFetch } from "../hooks/useApi";
import { useNotification } from "../contexts/NotificationContext";
import { LoadingOverlay } from "../components/LoadingOverlay";
import "./Home.css";

import { 
  Container, 
  Row, 
  Col, 
  Navbar, 
  Nav, 
  Form, 
  FormControl, 
  Button, 
  Card, 
  Badge,
  Modal,
  Tab,
  Tabs,
  ProgressBar,
  Alert,
  Spinner,
  Dropdown,
  NavDropdown,
  ButtonGroup,
  ListGroup,
  InputGroup
} from 'react-bootstrap';

import { 
  Search, 
  PersonCircle, 
  Gear, 
  BoxArrowRight,
  GraphUp,
  ShieldCheck,
  ArrowsFullscreen,
  Phone,
  CheckCircle,
  ArrowRepeat,
  Star,
  People,
  Award,
  Clock,
  ChevronRight,
  Rocket,
  Lock,
  Cpu,
  Heart,
  Trophy,
  Lightning,
  Palette,
  Globe,
  Chat,
  Envelope,
	PlayCircle,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
	CartCheckFill,
	ShieldLockFill 
} from '../components/Svg';

export const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('features');
    const [searchQuery, setSearchQuery] = useState('');
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    // Fetch de dados públicos (exemplo)
    const { 
        data: publicData, 
        loading: publicLoading, 
        error: publicError,
        refetch: refetchPublicData 
    } = useFetch('/api/public/data', { requireAuth: false });

    // Fetch de dados protegidos (somente se autenticado)
    const { 
        data: privateData, 
        loading: privateLoading, 
        error: privateError,
        refetch: refetchPrivateData 
    } = useFetch('/api/private/data', { requireAuth: true }, [isAuthenticated]);

    // Mostrar modal de boas-vindas para novos usuários
    useEffect(() => {//TODO: REMOVE IN PRODUCTION
        const isFirstVisit = true/*!localStorage.getItem('hasVisitedBefore')*/;
        if (isFirstVisit && !isAuthenticated) {
            setTimeout(() => {
                setShowWelcomeModal(true);
                localStorage.setItem('hasVisitedBefore', 'true');
            }, 1000);
        }
    }, [isAuthenticated]);

    const handleLogout = async () => {
        try {
            await logout();
            addNotification('Logout com sucesso', 'success');
            //navigate('/login');
        } catch (error) {
            addNotification('Erro ao fazer logout', 'error');
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const features = [
        {
            icon: <Cpu size='50' color='#444'/>,
            title: 'Performance',
            description: 'Otimizado para máxima velocidade e eficiência'
        },
        {
            icon: <ShieldLockFill size='50' color='#0f0'/>,
            title: 'Segurança',
            description: 'Autenticação robusta com tokens JWT'
        },
        {
            icon: '🔄',
            title: 'Sincronização',
            description: 'Dados atualizados em tempo real'
        },
        {
            icon: '📱',
            title: 'Responsivo',
            description: 'Funciona perfeitamente em qualquer dispositivo'
        }
    ];

    const stats = [
        { label: 'Usuários Ativos', value: '10K+' },
        { label: 'Projetos Concluídos', value: '500+' },
        { label: 'Satisfação', value: '99%' },
        { label: 'Uptime', value: '99.9%' }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Transforme sua experiência de compras
                        <span className="highlight"> conosco</span>
                    </h1>
                    <p className="hero-subtitle">
                        A solução completa para gerenciar seus projetos, colaborar com sua equipe
                        e alcançar resultados extraordinários.
                    </p>
                    
                    <div className="hero-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-large">
                                Acessar Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-large">
                                    Começar Grátis
                                </Link>
                                <Link to="/demo" className="btn btn-outline-primary btn-large border-2">
                                    Ver Demonstração
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <div className="hero-stats">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-item">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
                
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="section-header">
                    <h2 className="section-title">Por que escolher nossa plataforma?</h2>
                    <p className="section-subtitle">
                        Tecnologia de ponta combinada com uma experiência do usuário excepcional
                    </p>
                </div>
                
                <div className="tabs-container">
                    <div className="tabs-header">
                        {['features', 'security', 'integration', 'support'].map((tab) => (
                            <button
                                key={tab}
                                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                                onClick={() => setActiveTab(tab)}
                            >
                                {tab === 'features' && <span><Gear size='18' color='#444'/>Produtos</span>}
                                {tab === 'security' && <span><ShieldLockFill size='18' color='#444'/>Segurança</span>}
                                {tab === 'integration' && '🔄 Integração'}
                                {tab === 'support' && '🎯 Suporte'}
                            </button>
                        ))}
                    </div>
                    
                    <div className="tabs-content">
                        {activeTab === 'features' && (
                            <div className="features-grid">
                                {features.map((feature, index) => (
                                    <div key={index} className="feature-card">
                                        <div className="feature-icon">{feature.icon}</div>
                                        <h3 className="feature-title">{feature.title}</h3>
                                        <p className="feature-description">{feature.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {activeTab === 'security' && (
                            <div className="security-content">
                                <h3>Segurança em Primeiro Lugar</h3>
                                <ul className="security-list">
                                    <li><CheckCircle size={18}/> Autenticação com tokens JWT</li>
                                    <li><CheckCircle size={18}/> Criptografia de ponta a ponta</li>
                                    <li><CheckCircle size='18'/>Backup automático diário</li>
                                    <li><CheckCircle size='18'/>Conformidade com LGPD</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* API Data Section */}
            <section className="api-section">
                <div className="section-header">
                    <h2 className="section-title">Dados em Tempo Real</h2>
                    <p className="section-subtitle">
                        Exemplos de integração com nossa API
                    </p>
                </div>
                
                <div className="data-grid">
                    <div className="data-card">
                        <h3 className="data-card-title">
                            Dados Públicos
                            <button 
                                onClick={refetchPublicData}
                                className="refresh-button"
                                disabled={publicLoading}
                            >
                                {publicLoading ? '🔄' : '🔄'}
                            </button>
                        </h3>
                        
                        {publicLoading ? (
                            <div className="loading-placeholder">
                                <div className="spinner-small"></div>
                                Carregando dados públicos...
                            </div>
                        ) : publicError ? (
                            <div className="error-placeholder">
                                ❌ Erro ao carregar dados
                            </div>
                        ) : publicData ? (
                            <div className="data-content">
                                <pre>{JSON.stringify(publicData, null, 2)}</pre>
                            </div>
                        ) : (
                            <div className="empty-placeholder">
                                Nenhum dado disponível
                            </div>
                        )}
                    </div>
                    
                    {isAuthenticated && (
                        <div className="data-card">
                            <h3 className="data-card-title">
                                Dados Protegidos
                                <button 
                                    onClick={refetchPrivateData}
                                    className="refresh-button"
                                    disabled={privateLoading}
                                >
                                    {privateLoading ? '🔄' : '🔄'}
                                </button>
                            </h3>
                            
                            {privateLoading ? (
                                <div className="loading-placeholder">
                                    <div className="spinner-small"></div>
                                    Carregando dados privados...
                                </div>
                            ) : privateError ? (
                                <div className="error-placeholder">
                                    ❌ Erro ao carregar dados
                                </div>
                            ) : privateData ? (
                                <div className="data-content">
                                    <pre>{JSON.stringify(privateData, null, 2)}</pre>
                                </div>
                            ) : (
                                <div className="empty-placeholder">
                                    Nenhum dado disponível
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="cta-content">
                    <h2 className="cta-title">Pronto para começar?</h2>
                    <p className="cta-subtitle">
                        Junte-se a milhares de usuários satisfeitos
                    </p>
                    
                    <div className="cta-actions">
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="btn btn-primary btn-large">
                                Acessar Plataforma
                            </Link>
                        ) : (
                            <>
                                <Link to="/register" className="btn btn-primary btn-large">
                                    Criar Conta Gratuita
                                </Link>
                                <Link to="/contact" className="btn btn-outline-light btn-large border-2">
                                    Falar com Vendas
                                </Link>
                            </>
                        )}
                    </div>
                    
                    <div className="cta-features">
                        <div className='d-inline-flex flex-column align-items-center'><CheckCircle size={18}/>30 dias grátis</div>
                        <div className='d-inline-flex flex-column align-items-center'><CheckCircle size={18}/>Suporte 24/7</div>
                        <div className='d-inline-flex flex-column align-items-center'><CheckCircle size={18}/>Cancelamento fácil</div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="home-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3 className="footer-title">Nexus</h3>
                        <p className="footer-description">
                            Transformando ideias em realidade desde 2023.
                        </p>
                    </div>
                    
                    <div className="footer-links">
                        <div className="link-column">
                            <h4>Produto</h4>
                            <Link to="/features">Funcionalidades</Link>
                            <Link to="/pricing">Preços</Link>
                            <Link to="/integrations">Integrações</Link>
                        </div>
                        
                        <div className="link-column">
                            <h4>Empresa</h4>
                            <Link to="/about">Sobre</Link>
                            <Link to="/blog">Blog</Link>
                            <Link to="/careers">Carreiras</Link>
                        </div>
                        
                        <div className="link-column">
                            <h4>Suporte</h4>
                            <Link to="/help">Ajuda</Link>
                            <Link to="/contact">Contato</Link>
                            <Link to="/status">Status</Link>
                        </div>
                        
                        <div className="link-column">
                            <h4>Legal</h4>
                            <Link to="/privacy">Privacidade</Link>
                            <Link to="/terms">Termos</Link>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                    </div>
                </div>
                
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} MyApp. Todos os direitos reservados.</p>
                    <div className="social-links">
                        <a href="#" className="social-link">🐦</a>
                        <a href="#" className="social-link">📘</a>
                        <a href="#" className="social-link">📷</a>
                        <a href="#" className="social-link">📺</a>
                    </div>
                </div>
            </footer>

            {/* Loading Overlay */}
            <LoadingOverlay 
                isLoading={publicLoading || privateLoading} 
                message="Carregando dados..."
            />

            {/* Welcome Modal */}
            {showWelcomeModal && !isAuthenticated && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button 
                            className="modal-close"
                            onClick={() => setShowWelcomeModal(false)}
                        >
                            ×
                        </button>
                        <div className="modal-body p-0">
                            <div className="welcome-icon px-0 mx-0">🎉</div> 
                            <h2 className='pt-0 mt-0'>Bem-vindo ao Nexus!</h2>
                            <p>
                                Estamos felizes em tê-lo aqui. Explore nossas funcionalidades
                                e descubra como podemos ajudar você.
                            </p>
                            <div className="modal-actions gap-4">
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowWelcomeModal(false);
                                        navigate('/register');
                                    }}
                                >
                                    Criar Conta
                                </button>
                                <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => setShowWelcomeModal(false)}
                                >
                                    Explorar Agora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;