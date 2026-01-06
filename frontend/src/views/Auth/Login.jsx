// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
//import { useFetch } from '../../hooks/useApi';
import { useNotification } from "../../contexts/NotificationContext";
//ICONES
import {
    EyeFill,
    EyeSlashFill,
    GithubLogo,
    GoogleLogo
} from '../../components/Svg';


export function Login() {
    const [credentials, setCredentials] = useState({
        credential: "",
        password: "",
        rememberMe: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        login,
        loading,
        //error: authError,
        //setError,
        isAuthenticated,
    } = useAuthContext();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    // Mostrar notificação de logout
    useEffect(() => {
        if (location.state?.message) {
            addNotification(location.state.message, "info");
        }
    }, [location.state, addNotification]);

    const validateForm = () => {
        const errors = {};

        if (!credentials.credential.trim()) {
            errors.credential = "Informe seu telefone ou email";
        }

        if (!credentials.password) {
            errors.password = "Senha é obrigatória";
        } else if (credentials.password.length < 6) {
            errors.password = "Senha deve ter pelo menos 6 caracteres";
        }
        //console.log(credentials)
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Limpar erro do campo quando o usuário começar a digitar
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await login(credentials);

            if (res.done) {
                addNotification("Sessão iniciada", "success");

                // Armazenar preferência de "lembrar-me"
                if (credentials.remember) {
                    localStorage.setItem("remember", "true");
                } else {
                    localStorage.removeItem("remember");
                }

                // Redirecionar para página anterior ou dashboard
                const from = location.state?.from?.pathname || (res.user?.role === 'seller' ? "/seller/dashboard" : "/");
                navigate(from, { replace: true });
            } else {
                addNotification(res.error || "Erro no login", "error");
                //setError(null)
            }
        } catch (err) {
            console.error("Erro no login:", err);
            addNotification("Erro no login: " + err.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!credentials.email) {
            addNotification(
                "Digite seu email para recuperar a senha",
                "warning",
            );
            return;
        }

        try {
            // Integração com endpoint de recuperação de senha
            // await api.post('/auth/forgot-password', { email: credentials.email });
            addNotification("Email de recuperação enviado!", "success");
        } catch (err) {
            addNotification("Erro ao enviar email de recuperação: " + err.message, "error");
        }
    };

    const handleSocialLogin = (provider) => {
        // Integração com OAuth providers (Google, Facebook, etc.)
        addNotification(`Login com ${provider} em desenvolvimento`, "info");
    };

    return (
        <div className="auth-container" data-bs-theme="light">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Bem-vindo de volta</h1>
                    <p className="auth-subtitle">Faça login para continuar</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="credential" className="form-label">
                            Número de Celular ou E-mail:
                        </label>
                        <input
                            type="text"
                            id="credential"
                            name="credential"
                            value={credentials.credential}
                            onChange={handleInputChange}
                            className={`form-input ${validationErrors.credential ? "input-error" : ""}`}
                            placeholder="Ex: +258841234567 ou email@exemplo.com"
                            disabled={loading || isSubmitting}
                            autoComplete="username"
                        />
                        {validationErrors.credential && (
                            <span className="error-message">
                                {validationErrors.credential}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Senha:
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                className={`form-input ${validationErrors.password ? "input-error" : ""}`}
                                placeholder="Sua senha de acesso"
                                disabled={loading || isSubmitting}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading || isSubmitting}
                            >
                                {showPassword ? <EyeSlashFill color='#888' width='20' height='20' /> : <EyeFill color='#888' width='20' height='20' />}
                            </button>
                        </div>
                        {validationErrors.password && (
                            <span className="error-message">
                                {validationErrors.password}
                            </span>
                        )}
                    </div>

                    <div className="form-options">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={credentials.rememberMe}
                                onChange={handleInputChange}
                                disabled={loading || isSubmitting}
                                className="checkbox-input"
                            />
                            <span className="checkbox-text">Lembrar-me</span>
                        </label>

                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="forgot-password-link"
                            disabled={loading || isSubmitting}
                        >
                            Esqueceste a senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        className="auth-button primary-button"
                        disabled={loading || isSubmitting}
                    >
                        {loading || isSubmitting ? (
                            <>
                                <span className="spinner-small"></span>
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </button>

                    <div className="auth-divider">
                        <span>ou continue com</span>
                    </div>

                    <div className="social-login-container">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin("Google")}
                            className="social-button google-button"
                            disabled={loading || isSubmitting}
                        >
                            <GoogleLogo className="social-icon" />Google
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("GitHub")}
                            className="social-button github-button"
                            disabled={loading || isSubmitting}
                        >
                            <GithubLogo className="social-icon" />
                            GitHub
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Não tes uma conta?{" "}
                            <Link to="/register" className="auth-link">
                                Cadastre-se
                            </Link>
                        </p>
                        {/*<p className="auth-footer-text">
                            <Link to="/" className="auth-link">
                                Voltar para Home
                            </Link>
                        </p>*/}
                    </div>
                </form>
            </div>
        </div>
    );
}

//export default Login;
