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

    return (
        <div className="home-container">
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