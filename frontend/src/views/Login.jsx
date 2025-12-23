// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
//import { useFetch } from '../hooks/useApi';
import { useNotification } from "../contexts/NotificationContext";
import "./Auth.css";

export function Login() {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        login,
        loading,
        error: authError,
        isAuthenticated,
    } = useAuthContext();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        if (isAuthenticated()) {
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

        if (!credentials.email.trim()) {
            errors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            errors.email = "Email inválido";
        }

        if (!credentials.password) {
            errors.password = "Senha é obrigatória";
        } else if (credentials.password.length < 6) {
            errors.password = "Senha deve ter pelo menos 6 caracteres";
        }

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
            const result = await login(credentials);

            if (result.success) {
                addNotification("Login realizado com sucesso!", "success");

                // Armazenar preferência de "lembrar-me"
                if (credentials.remember) {
                    localStorage.setItem("remember", "true");
                } else {
                    localStorage.removeItem("remember");
                }

                // Redirecionar para página anterior ou dashboard
                const from = location.state?.from?.pathname || "/";
                navigate(from, { replace: true });
            } else {
				console.log('Login.jsx:105')
				console.log(result)
                addNotification(result.error || "Falha no login", "error");
            }
        } catch (err) {
            console.error("Erro no login:", err);
            addNotification("Erro ao processar login", "error");
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
            addNotification("Erro ao enviar email de recuperação", "error");
        }
    };

    const handleSocialLogin = (provider) => {
        // Integração com OAuth providers (Google, Facebook, etc.)
        addNotification(`Login com ${provider} em desenvolvimento`, "info");
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Bem-vindo de volta</h1>
                    <p className="auth-subtitle">Faça login para continuar</p>
                </div>

                {(authError || Object.keys(validationErrors).length > 0) && (
                    <div className="auth-error-alert">
                        {authError && <p>{authError}</p>}
                        {Object.values(validationErrors).map(
                            (error, index) =>
                                error && <p key={index}>{error}</p>,
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={credentials.email}
                            onChange={handleInputChange}
                            className={`form-input ${validationErrors.email ? "input-error" : ""}`}
                            placeholder="seu@email.com"
                            disabled={loading || isSubmitting}
                            autoComplete="email"
                        />
                        {validationErrors.email && (
                            <span className="error-message">
                                {validationErrors.email}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">
                            Senha
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                className={`form-input ${validationErrors.password ? "input-error" : ""}`}
                                placeholder=""
                                disabled={loading || isSubmitting}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading || isSubmitting}
                            >
                                {showPassword ? "👁️‍🗨️" : "👁️"}
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
                            Esqueceu a senha?
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
                            <svg className="social-icon" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin("GitHub")}
                            className="social-button github-button"
                            disabled={loading || isSubmitting}
                        >
                            <svg className="social-icon" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    <div className="auth-footer">
                        <p className="auth-footer-text">
                            Não tem uma conta?{" "}
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
