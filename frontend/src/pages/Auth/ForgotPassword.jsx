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
            <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#f8f9fa' }}>
                <div className='w-full' style={{ maxWidth: '400px' }}>
                    <div className='bg-white shadow-md rounded-lg p-20'>
                        <div className='text-center'>
                            <h2 className='font-bold mb-3' style={{ fontSize: '1.5rem' }}>
                                Email Enviado
                            </h2>
                            <p className='text-gray-500 mb-16'>
                                Verifique seu email para obter instruções sobre como
                                redefinir sua senha.
                            </p>
                            <p className='text-gray-500 text-sm mb-16'>
                                O link de redefinição expira em 1 hora.
                            </p>
                            <Link
                                to='/login'
                                className='inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600 transition-colors'
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
        <div className='min-h-screen flex items-center justify-center' style={{ backgroundColor: '#f8f9fa' }}>
            <div className='w-full' style={{ maxWidth: '400px' }}>
                <div className='bg-white shadow-md rounded-lg p-20'>
                    <h2 className='font-bold mb-16' style={{ fontSize: '1.5rem' }}>
                        Recuperar Palavra-Passe
                    </h2>

                    <form onSubmit={handleSubmit} className=''>
                        <div className='mb-16'>
                            <label className='block font-semibold text-sm text-gray-600 mb-2'>
                                Email ou Telefone
                            </label>
                            <input
                                type='text'
                                value={input}
                                onChange={handleInputChange}
                                placeholder='Insira seu email ou número de telefone'
                                className='w-full px-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-lg text-lg focus:outline-none focus:border-blue-500'
                                disabled={isSubmitting}
                            />
                            <p className='mt-2 text-gray-500 text-sm'>
                                {inputType === 'email'
                                    ? '📧 Email detectado'
                                    : '📱 Telefone detectado'}
                            </p>
                        </div>

                        <button
                            type='submit'
                            disabled={isSubmitting || !input}
                            className='w-full py-3 px-6 font-bold text-black rounded-lg'
                            style={{
                                backgroundColor: '#FFD814',
                                color: '#0F1111',
                                border: 'none',
                            }}
                        >
                            {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
                        </button>
                    </form>

                    <div className='mt-16 text-center'>
                        <p className='text-gray-500 text-sm'>
                            Voltou à memória?{' '}
                            <Link
                                to='/login'
                                className='no-underline font-semibold'
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
