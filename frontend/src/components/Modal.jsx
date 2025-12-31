import './Modal.css'

export function Modal() {
	const { user, isAuthenticated, logout } = useAuth();
  const { addNotification } = useNotification();
  const navigate = useNavigate();

const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showStats, setShowStats] = useState(true);

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
                        <div className="modal-body">
                            <div className="welcome-icon">🎉</div>
                            <h2>Bem-vindo ao MyApp!</h2>
                            <p>
                                Estamos felizes em tê-lo aqui. Explore nossas
                                funcionalidades e descubra como podemos ajudar
                                você.
                            </p>
                            <div className="modal-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setShowWelcomeModal(false);
                                        navigate("/register");
                                    }}
                                >
                                    Criar Conta
                                </button>
                                <button
                                    className="btn btn-outline"
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
}

//export default Home;
