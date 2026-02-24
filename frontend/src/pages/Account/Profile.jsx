import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import {
    CheckCircle,
    Phone,
    GeoAltFill,
    Edit,
    Check,
    Bag,
    CreditCard,
    Message,
} from '../../components/Svg';

import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';

function Profile() {
    const { user: currentUser, updateProfile } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('orders');
    const [editMode, setEditMode] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [imgError, setImgError] = useState(false);

    const { loading: saving } = useApi();

    const [profileData, setProfileData] = useState({
        name: currentUser?.name || '',
        phone: currentUser?.phone || '84XXXXXXX',
        location: currentUser?.location || 'Maputo, Moçambique',
        avatarUrl: currentUser?.avatarUrl || '',
    });

    const [orders] = useState([
        {
            id: 'DB-1001',
            date: '2026-01-05',
            status: 'delivered',
            total: '2.500 MT',
            items: 'Smartphone Samsung',
        },
        {
            id: 'DB-1002',
            date: '2026-01-06',
            status: 'pending',
            total: '1.200 MT',
            items: 'Auriculares Bluetooth',
        },
        {
            id: 'DB-1003',
            date: '2026-01-07',
            status: 'cancelled',
            total: '500 MT',
            items: 'Capa Protetora',
        },
    ]);

    const handleInputChange = e => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        try {
            if (updateProfile) {
                await updateProfile(profileData);
            }
            setEditMode(false);
            setShowSuccessToast(true);
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
        }
    };

    const getStatusBadge = status => {
        switch (status) {
            case 'delivered':
                return <span className='px-3 py-1 bg-green-100 text-green-800 text-sm font-bold rounded'>Entregue</span>;
            case 'pending':
                return <span className='px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-bold rounded'>Pendente</span>;
            case 'cancelled':
                return <span className='px-3 py-1 bg-red-100 text-red-800 text-sm font-bold rounded'>Cancelado</span>;
            default:
                return <span className='px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold rounded'>{status}</span>;
        }
    };

    if (!currentUser) {
        return (
            <div className='w-full max-w-7xl mx-auto py-5 mt-5 text-center px-4'>
                <h2 className='text-2xl font-bold mb-4'>Acesso Negado</h2>
                <p className='text-gray-600 mb-6'>Por favor, faça login para ver seu perfil.</p>
                <button
                    onClick={() => navigate('/login')}
                    className='bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded'
                >
                    Entrar
                </button>
            </div>
        );
    }

    return (
        <div className='w-full max-w-7xl mx-auto py-5 px-4' style={{ marginTop: '30px' }}>
            {/* Toast Notification */}
            {showSuccessToast && (
                <div className='fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50'>
                    <CheckCircle className='w-5 h-5' />
                    <div>
                        <strong>Sucesso!</strong>
                        <p className='text-sm'>Perfil atualizado com sucesso!</p>
                    </div>
                </div>
            )}

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
                {/* Sidebar */}
                <div>
                    <div className='bg-white border border-gray-200 rounded-lg shadow'>
                        <div className='text-center p-4'>
                            <div className='mb-4'>
                                {profileData.avatarUrl && !imgError ? (
                                    <img
                                        src={profileData.avatarUrl}
                                        alt='Avatar'
                                        onError={() => setImgError(true)}
                                        className='rounded-full border border-gray-300 shadow-sm mx-auto'
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    <div className='rounded-full bg-gray-100 text-orange-500 flex justify-center items-center mx-auto shadow-sm'
                                        style={{
                                            width: '120px',
                                            height: '120px',
                                            fontSize: '40px',
                                        }}
                                    >
                                        <i className='bi bi-person-fill'></i>
                                    </div>
                                )}
                            </div>

                            <h4 className='font-bold text-lg mb-1'>{profileData.name}</h4>
                            <p className='text-gray-500 mb-4'>{profileData.location}</p>

                            <div className='space-y-4 mb-4 border-t border-gray-200 pt-4'>
                                <div className='flex items-center gap-3'>
                                    <div className='bg-gray-100 p-2 rounded'>
                                        <Phone className='text-blue-500' />
                                    </div>
                                    <div className='text-left'>
                                        <small className='text-gray-500 block'>
                                            Telefone
                                        </small>
                                        <span className='font-bold text-gray-900'>
                                            {profileData.phone}
                                        </span>
                                    </div>
                                </div>
                                <div className='flex items-center gap-3'>
                                    <div className='bg-gray-100 p-2 rounded'>
                                        <GeoAltFill className='text-blue-500' />
                                    </div>
                                    <div className='text-left'>
                                        <small className='text-gray-500 block'>
                                            Localização
                                        </small>
                                        <span className='font-bold text-gray-900'>
                                            {profileData.location}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {!editMode ? (
                                <button
                                    className='w-full py-2 rounded-full bg-orange-500 border-0 text-white font-bold hover:bg-orange-600 flex items-center justify-center gap-2'
                                    onClick={() => setEditMode(true)}
                                >
                                    <Edit className='w-4 h-4' /> Editar Info
                                </button>
                            ) : (
                                <div className='flex flex-col gap-2'>
                                    <button
                                        className='py-2 rounded-full border-0 font-bold bg-green-500 text-white hover:bg-green-600 flex items-center justify-center gap-2'
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <span className='animate-spin'>⏳</span>
                                        ) : (
                                            <>
                                                <Check className='w-4 h-4' /> Salvar
                                            </>
                                        )}
                                    </button>
                                    <button
                                        className='text-red-600 hover:text-red-700 font-bold no-underline'
                                        onClick={() => setEditMode(false)}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content - Tabs */}
                <div className='lg:col-span-3'>
                    <div className='bg-white border border-gray-200 rounded-lg shadow h-full'>
                        <div className='p-0'>
                            {/* Tab Navigation */}
                            <div className='flex border-b border-gray-200'>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition ${
                                        activeTab === 'orders'
                                            ? 'text-orange-500 border-orange-500'
                                            : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                                >
                                    <Bag className='w-4 h-4' /> Pedidos
                                </button>
                                <button
                                    onClick={() => setActiveTab('wallet')}
                                    className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition ${
                                        activeTab === 'wallet'
                                            ? 'text-orange-500 border-orange-500'
                                            : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                                >
                                    <CreditCard className='w-4 h-4' /> Pagamentos
                                </button>
                                <button
                                    onClick={() => setActiveTab('messages')}
                                    className={`flex items-center gap-2 px-6 py-3 font-bold border-b-2 transition ${
                                        activeTab === 'messages'
                                            ? 'text-orange-500 border-orange-500'
                                            : 'text-gray-600 border-transparent hover:text-gray-900'
                                    }`}
                                >
                                    <Message className='w-4 h-4' /> Chat
                                </button>
                            </div>

                            <div className='p-4'>
                                {activeTab === 'orders' && (
                                    <div className='space-y-3'>
                                        {orders.length > 0 ? (
                                            orders.map(order => (
                                                <div
                                                    key={order.id}
                                                    className='border-0 bg-gray-50 rounded-lg p-4 mb-2'
                                                >
                                                    <div className='grid grid-cols-1 md:grid-cols-4 gap-4 items-center'>
                                                        <div className='md:col-span-2 flex items-center gap-3'>
                                                            <div className='bg-white p-2 rounded border border-gray-200'>
                                                                <Bag className='text-orange-500 w-5 h-5' />
                                                            </div>
                                                            <div>
                                                                <h6 className='font-bold mb-1'>
                                                                    {order.items}
                                                                </h6>
                                                                <span className='text-gray-500 text-sm'>
                                                                    Pedido #{order.id} • {order.date}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className='text-center md:text-left'>
                                                            {getStatusBadge(order.status)}
                                                        </div>
                                                        <div className='text-right'>
                                                            <span className='font-bold text-gray-900'>
                                                                {order.total}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className='text-center py-5'>
                                                <Bag
                                                    size={48}
                                                    className='text-gray-400 mb-3 mx-auto w-12 h-12'
                                                />
                                                <p className='text-gray-600'>Ainda não tens pedidos.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeTab === 'wallet' && (
                                    <div>
                                        <h5 className='font-bold mb-4 text-lg'>
                                            Métodos Guardados
                                        </h5>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                            <div className='border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-gray-50'>
                                                <img
                                                    src='https://upload.wikimedia.org/wikipedia/commons/2/2a/M-Pesa_Logo.png'
                                                    alt='M-Pesa'
                                                    height='30'
                                                />
                                                <div className='flex-grow'>
                                                    <h6 className='mb-0 font-bold'>
                                                        M-Pesa
                                                    </h6>
                                                    <small className='text-green-600 font-bold'>
                                                        Ativo
                                                    </small>
                                                </div>
                                                <CheckCircle className='text-green-500 w-5 h-5' />
                                            </div>
                                            <div className='border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 text-blue-500'>
                                                <i className='bi bi-plus-circle'></i>
                                                <span className='font-bold'>
                                                    Adicionar e-Mola
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'messages' && (
                                    <div className='text-center py-5'>
                                        <Message
                                            size={48}
                                            className='text-gray-400 mb-3 mx-auto w-12 h-12'
                                        />
                                        <h5 className='font-bold'>Centro de Mensagens</h5>
                                        <p className='text-gray-500'>
                                            As tuas conversas com vendedores
                                            aparecerão aqui.
                                        </p>
                                        <button
                                            className='bg-orange-500 border-0 text-white font-bold hover:bg-orange-600 py-2 px-4 rounded'
                                            onClick={() => navigate('/')}
                                        >
                                            Explorar Produtos
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {editMode && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40'>
                    <div className='bg-white rounded-lg shadow-lg max-w-md w-full mx-4'>
                        {/* Modal Header */}
                        <div className='flex items-center justify-between border-b border-gray-200 p-4'>
                            <h3 className='font-bold text-lg'>Editar Perfil</h3>
                            <button
                                onClick={() => setEditMode(false)}
                                className='text-gray-500 hover:text-gray-700'
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className='px-4 pb-4 pt-4'>
                            <form>
                                <div className='mb-3'>
                                    <label className='text-sm font-bold text-gray-500 block mb-1'>
                                        Nome Completo
                                    </label>
                                    <input
                                        type='text'
                                        name='name'
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label className='text-sm font-bold text-gray-500 block mb-1'>
                                        Telefone
                                    </label>
                                    <input
                                        type='text'
                                        name='phone'
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                                <div className='mb-3'>
                                    <label className='text-sm font-bold text-gray-500 block mb-1'>
                                        Localização
                                    </label>
                                    <input
                                        type='text'
                                        name='location'
                                        value={profileData.location}
                                        onChange={handleInputChange}
                                        className='w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
                                    />
                                </div>
                            </form>
                            <div className='flex flex-col gap-2 mt-4'>
                                <button
                                    className='py-2 bg-orange-500 border-0 font-bold text-white rounded hover:bg-orange-600'
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                >
                                    {saving ? '⏳ Salvando...' : 'Salvar Alterações'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};;

export default Profile;