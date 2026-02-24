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

    const { login, loading, isAuthenticated, user } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isAuthenticated && user) {
            const from = location.state?.from?.pathname || (user.role === 'seller' ? '/seller/dashboard' : '/');
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, user, navigate, location]);

    useEffect(() => {
        if (location.state?.message) {
            showNotification(location.state.message, 'info');
        }
    }, [location, showNotification]);

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
        console.log('=== LOGIN FORM SUBMIT ===');
        console.log('Form validation:', validateForm());
        console.log('Is submitting:', isSubmitting);
        
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            console.log('Calling login with credentials:', { phoneNumber: credentials.phoneNumber.substring(0, 5) + '...', password: '***' });
            const res = await login(credentials);
            console.log('Login result:', res);

            if (res.done) {
                console.log('Login successful!');
                showNotification('Sessão iniciada com sucesso', 'success');
                if (credentials.saveCredentials) {
                    localStorage.setItem('remember', 'true');
                } else {
                    localStorage.removeItem('remember');
                }
                // Navigation will be handled by useEffect when isAuthenticated becomes true
            } else {
                console.log('Login failed:', res.error);
                showNotification(res.error || 'Erro no login', 'error');
            }
        } catch (err) {
            console.error('Login error:', err);
            showNotification('Erro no login: ' + err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    //TODO: HANDLE THIS
    const handleForgotPassword = async () => {
        if (!credentials.phoneNumber) {
            showNotification(
                'Digite seu email ou telefone para recuperar a senha',
                'warning'
            );
            return;
        }
        showNotification('Email de recuperação enviado!', 'success');
    };

    const handleSocialLogin = provider => {
        showNotification(`Login com ${provider} em desenvolvimento`, 'info');
    };

    return (
        <div className='min-h-screen flex'>
            {/* Left Panel - Branding */}
            <div
                className='hidden lg:flex lg:w-1/2 relative top-0 left-0 min-h-screen'
                style={{
                    background:
                        'linear-gradient(135deg, #FF6000 0%, #FF8C00 100%)',
                }}
            >
                <div
                    className='absolute top-0 left-0 w-full h-full'
                    style={{
                        background: 'url("/images/hero.png") center/cover',
                        opacity: 0.15,
                    }}
                ></div>
                <div className='flex flex-col justify-center items-center text-white'>
                    <Link to='/' className='no-underline mb-20'>
                        <h2 className='font-bold' style={{ fontSize: '2rem' }}>
                            <span style={{ color: '#fff' }}>DUBA</span>
                            <span style={{ color: '#333' }}>NING</span>
                        </h2>
                    </Link>
                    <h1 className='text-5xl font-bold mb-16'>
                        Bem-vindo de volta!
                    </h1>
                    <p className='text-xl mb-16 text-center w-3/4'>
                        Aceda à sua conta para continuar a explorar milhares de
                        produtos e serviços em Moçambique.
                    </p>
                    <div className='flex items-center gap-3 mt-16'>
                        <div className='flex items-center gap-2'>
                            <i className='bi bi-shield-check text-2xl'></i>
                            <span>Pagamento Seguro</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <i className='bi bi-truck text-2xl'></i>
                            <span>Entrega Rápida</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className='w-full lg:w-1/2 flex items-center bg-gray-100 overflow-y-auto'>
                <div className='w-full flex flex-col bg-gray-100 items-center justify-center py-3'>
                    <div  style={{maxWidth: '450px'}}>
                    <div className='text-center mb-16 lg:hidden'>
                        <Link to='/' className='no-underline'>
                            <h2
                                className='font-bold mb-3'
                                style={{ fontSize: '2rem'}}
                            >
                                <span style={{ color: '#FF6000' }}>DUBA</span>
                                <span style={{ color: '#333' }}>NING</span>
                            </h2>
                        </Link>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-16'>
                        <h3 className='font-bold mb-4'>Entrar</h3>
                        <p className='text-gray-500 mb-16'>
                            Faça login para continuar
                        </p>
                        {/* TODO: USE action= */}
                        <form onSubmit={handleSubmit}>
                            <div className='mb-3'>
                                <label
                                    htmlFor='phoneNumber'
                                    className='block font-semibold text-sm text-gray-600 mb-2'
                                >
                                    Número de telefone
                                </label>
                                <div className='flex items-center text-lg'>
                                    <span className='bg-gray-100 px-4 py-3 border-2 border-r-0 border-gray-200 rounded-l-lg'>
                                        <i className='bi bi-person text-gray-500'></i>
                                    </span>
                                    <input
                                        type='text'
                                        id='phoneNumber'
                                        name='phoneNumber'
                                        value={credentials.phoneNumber}
                                        onChange={handleInputChange}
                                        className={`flex-1 px-4 py-3 bg-gray-100 border-2 border-l-0 rounded-r-lg focus:outline-none focus:border-blue-500 ${
                                            validationErrors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder='+258 84 123 4567'
                                        disabled={loading || isSubmitting}
                                    />
                                </div>
                                {validationErrors.phoneNumber && (
                                    <div className='text-red-500 text-sm mt-1'>
                                        {validationErrors.phoneNumber}
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label
                                    htmlFor='password'
                                    className='block font-semibold text-sm text-gray-600 mb-2'
                                >
                                    Senha
                                </label>
                                <div className='flex items-center text-lg'>
                                    <span className='bg-gray-100 px-4 py-3 border-2 border-r-0 border-gray-200 rounded-l-lg'>
                                        <i className='bi bi-lock text-gray-500'></i>
                                    </span>
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        id='password'
                                        name='password'
                                        value={credentials.password}
                                        onChange={handleInputChange}
                                        className={`flex-1 px-4 py-3 bg-gray-100 border-2 border-l-0 border-r-0 focus:outline-none focus:border-blue-500 ${
                                            validationErrors.password ? 'border-red-500' : 'border-gray-200'
                                        }`}
                                        placeholder='Digite a senha'
                                        disabled={loading || isSubmitting}
                                    />
                                    <button
                                        type='button'
                                        className='bg-gray-100 px-4 py-3 border-2 border-l-0 border-gray-200 rounded-r-lg hover:bg-gray-200 transition-colors'
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
                                    <div className='text-red-500 text-sm mt-1'>
                                        {validationErrors.password}
                                    </div>
                                )}
                            </div>

<div className='flex justify-between items-center mb-16'>
                                <div className='flex items-center'>
                                    <input
                                        className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2'
                                        type='checkbox'
                                        name='saveCredentials'
                                        id='saveCredentials'
                                        checked={credentials.saveCredentials}
                                        onChange={handleInputChange}
                                    />
                                    <label
                                        className='ml-2 text-sm font-medium text-gray-900'
                                        htmlFor='saveCredentials'
                                    >
                                        Lembrar-me
                                    </label>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => navigate('/forgot-password')}
                                    className='text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors'
                                    style={{ color: '#FF6000' }}
                                >
                                    Esqueceu a senha?
                                </button>
                            </div>

                            <button
                                type='submit'
                                className='w-full py-3 px-6 font-bold text-black rounded-lg mb-3'
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
                                        <span className='inline-block w-4 h-4 border-2 border-gray-300 border-t-black rounded-full animate-spin mr-2'></span>
                                        Entrando...
                                    </>
                                ) : (
                                    'Continuar'
                                )}
                            </button>

                            <div className='text-center my-16'>
                                <span
                                    className='text-gray-500 text-sm px-2 bg-white relative inline-block'
                                    style={{ background: '#fff' }}
                                >
                                    ou continue com
                                </span>
                                 <hr
                                    className='relative border-gray-300'
                                    style={{ borderColor: '#ddd', marginTop: '-10px'}}
                                />

                            </div>

                            <div className='flex gap-3'>
                                <button
                                    type='button'
                                    onClick={() => handleSocialLogin('Google')}
                                    className='flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center'
                                    disabled={loading || isSubmitting}
                                >
                                    <GoogleLogo
                                        className='mr-2'
                                        size='20'
                                    />{' '}
                                    Google
                                </button>
                                <button
                                    type='button'
                                    onClick={() => handleSocialLogin('GitHub')}
                                    className='flex-1 py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center'
                                    disabled={loading || isSubmitting}
                                >
                                    <GithubLogo
                                        className='mr-2'
                                        size='20'
                                    />{' '}
                                    GitHub
                                </button>
                            </div>
                        </form>

                        <p className='text-center text-gray-500 text-sm mt-16 mb-0'>
                            Não tens uma conta?{' '}
                            <Link
                                to='/register'
                                className='font-bold no-underline'
                                style={{ color: '#FF6000' }}
                            >
                                Crie agora aqui
                            </Link>
                        </p>
                    </div>

                    <p className='text-center text-gray-500 text-sm mt-16'>
                        Ao continuar, aceita os{' '}
                        <Link to='/terms' className='no-underline'>
                            Termos de Uso
                        </Link>{' '}
                        e a{' '}
                        <Link to='/privacy' className='no-underline'>
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
