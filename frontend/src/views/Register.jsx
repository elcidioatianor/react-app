// src/pages/Register.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext"; //useAuthentication/AuthenticationProvider
//import { useFetch } from '../hooks/useApi';
import { useNotification } from "../contexts/NotificationContext";
import "./Auth.css";

//ICONES
import { EyeFill, EyeSlashFill } from '../components/Svg';

export function Register() {
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        acceptTerms: false,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        loading,
        error: authError,
        isAuthenticated,
    } = useAuthContext();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    // Redirecionar se já estiver autenticado
    useEffect(() => {
        if (isAuthenticated()) {
            navigate("/", { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Calcular força da senha
    useEffect(() => {
        if (!userData.password) {
            setPasswordStrength(0);
            return;
        }

        let strength = 0;

        // Comprimento mínimo
        if (userData.password.length >= 8) strength++;

        // Contém números
        if (/\d/.test(userData.password)) strength++;

        // Contém letras minúsculas e maiúsculas
        if (/[a-z]/.test(userData.password) && /[A-Z]/.test(userData.password))
            strength++;

        // Contém caracteres especiais
        if (/[!@#$%^&*(),.?":{}|<>]/.test(userData.password)) strength++;

        setPasswordStrength(strength);
    }, [userData.password]);

    const validateForm = () => {
        const errors = {};

        if (!userData.name.trim()) {
            errors.name = "Nome é obrigatório";
        } else if (userData.name.trim().length < 2) {
            errors.name = "Nome deve ter pelo menos 2 caracteres";
        }

        if (!userData.email.trim()) {
            errors.email = "Email é obrigatório";
        } else if (!/\S+@\S+\.\S+/.test(userData.email)) {
            errors.email = "Email inválido";
        }

        if (!userData.password) {
            errors.password = "Senha é obrigatória";
        } else if (userData.password.length < 6) {
            errors.password = "Senha deve ter pelo menos 6 caracteres";
        }

        if (!userData.confirmPassword) {
            errors.confirmPassword = "Confirme sua senha";
        } else if (userData.password !== userData.confirmPassword) {
            errors.confirmPassword = "As senhas não coincidem";
        }

        if (!userData.acceptTerms) {
            errors.acceptTerms = "Você deve aceitar os termos de uso";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUserData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Limpar erro do campo
        if (validationErrors[name]) {
            setValidationErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const getPasswordStrengthText = () => {
        if (passwordStrength === 0) return "Muito fraca";
        if (passwordStrength === 1) return "Fraca";
        if (passwordStrength === 2) return "Moderada";
        if (passwordStrength === 3) return "Forte";
        return "Muito forte";
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return "#e74c3c";
        if (passwordStrength === 2) return "#f39c12";
        if (passwordStrength === 3) return "#3498db";
        return "#27ae60";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await register({
                name: userData.name,
                email: userData.email,
                password: userData.password,
            });

            if (result.success) {
                addNotification(
                    "Cadastro realizado com sucesso! Faça login para continuar.",
                    "success",
                );

                // Redirecionar para login
				//TODO: REDIRECIONAR PARA CONFIRMAÇÃO DE E-MAIL/TELEFONE OU CARREGAR AVATAR
                navigate("/login", {
                    state: {
                        message: "Cadastro realizado com sucesso! Faça login para continuar.",
                    },
                });
            } else {
                addNotification(result.error || "Falha no cadastro", "error");
            }
        } catch (err) {
            console.error("Erro no cadastro:", err);
            addNotification("Erro ao processar cadastro", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-title">Criar Conta</h1>
                    <p className="auth-subtitle">Junte-se a nós hoje mesmo</p>
                </div>

                {authError && (
                    <div className="auth-error-alert">
                        {authError && <p>{authError}</p>}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Nome completo:
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userData.name}
                            onChange={handleInputChange}
                            className={`form-input ${validationErrors.name ? "input-error" : ""}`}
                            placeholder="Seu nome e apelido"
                            disabled={loading || isSubmitting}
                            autoComplete="name"
                        />
                        {validationErrors.name && (
                            <span className="error-message">
                                {validationErrors.name}
                            </span>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email" className="form-label">
                            Endereço de e-mail:
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleInputChange}
                            className={`form-input ${validationErrors.email ? "input-error" : ""}`}
                            placeholder="Seu e-mail"
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
                            Senha:
                        </label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={userData.password}
                                onChange={handleInputChange}
                                className={`form-input ${validationErrors.password ? "input-error" : ""}`}
                                placeholder="Sua senha de acesso"
                                disabled={loading || isSubmitting}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading || isSubmitting}
                            >
                                 {showPassword ? <EyeSlashFill color='#888' width='20' height='20'/> : <EyeFill color='#888' width='20' height='20'/>}
                            </button>
                        </div>

                        {userData.password && (
                            <div className="password-strength">
                                <div className="strength-bar">
                                    <div
                                        className="strength-fill"
                                        style={{
                                            width: `${passwordStrength * 25}%`,
                                            backgroundColor:
                                                getPasswordStrengthColor(),
                                        }}
                                    ></div>
                                </div>
                                <div className="strength-text">
                                    Força:{" "}
                                    <span
                                        style={{
                                            color: getPasswordStrengthColor(),
                                        }}
                                    >
                                        {getPasswordStrengthText()}
                                    </span>
                                </div>
                            </div>
                        )}

                        {validationErrors.password && (
                            <span className="error-message">
                                {validationErrors.password}
                            </span>
                        )}

                        <div className="password-hints">
                            <p className="hint-title">A senha deve conter:</p>
                            <ul className="hint-list">
                                <li
                                    className={
                                        userData.password.length >= 6
                                            ? "hint-valid"
                                            : ""
                                    }
                                >
                                    Pelo menos 6 caracteres
                                </li>
                                <li
                                    className={
                                        /[a-z]/.test(userData.password) &&
                                        /[A-Z]/.test(userData.password)
                                            ? "hint-valid"
                                            : ""
                                    }
                                >
                                    Letras maiúsculas e minúsculas
                                </li>
                                <li
                                    className={
                                        /\d/.test(userData.password)
                                            ? "hint-valid"
                                            : ""
                                    }
                                >
                                    Pelo menos um número
                                </li>
                                <li
                                    className={
                                        /[!@#$%^&*(),.?":{}|<>]/.test(
                                            userData.password,
                                        )
                                            ? "hint-valid"
                                            : ""
                                    }
                                >
                                    Pelo menos um caractere especial
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">
                            Confirmar senha:
                        </label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={userData.confirmPassword}
                            onChange={handleInputChange}
                            className={`form-input ${validationErrors.confirmPassword ? "input-error" : ""}`}
                            placeholder="Repita a senha anterior"
                            disabled={loading || isSubmitting}
                            autoComplete="new-password"
                        />
                        {validationErrors.confirmPassword && (
                            <span className="error-message">
                                {validationErrors.confirmPassword}
                            </span>
                        )}
                        {userData.password &&
                            userData.confirmPassword &&
                            userData.password === userData.confirmPassword && (
                                <span className="success-message">
                                    As senhas coincidem
                                </span>
                            )}
                    </div>

                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="acceptTerms"
                                checked={userData.acceptTerms}
                                onChange={handleInputChange}
                                disabled={loading || isSubmitting}
                                className={`checkbox-input ${validationErrors.acceptTerms ? "input-error" : ""}`}
                            />
                            <span className="checkbox-text">
                                Eu concordo com os{" "}
                                <Link
                                    to="/terms"
                                    className="terms-link"
                                    target="_blank"
                                >
                                    Termos de uso
                                </Link>{" "}
                                e{" "}
                                <Link
                                    to="/privacy"
                                    className="terms-link"
                                    target="_blank"
                                >
                                    Política de privacidade
                                </Link>
                            </span>
                        </label>
                        {validationErrors.acceptTerms && (
                            <span className="error-message">
                                {validationErrors.acceptTerms}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="auth-button primary-button"
                    >
                        {loading || isSubmitting ? (
                            <>
                                <span className="spinner-small"></span>
                                Criando conta...
                            </>
                        ) : (
                            "Criar Conta"
                        )}
                    </button>

                    <div className="auth-divider">
                        <span>ou cadastre-se com</span>
                    </div>

                    <div className="social-login-container">
                        <button
                            type="button"
                            onClick={() =>
                                addNotification(
                                    "Cadastro com Google em desenvolvimento",
                                    "info",
                                )
                            }
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
                            Já tem uma conta?{" "}
                            <Link to="/login" className="auth-link">
                                Faça login
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

//export { Register };
