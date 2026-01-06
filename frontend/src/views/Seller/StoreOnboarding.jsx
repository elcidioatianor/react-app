import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNotification } from "../../contexts/NotificationContext";

export function StoreOnboarding() {
    const api = useApi();
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    //const { updateUser } = useAuthContext(); //Verify if we need to update role in context context locally

    const [formData, setFormData] = useState({
        name: "",
        category: "Tecnologia",
        type: "individual",
        description: "",
        city: "Maputo",
        province: "Maputo Cidade"
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/stores', formData);
            addNotification("Loja criada com sucesso!", "success");

            // Force user profile refresh or role update would be ideal here
            // For now, redirect to dashboard where it should load
            navigate("/seller/dashboard");
            //window.location.reload(); //Brute force to refresh context role if needed
        } catch (error) {
            console.error(error);
            addNotification(error.response?.data?.message || "Erro ao criar loja", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card border-0 shadow-lg">
                        <div className="card-body p-5">
                            <div className="text-center mb-5">
                                <h2 className="fw-bold">Criar sua Loja DUBANING</h2>
                                <p className="text-muted">Comece a vender para milhares de clientes hoje mesmo.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nome da Loja</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ex: Eletrónicos Maputo"
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Categoria Principal</label>
                                        <select
                                            className="form-select form-select-lg"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >
                                            <option value="Tecnologia">Tecnologia</option>
                                            <option value="Moda">Moda</option>
                                            <option value="Casa">Casa</option>
                                            <option value="Agro">Agro</option>
                                            <option value="Serviços">Serviços</option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Tipo de Vendedor</label>
                                        <select
                                            className="form-select form-select-lg"
                                            name="type"
                                            value={formData.type}
                                            onChange={handleChange}
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="pme">Empresa / Loja</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Cidade</label>
                                        <input
                                            type="text"
                                            className="form-control form-control-lg"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Província</label>
                                        <select
                                            className="form-select form-select-lg"
                                            name="province"
                                            value={formData.province}
                                            onChange={handleChange}
                                        >
                                            <option value="Maputo Cidade">Maputo Cidade</option>
                                            <option value="Maputo Província">Maputo Província</option>
                                            <option value="Gaza">Gaza</option>
                                            <option value="Inhambane">Inhambane</option>
                                            <option value="Sofala">Sofala</option>
                                            <option value="Manica">Manica</option>
                                            <option value="Tete">Tete</option>
                                            <option value="Zambézia">Zambézia</option>
                                            <option value="Nampula">Nampula</option>
                                            <option value="Niassa">Niassa</option>
                                            <option value="Cabo Delgado">Cabo Delgado</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label">Descrição da Loja</label>
                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="O que você vende? Fale um pouco sobre sua loja."
                                    ></textarea>
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                                        {loading ? "Criando..." : "Abrir Minha Loja"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
