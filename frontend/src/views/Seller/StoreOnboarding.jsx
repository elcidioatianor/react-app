import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../contexts/NotificationContext';
import {
    Container,
    Row,
    Col,
    Card,
    Form,
    Button,
    Spinner,
    Alert,
} from 'react-bootstrap';

function StoreOnboarding() {
    const api = useApi();
    const navigate = useNavigate();
    const { addNotification } = useNotification();

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
            addNotification(
                'Sua loja foi criada com sucesso! Bem-vindo ao time de vendedores.',
                'success'
            );
            navigate('/seller/dashboard');
        } catch (error) {
            console.error(error);
            addNotification(
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
        <div className='min-vh-100 bg-light py-5' style={{ marginTop: '40px' }}>
            <Container>
                <Row className='justify-content-center'>
                    <Col md={10} lg={8}>
                        {/* Stepper */}
                        <div className='d-flex justify-content-between mb-5 position-relative'>
                            <div
                                className='position-absolute top-50 start-0 end-0 border-top border-2 z-0'
                                style={{ transform: 'translateY(-50%)' }}
                            ></div>
                            {steps.map(s => (
                                <div
                                    key={s.num}
                                    className='position-relative z-1 text-center bg-light px-2'
                                >
                                    <div
                                        className={`rounded-circle d-flex align-items-center justify-content-center mx-auto ${step >= s.num ? 'bg-dubaning-orange text-white' : 'bg-white text-muted border border-2'}`}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {s.num}
                                    </div>
                                    <small
                                        className={`mt-2 d-block fw-bold ${step >= s.num ? 'text-dubaning-orange' : 'text-muted'}`}
                                    >
                                        {s.label}
                                    </small>
                                </div>
                            ))}
                        </div>

                        <Card className='border-0 shadow-sm overflow-hidden rounded-4'>
                            <Row className='g-0'>
                                <Col
                                    md={4}
                                    className='bg-dark text-white p-5 d-none d-md-flex flex-column justify-content-center'
                                >
                                    <h3 className='fw-bold mb-4'>
                                        Venda na DUBANING
                                    </h3>
                                    <ul className='list-unstyled d-flex flex-column gap-3'>
                                        <li className='d-flex gap-3 align-items-center'>
                                            <i className='bi bi-check-circle-fill text-warning'></i>
                                            <span>
                                                Milhares de clientes esperando
                                                por você.
                                            </span>
                                        </li>
                                        <li className='d-flex gap-3 align-items-center'>
                                            <i className='bi bi-check-circle-fill text-warning'></i>
                                            <span>
                                                Ferramentas de gestão
                                                integradas.
                                            </span>
                                        </li>
                                        <li className='d-flex gap-3 align-items-center'>
                                            <i className='bi bi-check-circle-fill text-warning'></i>
                                            <span>
                                                Pagamentos seguros via M-Pesa.
                                            </span>
                                        </li>
                                    </ul>
                                </Col>
                                <Col md={8} className='p-4 p-md-5'>
                                    <Form onSubmit={handleSubmit}>
                                        {step === 1 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='fw-bold mb-4'>
                                                    Dados da Loja
                                                </h4>
                                                <Form.Group className='mb-3'>
                                                    <Form.Label className='small fw-bold text-muted'>
                                                        Nome da Loja
                                                    </Form.Label>
                                                    <Form.Control
                                                        size='lg'
                                                        className='bg-light border-0'
                                                        name='name'
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder='Ex: Maputo Gadgets'
                                                    />
                                                </Form.Group>
                                                <Row className='mb-3'>
                                                    <Col
                                                        md={6}
                                                        className='mb-3 mb-md-0'
                                                    >
                                                        <Form.Label className='small fw-bold text-muted'>
                                                            Categoria
                                                        </Form.Label>
                                                        <Form.Select
                                                            size='lg'
                                                            className='bg-light border-0'
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
                                                        </Form.Select>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className='small fw-bold text-muted'>
                                                            Tipo
                                                        </Form.Label>
                                                        <Form.Select
                                                            size='lg'
                                                            className='bg-light border-0'
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
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                                <Row className='mb-4'>
                                                    <Col
                                                        md={6}
                                                        className='mb-3 mb-md-0'
                                                    >
                                                        <Form.Label className='small fw-bold text-muted'>
                                                            Cidade
                                                        </Form.Label>
                                                        <Form.Control
                                                            size='lg'
                                                            className='bg-light border-0'
                                                            name='city'
                                                            value={
                                                                formData.city
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                            required
                                                        />
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Label className='small fw-bold text-muted'>
                                                            Província
                                                        </Form.Label>
                                                        <Form.Select
                                                            size='lg'
                                                            className='bg-light border-0'
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
                                                        </Form.Select>
                                                    </Col>
                                                </Row>
                                                <div className='d-grid mt-4'>
                                                    <Button
                                                        variant='warning'
                                                        size='lg'
                                                        className='bg-dubaning-orange border-0 text-white fw-bold'
                                                        onClick={() =>
                                                            setStep(2)
                                                        }
                                                    >
                                                        Continuar
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {step === 2 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='fw-bold mb-4'>
                                                    Branding & Descrição
                                                </h4>
                                                <div className='mb-4 text-center'>
                                                    <div
                                                        className='mx-auto rounded-3 border border-dashed border-3 d-flex align-items-center justify-content-center bg-light'
                                                        style={{
                                                            width: '120px',
                                                            height: '120px',
                                                        }}
                                                    >
                                                        <div className='text-center'>
                                                            <i className='bi bi-image fs-1 text-muted'></i>
                                                            <p className='small text-muted mb-0'>
                                                                Upload Logo
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <input
                                                        type='file'
                                                        className='d-none'
                                                        id='logo-upload'
                                                    />
                                                    <label
                                                        htmlFor='logo-upload'
                                                        className='btn btn-link text-dubaning-orange fw-bold mt-2 text-decoration-none'
                                                    >
                                                        Selecionar Imagem
                                                    </label>
                                                </div>
                                                <Form.Group className='mb-4'>
                                                    <Form.Label className='small fw-bold text-muted'>
                                                        Breve Descrição
                                                    </Form.Label>
                                                    <Form.Control
                                                        as='textarea'
                                                        rows={3}
                                                        className='bg-light border-0'
                                                        name='description'
                                                        value={
                                                            formData.description
                                                        }
                                                        onChange={handleChange}
                                                        placeholder='O que diferencia sua loja?'
                                                    />
                                                </Form.Group>
                                                <Row className='g-2 mt-4'>
                                                    <Col xs={6}>
                                                        <Button
                                                            variant='outline-secondary'
                                                            className='w-100 py-3'
                                                            onClick={() =>
                                                                setStep(1)
                                                            }
                                                        >
                                                            Voltar
                                                        </Button>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Button
                                                            variant='warning'
                                                            className='w-100 py-3 bg-dubaning-orange border-0 text-white fw-bold'
                                                            onClick={() =>
                                                                setStep(3)
                                                            }
                                                        >
                                                            Continuar
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}

                                        {step === 3 && (
                                            <div className='animate-fade-in'>
                                                <h4 className='fw-bold mb-4'>
                                                    Verificação de Conta
                                                </h4>
                                                <Alert
                                                    variant='warning'
                                                    className='border-0 text-dark small mb-4'
                                                >
                                                    <i className='bi bi-info-circle-fill me-2 text-danger'></i>
                                                    Para ser um{' '}
                                                    <strong>
                                                        Vendedor Verificado
                                                    </strong>
                                                    , entraremos em contacto
                                                    para solicitar o seu NUIT ou
                                                    BI.
                                                </Alert>
                                                <p className='text-muted small mb-4'>
                                                    Ao clicar em "Abrir Minha
                                                    Loja", você concorda com os
                                                    termos de serviço do
                                                    Marketplace DUBANING.
                                                </p>
                                                <Row className='g-2 mt-4'>
                                                    <Col xs={6}>
                                                        <Button
                                                            variant='outline-secondary'
                                                            className='w-100 py-3'
                                                            onClick={() =>
                                                                setStep(2)
                                                            }
                                                        >
                                                            Voltar
                                                        </Button>
                                                    </Col>
                                                    <Col xs={6}>
                                                        <Button
                                                            type='submit'
                                                            variant='success'
                                                            className='w-100 py-3 bg-dubaning-orange border-0 shadow-sm fw-bold'
                                                            disabled={loading}
                                                        >
                                                            {loading ? (
                                                                <Spinner
                                                                    animation='border'
                                                                    size='sm'
                                                                />
                                                            ) : (
                                                                'Abrir Minha Loja'
                                                            )}
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        )}
                                    </Form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default StoreOnboarding;
