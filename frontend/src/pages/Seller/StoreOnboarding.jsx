import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';

function StoreOnboarding() {
    const api = useApi();
    const navigate = useNavigate();
    const { showNotification } = useNotification();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tecnologia',
        type: 'individual',
        description: '',
        city: 'Maputo',
        province: 'Maputo Cidade',
        logo: null,
    });
    const [loading, setLoading] = useState(false);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/stores', formData);
            showNotification(
                'Sua loja foi criada com sucesso! Bem-vindo ao time de vendedores.',
                'success'
            );
            navigate('/seller/dashboard');
        } catch (error) {
            console.error(error);
            showNotification(
                error.response?.data?.message ||
                    'Erro ao criar loja. Verifique os dados.',
                'error'
            );
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Informação' },
        { num: 2, label: 'Branding' },
        { num: 3, label: 'Verificação' },
    ];

    return (
        <div className='min-h-screen bg-gray-50 py-8' style={{ marginTop: '40px' }}>
            <div className='px-4 py-8 max-w-7xl mx-auto'>
                <div className='flex justify-center'>
                    <div className='w-full max-w-4xl'>
                        {/* Stepper */}
                        <div className='flex justify-between mb-8 relative'>
                            <div
                                className='absolute top-1/2 left-0 right-0 border-t-2 border-gray-300 -translate-y-1/2 z-0'
                            ></div>
                            {steps.map(s => (
                                <div
                                    key={s.num}
                                    className='relative z-10 text-center bg-gray-50 px-2'
                                >
                                    <div
                                        className={`rounded-full flex items-center justify-center mx-auto ${step >= s.num ? 'bg-orange-500 text-white' : 'bg-white text-gray-500 border-2 border-gray-300'}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {s.num}
                                    </div>
                                    <small
                                        className={`mt-2 block font-bold ${step >= s.num ? 'text-orange-500' : 'text-gray-500'}`}
                                    >
                                        {s.label}
                                    </small>
                                </div>
                            ))}
                        </div>

                        <div className='bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden'>
                            <div className='grid grid-cols-1 md:grid-cols-3'>
                                <div
                                    className='md:col-span-1 bg-gray-900 text-white p-8 hidden md:flex flex-col justify-center'
                                >
                                    <h3 className='font-bold mb-6 text-xl'>
                                        Venda na DUBANING
                                    </h3>
                                    <ul className='space-y-4'>
                                        <li className='flex gap-3 items-center'>
                                            <i className='bi bi-check-circle-fill text-yellow-400'></i>
                                            <span>
                                                Milhares de clientes esperando
                                                por você.
                                            </span>
                                        </li>
                                        <li className='flex gap-3 items-center'>
                                            <i className='bi bi-check-circle-fill text-yellow-400'></i>
                                            <span>
                                                Ferramentas de gestão
                                                integradas.
                                            </span>
                                        </li>
                                        <li className='flex gap-3 items-center'>
                                            <i className='bi bi-check-circle-fill text-yellow-400'></i>
                                            <span>
                                                Pagamentos seguros via M-Pesa.
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                                <div className='md:col-span-2 p-6 md:p-8'>
                                    <form onSubmit={handleSubmit}>
                                        {step === 1 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='font-bold mb-6 text-lg'>
                                                    Dados da Loja
                                                </h4>
                                                <div className='mb-4'>
                                                    <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                        Nome da Loja
                                                    </label>
                                                    <input
                                                        className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                        name='name'
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder='Ex: Maputo Gadgets'
                                                    />
                                                </div>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                    <div>
                                                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                            Categoria
                                                        </label>
                                                        <select
                                                            className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                            name='category'
                                                            value={
                                                                formData.category
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <option>
                                                                Tecnologia
                                                            </option>
                                                            <option>
                                                                Moda
                                                            </option>
                                                            <option>
                                                                Serviços
                                                            </option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                            Tipo
                                                        </label>
                                                        <select
                                                            className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                            name='type'
                                                            value={
                                                                formData.type
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <option value='individual'>
                                                                Individual
                                                            </option>
                                                            <option value='pme'>
                                                                PME / Empresa
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                                                    <div>
                                                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                            Cidade
                                                        </label>
                                                        <input
                                                            className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                            name='city'
                                                            value={
                                                                formData.city
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                            Província
                                                        </label>
                                                        <select
                                                            className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                            name='province'
                                                            value={
                                                                formData.province
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        >
                                                            <option>
                                                                Maputo Cidade
                                                            </option>
                                                            <option>
                                                                Maputo Província
                                                            </option>
                                                            <option>
                                                                Gaza
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className='mt-6'>
                                                    <button
                                                        type='button'
                                                        className='w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors'
                                                        onClick={() =>
                                                            setStep(2)
                                                        }
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='font-bold mb-6 text-lg'>
                                                    Branding & Descrição
                                                </h4>
                                                <div className='mb-4 text-center'>
                                                    <div
                                                        className='mx-auto rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50'
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                        }}
                                                    >
                                                        <div className='text-center'>
                                                            <i className='bi bi-image text-4xl text-gray-400'></i>
                                                            <p className='small text-gray-400 mb-0'>
                                                                Upload Logo
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type='file'
                                                        className='hidden'
                                                        id='logo-upload'
                                                    />
                                                    <label
                                                        htmlFor='logo-upload'
                                                        className='text-orange-500 font-bold mt-4 hover:text-orange-600 cursor-pointer'
                                                    >
                                                        Selecionar Imagem
                                                    </label>
                                                </div>
                                                <div className='mb-4'>
                                                    <label className='block text-sm font-bold text-gray-600 mb-2'>
                                                        Breve Descrição
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        className='w-full px-4 py-3 bg-gray-50 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none'
                                                        name='description'
                                                        value={
                                                            formData.description
                                                        }
                                                        onChange={handleChange}
                                                        placeholder='O que diferencia sua loja?'
                                                    />
                                                </div>
                                                <div className='grid grid-cols-2 gap-4 mt-6'>
                                                    <button
                                                        type='button'
                                                        className='w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors'
                                                        onClick={() =>
                                                            setStep(1)
                                                        }
                                                    >
                                                        Voltar
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className='w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors'
                                                        onClick={() =>
                                                            setStep(3)
                                                        }
                                                    >
                                                        Continuar
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='font-bold mb-6 text-lg'>
                                                    Verificação de Conta
                                                </h4>
                                                <div
                                                    className='bg-yellow-50 border border-yellow-200 text-gray-800 p-4 rounded-lg mb-6'
                                                >
                                                    <i className='bi bi-info-circle-fill mr-2 text-red-500'></i>
                                                    Para ser um{' '}
                                                    <strong>
                                                        Vendedor Verificado
                                                    </strong>
                                                    , entraremos em contacto
                                                    para solicitar o seu NUIT ou
                                                    BI.
                                                </div>
                                                <p className='text-gray-500 text-sm mb-6'>
                                                    Ao clicar em "Abrir Minha
                                                    Loja", você concorda com os
                                                    termos de serviço do
                                                    Marketplace DUBANING.
                                                </p>
                                                <div className='grid grid-cols-2 gap-4 mt-6'>
                                                    <button
                                                        type='button'
                                                        className='w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors'
                                                        onClick={() =>
                                                            setStep(2)
                                                        }
                                                    >
                                                        Voltar
                                                    </button>
                                                    <button
                                                        type='submit'
                                                        className='w-full bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50'
                                                        disabled={loading}
                                                    >
                                                        {loading ? (
                                                            <div className='animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full'></div>
                                                        ) : (
                                                            'Abrir Minha Loja'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StoreOnboarding;
