// src/views/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { EyeFill, EyeSlashFill } from '../../components/Svg';

function Register() {
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'client',
        acceptTerms: false,
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, loading, isAuthenticated } = useAuth();
    const { addNotification } = useNotification();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (!userData.password) {
            setPasswordStrength(0);
            return;
        }
        let strength = 0;
        if (userData.password.length >= 8) strength++;
        if (/\d/.test(userData.password)) strength++;
        if (/[a-z]/.test(userData.password) && /[A-Z]/.test(userData.password))
            strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(userData.password)) strength++;
        setPasswordStrength(strength);
    }, [userData.password]);

    const validateForm = () => {
        const errors = {};
        if (!userData.firstName.trim()) errors.firstName = 'Nome é obrigatório';
        if (!userData.lastName.trim())
            errors.lastName = 'Apelido é obrigatório';
        if (!userData.phoneNumber.trim())
            errors.phoneNumber = 'Telefone é obrigatório';
        if (userData.email && !/\S+@\S+\.\S+/.test(userData.email))
            errors.email = 'Email inválido';
        if (!userData.password) errors.password = 'Senha é obrigatória';
        else if (userData.password.length < 6)
            errors.password = 'Mínimo 6 caracteres';
        if (!userData.confirmPassword)
            errors.confirmPassword = 'Confirme sua senha';
        else if (userData.password !== userData.confirmPassword)
            errors.confirmPassword = 'As senhas não coincidem';
        if (!userData.acceptTerms) errors.acceptTerms = 'Aceite os termos';
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (validationErrors[name])
            setValidationErrors(prev => ({ ...prev, [name]: '' }));
    };

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return '#dc3545';
        if (passwordStrength === 2) return '#ffc107';
        if (passwordStrength === 3) return '#0d6efd';
        return '#198754';
    };

    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateForm() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const res = await register({
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                email: userData.email,
                password: userData.password,
                role: userData.role,
            });
            if (res.done) {
                //TODO: MULTI-STEP REGISTRATION (EACH STEP IS A COMPONENT),
                //THE SECOND IS NUMBER VALIDATION (OTP), THE LAST IS CONGRATULATIONS
                //(REPLACE NOTIFICATIONS BY ERROR & SUCCESS DIALOGS)
                addNotification(
                    'Conta criada com sucesso! Faça login.',
                    'success'
                );
                navigate('/login');
            } else {
                addNotification(res.error || 'Erro no registro', 'error');
            }
        } catch (err) {
            addNotification('Erro no cadastro: ' + err.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='min-vh-100 d-flex'>
            {/* Left Panel - Branding */}
            <div
                className='d-none d-lg-flex col-lg-5 position-relative'
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
                    <h1 className='display-5 fw-bold mb-4'>Junte-se a nós!</h1>
                    <p className='lead text-center mb-4'>
                        Crie sua conta gratuita e comece a comprar ou vender no
                        maior marketplace de Moçambique.
                    </p>
                    <div className='mt-4'>
                        <div className='d-flex align-items-center gap-3 mb-3'>
                            <i className='bi bi-check-circle-fill fs-4'></i>
                            <span>Cadastro rápido sem e-mail obrigatório</span>
                        </div>
                        <div className='d-flex align-items-center gap-3 mb-3'>
                            <i className='bi bi-check-circle-fill fs-4'></i>
                            <span>Pagamentos via M-Pesa, e-Mola e mKesh</span>
                        </div>
                        <div className='d-flex align-items-center gap-3'>
                            <i className='bi bi-check-circle-fill fs-4'></i>
                            <span>Suporte 100% moçambicano</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className='col-12 col-lg-7 d-flex align-items-center justify-content-center bg-light py-4 px-3'>
                <div className='w-100' style={{ maxWidth: '500px' }}>
                    <div className='text-center mb-4 d-lg-none'>
                        <Link to='/' className='text-decoration-none'>
                            <h2
                                className='fw-bold'
                                style={{ fontSize: '2rem' }}
                            >
                                <span style={{ color: '#FF6000' }}>DUBA</span>
                                <span style={{ color: '#333' }}>NING</span>
                            </h2>
                        </Link>
                    </div>

                    <div className='bg-white rounded-4 shadow-sm p-4 p-md-5'>
                        <h3 className='fw-bold mb-1'>Criar Conta</h3>
                        <p className='text-muted mb-4'>
                            Preencha os dados abaixo
                        </p>

                        {/*TODO: USE CUSTOM RADIOS (Role Selection Cards) */}
                        <div className='row g-3 mb-4'>
                            <div className='col-6'>
                                <div
                                    onClick={() =>
                                        setUserData(prev => ({
                                            ...prev,
                                            role: 'client',
                                        }))
                                    }
                                    className={`card h-100 text-center p-3 cursor-pointer ${userData.role === 'client' ? 'border-primary border-1' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <i
                                        className={`bi bi-cart3 fs-1 mb-2 ${userData.role === 'client' ? 'text-primary' : 'text-muted'}`}
                                    ></i>
                                    <h6 className='fw-bold mb-0'>
                                        Quero Comprar
                                    </h6>
                                    <small className='text-muted'>
                                        Cliente
                                    </small>
                                </div>
                            </div>
                            <div className='col-6'>
                                <div
                                    onClick={() =>
                                        setUserData(prev => ({
                                            ...prev,
                                            role: 'seller',
                                        }))
                                    }
                                    className={`card h-100 text-center p-3 ${userData.role === 'seller' ? 'border-primary border-1' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <i
                                        className={`bi bi-shop fs-1 mb-2 ${userData.role === 'seller' ? 'text-primary' : 'text-muted'}`}
                                    ></i>
                                    <h6 className='fw-bold mb-0'>
                                        Quero Vender
                                    </h6>
                                    <small className='text-muted'>
                                        Vendedor
                                    </small>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className='row g-3 mb-3'>
                                <div className='col-12'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        Nome completo
                                    </label>
                                    <input
                                        type='text'
                                        name='firstName'
                                        value={userData.firstName}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${validationErrors.firstName ? 'is-invalid' : ''}`}
                                        placeholder='João Silva'
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.firstName && (
                                        <div className='text-danger small mt-1'>
                                            {validationErrors.firstName}
                                        </div>
                                    )}
                                </div>
                                <div className='col-12'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        Apelido
                                    </label>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={userData.lastName}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${validationErrors.lastName ? 'is-invalid' : ''}`}
                                        placeholder='Cardoso'
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.lastName && (
                                        <div className='text-danger small mt-1'>
                                            {validationErrors.lastName}
                                        </div>
                                    )}
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        Telefone
                                    </label>
                                    <input
                                        type='tel'
                                        name='phoneNumber'
                                        value={userData.phoneNumber}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                                        placeholder='+258 84 123 4567'
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.phoneNumber && (
                                        <div className='text-danger small mt-1'>
                                            {validationErrors.phoneNumber}
                                        </div>
                                    )}
                                </div>
                                <div className='col-md-6'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        E-mail (opcional)
                                    </label>
                                    <input
                                        type='email'
                                        name='email'
                                        value={userData.email}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${validationErrors.email ? 'is-invalid' : ''}`}
                                        placeholder='seu.email@exemplo.com'
                                        disabled={isSubmitting}
                                    />
                                    {validationErrors.email && (
                                        <div className='text-danger small mt-1'>
                                            {validationErrors.email}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='mb-3'>
                                <label className='form-label fw-semibold small text-muted'>
                                    Senha
                                </label>
                                <div className='input-group input-group-lg'>
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name='password'
                                        value={userData.password}
                                        onChange={handleInputChange}
                                        className={`form-control bg-light border-end-0 ${validationErrors.password ? 'is-invalid' : ''}`}
                                        placeholder='Mínimo 6 caracteres'
                                        disabled={isSubmitting}
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
                                {userData.password && (
                                    <div className='mt-2'>
                                        <div
                                            className='progress'
                                            style={{ height: '5px' }}
                                        >
                                            <div
                                                className='progress-bar'
                                                role='progressbar'
                                                style={{
                                                    width: `${passwordStrength * 25}%`,
                                                    backgroundColor:
                                                        getPasswordStrengthColor(),
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                {validationErrors.password && (
                                    <div className='text-danger small mt-1'>
                                        {validationErrors.password}
                                    </div>
                                )}
                            </div>

                            <div className='mb-3'>
                                <label className='form-label fw-semibold small text-muted'>
                                    Confirmar senha
                                </label>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='confirmPassword'
                                    value={userData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`form-control form-control-lg bg-light ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                                    placeholder='Repita a senha'
                                    disabled={isSubmitting}
                                />
                                {validationErrors.confirmPassword && (
                                    <div className='text-danger small mt-1'>
                                        {validationErrors.confirmPassword}
                                    </div>
                                )}
                                {userData.password &&
                                    userData.confirmPassword &&
                                    userData.password ===
                                        userData.confirmPassword && (
                                        <div className='text-success small mt-1'>
                                            <i className='bi bi-check-circle me-1'></i>
                                            Senhas coincidem
                                        </div>
                                    )}
                            </div>

                            <div className='form-check mb-4'>
                                <input
                                    className={`form-check-input ${validationErrors.acceptTerms ? 'is-invalid' : ''}`}
                                    type='checkbox'
                                    name='acceptTerms'
                                    id='acceptTerms'
                                    checked={userData.acceptTerms}
                                    onChange={handleInputChange}
                                />
                                <label
                                    className='form-check-label small'
                                    htmlFor='acceptTerms'
                                >
                                    Concordo com os{' '}
                                    <Link
                                        to='/terms'
                                        className='text-decoration-none'
                                        style={{ color: '#FF6000' }}
                                    >
                                        Termos de Uso
                                    </Link>{' '}
                                    e{' '}
                                    <Link
                                        to='/privacy'
                                        className='text-decoration-none'
                                        style={{ color: '#FF6000' }}
                                    >
                                        Política de Privacidade
                                    </Link>
                                </label>
                                {validationErrors.acceptTerms && (
                                    <div className='text-danger small'>
                                        {validationErrors.acceptTerms}
                                    </div>
                                )}
                            </div>

                            <button
                                type='submit'
                                className='btn btn-lg w-100 fw-bold'
                                style={{
                                    backgroundColor: '#FFD814',
                                    color: '#0F1111',
                                    border: 'none',
                                }}
                                disabled={loading || isSubmitting}
                            >
                                {loading || isSubmitting ? (
                                    <>
                                        <span className='spinner-border spinner-border-sm me-2'></span>
                                        Criando...
                                    </>
                                ) : (
                                    'Criar Minha Conta'
                                )}
                            </button>
                        </form>

                        <p className='text-center text-muted small mt-4 mb-0'>
                            Já tens uma conta?{' '}
                            <Link
                                to='/login'
                                className='fw-bold text-decoration-none'
                                style={{ color: '#FF6000' }}
                            >
                                Entrar agora
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
