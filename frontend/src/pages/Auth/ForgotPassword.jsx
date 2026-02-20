import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotification } from '../../hooks/useNotification';
import { useApi } from '../../hooks/useApi';

function ForgotPassword() {
    const [input, setInput] = useState('');
    const [inputType, setInputType] = useState('phone');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { showNotification } = useNotification();
    const api = useApi();

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInput(value);

        // Auto-detect input type
        if (value.includes('@')) {
            setInputType('email');
        } else if (/^\d+$/.test(value)) {
            setInputType('phone');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload =
                inputType === 'email'
                    ? { email: input }
                    : { phoneNumber: input };

            await api.post(
                '/auth/request-password-reset',
                payload
            );

            setSubmitted(true);
            showNotification(
                'Email de recuperação enviado com sucesso',
                'success'
            );
        } catch (error) {
            showNotification(
                error.response?.data?.message ||
                    'Erro ao solicitar recuperação de senha',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className='vh-100 d-flex align-items-center justify-content-center' style={{ backgroundColor: '#f8f9fa' }}>
                <div className='w-100' style={{ maxWidth: '400px' }}>
                    <div className='bg-white shadow-sm rounded-4 p-5'>
                        <div className='text-center'>
                            <h2 className='fw-bold mb-3' style={{ fontSize: '1.5rem' }}>
                                Email Enviado
                            </h2>
                            <p className='text-muted mb-4'>
                                Verifique seu email para obter instruções sobre como
                                redefinir sua senha.
                            </p>
                            <p className='text-muted small mb-4'>
                                O link de redefinição expira em 1 hora.
                            </p>
                            <Link
                                to='/login'
                                className='btn btn-primary'
                                style={{ backgroundColor: '#FF6000', borderColor: '#FF6000' }}
                            >
                                Voltar ao Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='vh-100 d-flex align-items-center justify-content-center' style={{ backgroundColor: '#f8f9fa' }}>
            <div className='w-100' style={{ maxWidth: '400px' }}>
                <div className='bg-white shadow-sm rounded-4 p-5'>
                    <h2 className='fw-bold mb-4' style={{ fontSize: '1.5rem' }}>
                        Recuperar Palavra-Passe
                    </h2>

                    <form onSubmit={handleSubmit} className=''>
                        <div className='mb-4'>
                            <label className='form-label fw-semibold small text-muted'>
                                Email ou Telefone
                            </label>
                            <input
                                type='text'
                                value={input}
                                onChange={handleInputChange}
                                placeholder='Insira seu email ou número de telefone'
                                className='form-control form-control-lg bg-light'
                                disabled={isSubmitting}
                            />
                            <p className='mt-2 text-muted small'>
                                {inputType === 'email'
                                    ? '📧 Email detectado'
                                    : '📱 Telefone detectado'}
                            </p>
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting || !input}
                            className='btn btn-lg w-100 fw-bold'
                            style={{
                                backgroundColor: '#FFD814',
                                color: '#0F1111',
                                border: 'none',
                            }}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </button>
                    </form>

                    <div className='mt-4 text-center'>
                        <p className='text-muted small'>
                            Voltou à memória?{' '}
                            <Link
                                to='/login'
                                className='text-decoration-none fw-semibold'
                                style={{ color: '#FF6000' }}
                            >
                                Fazer Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
