// src/components/UserProfile.jsx
import { useEffect, useState } from "react";
import { useFetch } from "../hooks/useApi";
import { useAuthContext } from "../contexts/AuthContext";
import { LoadingOverlay } from "../components/LoadingOverlay";

export function UserProfile({ userId }) {
    const { user: currentUser } = useAuthContext();
    const [updateData, setUpdateData] = useState(null);

    // Buscar dados do usuário
    const {
        data: userData,
        loading,
        error,
        refetch,
    } = useFetch(`/users/${userId}`, { requireAuth: true }, [userId]);

    // Hook para atualização
    const { execute: updateUser, loading: updating } = useApi({
        requireAuth: true,
    });

    const handleUpdate = async () => {
        if (!updateData) return;

        try {
            await updateUser(`/users/${userId}`, {
                method: "PUT",
                body: updateData,
            });

            // Atualizar dados locais
            refetch();
            setUpdateData(null);

            // Mostrar notificação de sucesso
            // (integração opcional com sistema de notificações)
        } catch (err) {
            console.error("Falha ao atualizar:", err);
        }
    };

    if (loading) return <LoadingOverlay isLoading={true} />;
    if (error) return <div className="error">Erro: {error.message}</div>;
    if (!userData) return <div>Usuário não encontrado</div>;

    return (
        <div className="user-profile">
            <LoadingOverlay isLoading={updating} message="Salvando..." />

            <div className="profile-header">
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
            </div>

            <div className="profile-form">
                <h3>Editar Perfil</h3>
                <input
                    type="text"
                    defaultValue={userData.name}
                    onChange={(e) =>
                        setUpdateData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="Nome"
                />
                <input
                    type="email"
                    defaultValue={userData.email}
                    onChange={(e) =>
                        setUpdateData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                    placeholder="Email"
                />

                {updateData && (
                    <button onClick={handleUpdate} disabled={updating}>
                        {updating ? "Salvando..." : "Salvar Alterações"}
                    </button>
                )}
            </div>
        </div>
    );
}
