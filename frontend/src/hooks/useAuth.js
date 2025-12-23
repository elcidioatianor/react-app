// 3 - Ciar hook para usar o Auth Context
// hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }

    return context;
};

//4 - Hook personalizado para requisições API > useApi.js
//4 - Criar rota privada > ../components/privateRoute.js
