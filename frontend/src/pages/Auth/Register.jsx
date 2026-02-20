// src/views/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';
import { EyeFill, EyeSlashFill } from '../../components/Svg';

function Register() {//prevData
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        accept: false,
    });

    //++
    const [step, setStep] = useState(0)
    const { isAuthenticated } = useAuth();
    
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

   const jsxForm = [
        <Step1 data={data} setData={setData} setStep={setStep} />,
        <Step2 data={data} setData={setData} setStep={setStep} />,
        <Step3 data={data} setData={setData} setStep={setStep} />
   ]

    return (
        <div className='vh-100 d-flex overflow-y-hidden'>
            {/* Left Panel - Branding */}
            <div
                className='d-none d-lg-flex col-lg-6 position-relative top-0 left-0 vh-100'
                
            >
                <div
                    className='position-absolute top-0 start-0 w-100 h-100'
                    style={{
                        background: 'url("/images/hero.png") center/cover',
                        opacity: 0.4,
                    }}
                ></div>
                <div className='d-flex flex-column justify-content-center align-items-center text-white' style={{
                        background: 'url("/images/hero.png") center/cover, linear-gradient(135deg, #FF6000 0%, #FF8C00 100%)',
                        opacity: 1,
                    }}>
                    <Link to='/' className='text-decoration-none mb-5s rounded-2'>
                        <h2 className='fw-bold' style={{ fontSize: '2.5rem' }}>
                            <span style={{ color: '#FF6000'}}>DUBA</span>
                            <span style={{ color: '#333' }}>NING</span>
                        </h2>
                    </Link>
                    <h1 className='display-5 fw-bold mb-4'>Junte-se a nós!</h1>
                    <p className='lead text-center mb-4 w-75'>
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
            <div className='col-12 col-lg-6 bg-light overflow-y-auto p-4 p-md-5'>
                <div className='w-100 d-flex bg-light align-items-center justify-content-center'>
                    <div  style={{maxWidth: '450px'}}>
                    <div className='text-center mb-4 d-lg-none'>
                        <Link to='/' className='text-decoration-none'>
                            <h2 className='fw-bold' style={{ fontSize: '2rem' }}>
                                <span style={{ color: '#FF6000' }}>DUBA</span>
                                <span style={{ color: '#333' }}>NING</span>
                            </h2>
                        </Link>
                    </div>

                    <div className='bg-white shadow-sm rounded-4 p-4'>
                        <h3 className='fw-bold mb-1'>Criar conta</h3>
                        <p className='text-muted'>
                            Passo {step + 1} de {jsxForm.length}
                        </p>
                        <hr className='mb-3'/>
                        {/** FORM STEPS */}
                        {jsxForm[step]}

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
        </div>
    );
}


