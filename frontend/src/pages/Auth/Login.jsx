// src/views/Auth/Login.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import {
    EyeFill,
    EyeSlashFill,
    GithubLogo,
    GoogleLogo,
} from '../../components/Svg';

function Login() {
    const [credentials, setCredentials] = useState({
        phoneNumber: '', //TODO: phoneNumber
        password: '',
        saveCredentials: false,
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); //TODO: USAR useFormStatus???

    const { login, loading, isAuthenticated } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    useEffect(() => {
        if (location.state?.message) {
            addNotification(location.state.message, 'info');
        }
    }, [location, addNotification]);

    const validateForm = () => {
        const errors = {};
        if (!credentials.phoneNumber.trim()) {
            errors.phoneNumber = 'Insira seu número de telefone ou e-mail';
        }
        if (!credentials.password) {
            errors.password = 'Senha é obrigatória';
        } else if (credentials.password.length < 6) {
            errors.password = 'A senha deve conter pelo menos 6 caracteres';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    //TODO: Se saveCredentials, criptografar refreshToken e salvar em LocalStorage,
    //E usar useEffect em authContext para verificar & buscar refreshToken de lá antes de tentar
    //buscar usuário (em checkAuthentication)
    const handleSubmit = async e => {
        //TODO: ADD OTP 2 STEP VERIFICATION
        e.preventDefault();
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await login(credentials);

            if (res.done) {
                addNotification('Sessão iniciada com sucesso', 'success');
                if (credentials.saveCredentials) {
                    localStorage.setItem('remember', 'true');
                } else {
                    localStorage.removeItem('remember');
                }
                const from =
                    location.state?.from?.pathname ||
                    (res.user?.role === 'seller' ? '/seller/dashboard' : '/');
                navigate(from, { replace: true });
            } else {
                addNotification(res.error || 'Erro no login', 'error');
            }
        } catch (err) {
            addNotification('Erro no login: ' + err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    //TODO: HANDLE THIS
    const handleForgotPassword = async () => {
        if (!credentials.phoneNumber) {
            addNotification(
                'Digite seu email ou telefone para recuperar a senha',
                'warning'
            );
            return;
        }
        addNotification('Email de recuperação enviado!', 'success');
    };

    const handleSocialLogin = provider => {
        addNotification(`Login com ${provider} em desenvolvimento`, 'info');
    };

    return (
        <div className='vh-100 d-flex'>
            {/* Left Panel - Branding */}
            <div
                className='d-none d-lg-flex col-lg-6 position-relative top-0 left-0 vh-100'
                style={{
                    background:
                        'linear-gradient(135deg, #FF6000 0%, #FF8C00 100%)',
                }}
            >
                <div
                    className='position-absolute top-0 start-0 w-100 h-100'
                    style={{
                        background: 'url("/images/hero.png") center/cover',
                        opacity: 0.15,
                    }}
                ></div>
                <div className='d-flex flex-column justify-content-center align-items-center text-white'>
                    <Link to='/' className='text-decoration-none mb-5'>
                        <h2 className='fw-bold' style={{ fontSize: '2rem' }}>
                            <span style={{ color: '#fff' }}>DUBA</span>
                            <span style={{ color: '#333' }}>NING</span>
                        </h2>
                    </Link>
                    <h1 className='display-5 fw-bold mb-4'>
                        Bem-vindo de volta!
                    </h1>
                    <p className='lead mb-4 text-center w-75'>
                        Aceda à sua conta para continuar a explorar milhares de
                        produtos e serviços em Moçambique.
                    </p>
                    <div className='d-flex align-items-center gap-3 mt-4'>
                        <div className='d-flex align-items-center gap-2'>
                            <i className='bi bi-shield-check fs-4'></i>
                            <span>Pagamento Seguro</span>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            <i className='bi bi-truck fs-4'></i>
                            <span>Entrega Rápida</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className='col-12 col-lg-6 d-flex align-items-center bg-light overflow-y-auto'>
                <div className='w-100 d-flex flex-column bg-light align-items-center justify-content-center py-3'>
                    <div  style={{maxWidth: '450px'}}>
                    <div className='text-center mb-4 d-lg-none'>
                        <Link to='/' className='text-decoration-none'>
                            <h2
                                className='fw-bold mb-3'
                                style={{ fontSize: '2rem'}}
                            >
                                <span style={{ color: '#FF6000' }}>DUBA</span>
                                <span style={{ color: '#333' }}>NING</span>
                            </h2>
                        </Link>
                    </div>

                    <div className='bg-white rounded-4 shadow-sm p-4'>
                        <h3 className='fw-bold mb-1'>Entrar</h3>
                        <p className='text-muted mb-4'>
                            Faça login para continuar
                        </p>
                        {/* TODO: USE action= */}
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label
                                    htmlFor='phoneNumber'
                                    className='form-label fw-semibold small text-muted'
                                >
                                    Número de telefone
                                </label>
                                <div className='input-group input-group-lg'>
                                    <span className='input-group-text bg-light border-end-0'>
                                        <i className='bi bi-person text-muted'></i>
                                    </span>
                                    <input
                                        type='text'
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        value={credentials.phoneNumber}
                                        onChange={handleInputChange}
                                        className={`form-control bg-light border-start-0 ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                                        placeholder='+258 84 123 4567'
                                        disabled={loading || isSubmitting}
                                    />
                                </div>
                                {validationErrors.phoneNumber && (
                                    <div className='text-danger small mt-1'>
                                        {validationErrors.phoneNumber}
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label
                                    htmlFor='password'
                                    className='form-label fw-semibold small text-muted'
                                >
                                    Senha
                                </label>
                                <div className='input-group input-group-lg'>
                                    <span className='input-group-text bg-light border-end-0'>
                                        <i className='bi bi-lock text-muted'></i>
                                    </span>
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id='password'
                                        name='password'
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                        className={`form-control bg-light border-start-0 border-end-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                        placeholder='Digite a senha'
                                        disabled={loading || isSubmitting}
                                    />
                                    <button
                                        type='button'
                                        className='input-group-text bg-light border-start-0'
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeSlashFill
                                                color='#888'
                                                width='18'
                                                height='18'
                                            />
                                        ) : (
                                            <EyeFill
                                                color='#888'
                                                width='18'
                                                height='18'
                                            />
                                        )}
                                    </button>
                                </div>
                                {validationErrors.password && (
                                    <div className='text-danger small mt-1'>
                                        {validationErrors.password}
                                    </div>
                                )}
                            </div>

                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <div className='form-check'>
                                    <input
                                        className='form-check-input'
                                        type='checkbox'
                                        name='saveCredentials'
                                        id='saveCredentials'
                                        checked={credentials.saveCredentials}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        className='form-check-label small'
                                        htmlFor='saveCredentials'
                                    >
                                        Lembrar-me
                                    </label>
                                </div>
                                <button
                                    type='button'
                                    onClick={handleForgotPassword}
                                    className='btn btn-link p-0 text-decoration-none small fw-semibold'
                                    style={{ color: '#FF6000' }}
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>

                            <button
                                type='submit'
                                className='btn btn-lg w-100 fw-bold mb-3'
                                style={{
                                    backgroundColor: '#FFD814',
                                    color: '#0F1111',
                                    border: 'none',
                                }}
                                disabled={loading || isSubmitting}
                            >
                                {loading ||
                                isSubmitting /* TODO: USAR SPINNER CUSTOM */ ? (
                                    <>
                                        <span className='spinner-border spinner-border-sm me-2'></span>
                                        Entrando...
                                    </>
                                ) : (
                                    'Continuar'
                                )}
                            </button>

                            <div className='text-center my-4'>
                                <span
                                    className='text-muted small px-2 d-inline-block position-relative'
                                    style={{ background: '#fff' }}
                                >
                                    ou continue com
                                </span>
                                 <hr
                                    className='position-relative'
                                    style={{ borderColor: '#ddd', marginTop: '-10px'}}
                                />
                               
                            </div>

                            <div className='d-flex gap-3'>
                                <button
                                    type='button'
                                    onClick={() => handleSocialLogin('Google')}
                                    className='btn flex-grow-1 py-2 social-btn'
                                    disabled={loading || isSubmitting}
                                >
                                    <GoogleLogo
                                        className='me-2'
                                        size='20'
                                    />{' '}
                                    Google
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleSocialLogin('GitHub')}
                                    className='btn flex-grow-1 py-2 social-btn'
                                    disabled={loading || isSubmitting}
                                >
                                    <GithubLogo
                                        className='me-2'
                                        size='20'
                                    />{' '}
                                    GitHub
                                </button>
                            </div>
                        </form>

                        <p className='text-center text-muted small mt-4 mb-0'>
                            Não tens uma conta?{' '}
                            <Link
                                to='/register'
                                className='fw-bold text-decoration-none'
                                style={{ color: '#FF6000' }}
                            >
                                Crie agora aqui
                            </Link>
                        </p>
                    </div>

                    <p className='text-center text-muted small mt-4'>
                        Ao continuar, aceita os{' '}
                        <Link to='/terms' className='text-decoration-none'>
                            Termos de Uso
                        </Link>{' '}
                        e a{' '}
                        <Link to='/privacy' className='text-decoration-none'>
                            Política de Privacidade
                        </Link>{' '}
                        da DUBANING.
                    </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
