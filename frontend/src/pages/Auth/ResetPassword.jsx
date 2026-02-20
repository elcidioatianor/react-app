import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { useApi } from '../../hooks/useApi';
import { EyeFill, EyeSlashFill } from '../../components/Svg';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { showNotification } = useNotification();
    const api = useApi();

    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [showPasswords, setShowPasswords] = useState({
        newPassword: false,
        confirmPassword: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!token) {
            showNotification('Token inválido ou expirado', 'error');
            navigate('/login');
        }
    }, [token, navigate, showNotification]);

    const validateForm = () => {
        const newErrors = {};

        if (!passwords.newPassword) {
            newErrors.newPassword = 'Senha nova é obrigatória';
        } else if (passwords.newPassword.length < 6) {
            newErrors.newPassword =
                'A senha deve conter pelo menos 6 caracteres';
        }

        if (!passwords.confirmPassword) {
            newErrors.confirmPassword = 'Confirme sua senha';
        } else if (passwords.newPassword !== passwords.confirmPassword) {
            newErrors.confirmPassword = 'As senhas não conferem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/auth/reset-password', {
                resetToken: token,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword,
            });

            showNotification('Senha redefinida com sucesso!', 'success');
            navigate('/login', {
                state: { message: 'Sua senha foi redefinida. Faça login.' },
            });
        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                    'Erro ao redefinir senha',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    return (
        <div className='vh-100 d-flex align-items-center justify-content-center' style={{ backgroundColor: '#f8f9fa' }}>
            <div className='w-100' style={{ maxWidth: '400px' }}>
                <div className='bg-white shadow-sm rounded-4 p-5'>
                    <h2 className='fw-bold mb-4' style={{ fontSize: '1.5rem' }}>
                        Redefinir Palavra-Passe
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className='mb-4'>
                            <label className='form-label fw-semibold small text-muted'>
                                Nova Senha
                            </label>
                            <div className='input-group input-group-lg'>
                                <input
                                    type={
                                        showPasswords.newPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={passwords.newPassword}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            newPassword: e.target.value,
                                        })
                                    }
                                    placeholder='Insira sua nova senha'
                                    className={`form-control bg-light border-end-0 ${
                                        errors.newPassword
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        togglePasswordVisibility('newPassword')
                                    }
                                    className='input-group-text bg-light border-start-0'
                                >
                                    {showPasswords.newPassword ? (
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
                            {errors.newPassword && (
                                <div className='text-danger small mt-1'>
                                    {errors.newPassword}
                                </div>
                            )}
                        </div>

                        <div className='mb-4'>
                            <label className='form-label fw-semibold small text-muted'>
                                Confirmar Senha
                            </label>
                            <div className='input-group input-group-lg'>
                                <input
                                    type={
                                        showPasswords.confirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    value={passwords.confirmPassword}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    placeholder='Confirme sua nova senha'
                                    className={`form-control bg-light border-end-0 ${
                                        errors.confirmPassword
                                            ? 'is-invalid'
                                            : ''
                                    }`}
                                    disabled={isSubmitting}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        togglePasswordVisibility('confirmPassword')
                                    }
                                    className='input-group-text bg-light border-start-0'
                                >
                                    {showPasswords.confirmPassword ? (
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
                            {errors.confirmPassword && (
                                <div className='text-danger small mt-1'>
                                    {errors.confirmPassword}
                                </div>
                            )}
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting}
                            className='btn btn-lg w-100 fw-bold'
                            style={{
                                backgroundColor: '#FFD814',
                                color: '#0F1111',
                                border: 'none',
                            }}
                        >
                            {isSubmitting ? 'Processando...' : 'Redefinir Palavra-Passe'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