function Step1({data, setData, setStep}) {
    //const [isValid, setIsValid] = useState(false);
    //const [role, setRole] = useState('buyer');

    function handleChange(role){
        setData(prev => {
            return {
                ...prev,
                role //ADD FOELD
            }
        })
    }
    function handleSubmit(e) {
        e.preventDefault()
        
        //GO TO NEXT STEP
        setStep(prev => prev + 1);
        //setStep(step+1)
    }
 
    return (
        <form onSubmit={handleSubmit}>
            <p className='mb-4'>
                Que tipo de conta pretende criar?
                        </p>
            {/*
                            <h6 className=''>
                                Que tipo de conta pretende criar?
                            </h6>
                            <div className='col-6'>
                                <label htmlFor='seller' className={`border rounded-2 py-2 px-3 d-flex ${userData.role === 'seller' ? ' border-primary' : ' border-secondary'}`}>
                                    <input type='radio' className='border border-primary rounded-sm' name='role1' id='seller'/> 
                                    <div className='d-flex flex-column flex-grow-1 ms-2'>
                                        <h6 className='fw-bold'>Vendedor</h6>
                                        <p className='text-muted' style={{fontSize: '13px'}}>Quero vender produtos</p>
                                    </div>
                                </label>
                            </div>
                            <div className='col-6'>
                                <label htmlFor='buyer' className={`border rounded-2 py-2 align-item-end px-3 d-flex ${userData.role === 'client' ? ' border-primary' : ' border-secondary'}`}>
                                    <input type='radio' className='' name='role1' id='buyer'/> 
                                    <div className='d-flex flex-column justify-content-center justify-items-center flex-grow-1 ms-2'>
                                        <h6 className='fw-bold'>Comprador</h6>
                                        <p className='text-muted' style={{fontSize: '13px'}}>Quero comprar produtos</p>
                                    </div>
                                </label>
                            </div>
                                */}

              <div className='flex flex-column g-3 mb-3'>
         {/*TODO: USE CUSTOM RADIOS (Role Selection Cards) */}
                        <div className='row g-3 mb-4'>
                            <div className='col-6'>
                                <div
                                    onClick={() => handleChange('buyer')}
                                    className={`card h-100 text-center p-3 cursor-pointer ${data.role === 'buyer' ? 'border-primary border-1' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <i
                                        className={`bi bi-cart3 fs-1 mb-2 ${data.role === 'buyer' ? 'text-primary' : 'text-muted'}`}
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
                                    onClick={() => handleChange('seller')}
                                    className={`card h-100 text-center p-3 ${data.role === 'seller' ? 'border-primary border-1' : 'border-light'}`}
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <i
                                        className={`bi bi-shop fs-1 mb-2 ${data.role === 'seller' ? 'text-primary' : 'text-muted'}`}
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
                    <div className='mt-3'>
                        <button
                                type='submit'
                                className='btn btn-lg w-100 fw-bold'
                                style={{
                                    backgroundColor: '#FFD814',
                                    color: '#0F1111',
                                    border: 'none',
                                }}
                            >
                                Próximo
                            </button>
                    </div>
                </div>
        </form>

    )
}

//User details: firstName, lastName, gender, dateOfBirth, placeOfBirth
function Step2({data, setData, setStep}) {
    //const [isValid, setIsValid] = useState(false);
    const [errors, setErrors] = useState(new Map());
    /*const [data, setData] = useState({
        firstName: '',
        lastName: ''
    })*/

    function validateStep() {
        const error = new Map();

        if (!data.firstName.trim()) {
            error.set('firstName', 'Nome é obrigatório');
        }

        if (!data.lastName.trim()) {
            error.set('lastName', 'Apelido é obrigatório');
        }

        setErrors(error);
        return error.size === 0;
    };

     const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        /*
        if (errors.has(name)) {
            setErrors(prev => (new Map([...prev, [name, '']])));
        }
        */
        if (errors.has(name)) {
            setErrors(prev => {
                let nextError = new Map([ ...prev])
                
                nextError.delete(name)
                return nextError
            })
        }
    };

    
    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateStep()) return;

        //NEXT
        setStep(prev => prev + 1)
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='col-12 mb-3'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        Nome completo
                                    </label>
                                    <input
                                        type='text'
                                        name='firstName'
                                        value={data.firstName}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${errors.has('firstName') ? 'is-invalid' : ''}`}
                                        placeholder='João Silva'
                                        
                                    />
                                    {errors.has('firstName') && (
                                        <div className='text-danger small mt-1'>
                                            {errors.get('firstName')}
                                        </div>
                                    )}
            </div>
            <div className='col-12 mb-3'>
                                    <label className='form-label fw-semibold small text-muted'>
                                        Apelido
                                    </label>
                                    <input
                                        type='text'
                                        name='lastName'
                                        value={data.lastName}
                                        onChange={handleInputChange}
                                        className={`form-control form-control-lg bg-light ${errors.has('lastName') ? 'is-invalid' : ''}`}
                                        placeholder='Cardoso'
                                    />
                                    {errors.has('lastName') && (
                                        <div className='text-danger small mt-1'>
                                            {errors.get('lastName')}
                                        </div>
                                    )}
            </div>

            <div className='d-flex gap-3 mt-4'>
                <button
                    type='button'
                    className='btn btn-lg fw-bold'
                    style={{
                        backgroundColor: '#FFD814',
                        color: '#0F1111',
                        border: 'none',
                    }}
                    onClick={() => setStep(prev => prev - 1)}
                >
                    Anterior
                </button>
                <button
                    type='submit'
                    className='btn btn-lg fw-bold flex-grow-1'
                    style={{
                        backgroundColor: '#FFD814',
                        color: '#0F1111',
                        border: 'none',
                    }}
                >
                    Próximo
                </button>
            </div>
        </form>
    )
}

//TODO: STEP 3 (ADDRESS: (state, district, road, neighborhood, quarter, houseNumber))

//formData == userData
function Step3({data, setData, setStep}) {
    /*const [data, setData] = useState({
        phoneNumber: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
        accept: false,
    })*/

    const [errors, setErrors] = useState(new Map())
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false)

    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const { register } = useAuth()

    useEffect(() => {
        if (!data.password) {
            setPasswordStrength(0);
            return;
        }
        let strength = 0;
        if (data.password.length >= 8) strength++;
        if (/\d/.test(data.password)) strength++;
        if (/[a-z]/.test(data.password) && /[A-Z]/.test(data.password))
            strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) strength++;
        setPasswordStrength(strength);
    }, [data.password]);

    const getPasswordStrengthColor = () => {
        if (passwordStrength <= 1) return '#dc3545';
        if (passwordStrength === 2) return '#ffc107';
        if (passwordStrength === 3) return '#0d6efd';
        return '#198754';
    };

    const validateStep = () => {
        const error = new Map();
        
        if (!data.phoneNumber.trim()) error.set('phoneNumber', 'Telefone é obrigatório');
        if (data.email && !/\S+@\S+\.\S+/.test(data.email)) error.set('email', 'Email inválido');
        if (!data.password) error.set('password', 'Senha é obrigatória');
        else if (data.password.length < 6) error.set('password', 'Mínimo 6 caracteres');
        if (!data.confirmPassword)
            error.set('confirmPassword', 'Confirme sua senha');
        else if (data.password !== data.confirmPassword)
            error.set('confirmPassword', 'As senhas não coincidem');
        if (!data.accept) error.set('accept', 'Aceite os termos de utilização');

        setErrors(error);
        return error.size === 0;
    };

    const handleInputChange = e => {
        const { name, value, type, checked } = e.target;

        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        
        if (errors.has(name)) {
            setErrors(prev => {
                let nextError = new Map([ ...prev])
                
                nextError.delete(name)
                return nextError
            })
        }
    };

    
    const handleSubmit = async e => {
        e.preventDefault();
        if (!validateStep() || submitting) return;

        //TODOS STEPS OK, SUBMETER
        setSubmitting(true);
        try {
            const res = await register(data);
            if (res.done) {
                //TODO: MULTI-STEP REGISTRATION (EACH STEP IS A COMPONENT),
                //THE SECOND IS NUMBER VALIDATION (OTP), THE LAST IS CONGRATULATIONS
                //(REPLACE NOTIFICATIONS BY ERROR & SUCCESS DIALOGS)
                showNotification(
                    'Conta criada com sucesso! Faça login.',
                    'success'
                );
                navigate('/login');
            } else {
                showNotification(res.error || 'Erro no registro', 'error');
            }
        } catch (err) {
            showNotification('Erro no cadastro: ' + err.message, 'error');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='row g-3 mb-4'>
                <div className='col-12 col-md-6'>
                    <label className='form-label fw-semibold small text-muted'>
                        Telefone
                    </label>
                    <input
                        type='tel'
                        name='phoneNumber'
                        value={data.phoneNumber}
                        onChange={handleInputChange}
                        className={`form-control form-control-lg bg-light ${errors.has('phoneNumber') ? 'is-invalid' : ''}`}
                        placeholder='+258 86 123 4567'
                        disabled={submitting}
                    />
                    {errors.has('phoneNumber') && (
                        <div className='text-danger small mt-1'>
                            {errors.get('phoneNumber')}
                        </div>
                    )}
                </div>

                <div className='col-12 col-md-6'>
                    <label className='form-label fw-semibold small text-muted'>
                        Telefone alternativo
                    </label>
                    <input
                        type='tel'
                        name='alternatePhoneNumber'
                        value={data.alternatePhoneNumber}
                        onChange={handleInputChange}
                        className={`form-control form-control-lg bg-light ${errors.has('alternatePhoneNumber') ? 'is-invalid' : ''}`}
                        placeholder='+258 84 123 4567'
                        disabled={submitting}
                    />
                    {errors.has('alternatePhoneNumber') && (
                        <div className='text-danger small mt-1'>
                            {errors.get('alternatePhoneNumber')}
                        </div>
                    )}
                </div>

                <div className='col-12'>
                    <label className='form-label fw-semibold small text-muted'>
                        E-mail (opcional)
                    </label>
                    <input
                        type='email'
                        name='email'
                        value={data.email}
                        onChange={handleInputChange}
                        className={`form-control form-control-lg bg-light ${errors.has('email') ? 'is-invalid' : ''}`}
                        placeholder='seu.email@exemplo.com'
                        disabled={submitting}
                    />
                    {errors.has('email') && (
                        <div className='text-danger small mt-1'>
                            {errors.get('email')}
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
                        value={data.password}
                        onChange={handleInputChange}
                        className={`form-control bg-light border-end-0 ${errors.has('password') ? 'is-invalid' : ''}`}
                        placeholder='Mínimo 6 caracteres'
                        disabled={submitting}
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
                {data.password && (
                    <div className='mt-3'>
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
                {errors.has('password') && (
                    <div className='text-danger small mt-1'>
                        {errors.get('password')}
                    </div>
                )}
            </div>

            <div className='mb-4'>
                <label className='form-label fw-semibold small text-muted'>
                    Confirmar senha
                </label>
                <input
                    type={showPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    value={data.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-control form-control-lg bg-light ${errors.has('confirmPassword') ? 'is-invalid' : ''}`}
                    placeholder='Repita a senha'
                    disabled={submitting}
                />
                {errors.has('confirmPassword') && (
                    <div className='text-danger small mt-1'>
                        {errors.get('confirmPassword')}
                    </div>
                )}
                {data.password &&
                    data.confirmPassword &&
                    data.password ===
                        data.confirmPassword && (
                        <div className='text-success small mt-1'>
                            <i className='bi bi-check-circle me-1'></i>
                            Senhas coincidem
                        </div>
                    )}
            </div>

            <div className='form-check mb-4'>
                <input
                    className={`form-check-input ${errors.has('accept') ? 'is-invalid' : ''}`}
                    type='checkbox'
                    name='accept'
                    id='accept'
                    checked={data.accept}
                    onChange={handleInputChange}
                />
                <label
                    className='form-check-label small'
                    htmlFor='accept'
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
                {errors.has('accept') && (
                    <div className='text-danger small'>
                        {errors.get('accept')}
                    </div>
                )}
            </div>

            <div className='d-flex gap-3 mt-4'>
                <button
                    type='button'
                    className='btn btn-lg fw-bold'
                    style={{
                        backgroundColor: '#FFD814',
                        color: '#0F1111',
                        border: 'none',
                    }}
                    disabled={submitting}
                    onClick={() => setStep(prev => prev - 1)}
                >
                    Anterior
                </button>

                <button
                    type='submit'
                    className='btn btn-lg fw-bold flex-grow-1'
                    style={{
                        backgroundColor: '#FFD814',
                        color: '#0F1111',
                        border: 'none',
                    }}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <span className='spinner-border spinner-border-sm me-2'></span>
                            Criando...
                        </>
                    ) : (
                        'Criar conta'
                    )}
                </button>
            </div>
            
        </form>

    )
}

export default Register;
