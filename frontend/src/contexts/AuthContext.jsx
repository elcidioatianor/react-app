// src/contexts/AuthContext.jsx
import { createContext, useContext } from "react";

//CREATE THE CONTEXT
export const AuthContext = createContext(null);

//4 - Hook personalizado para requisições API > useApi.js
//4 - Criar rota privada > ../components/privateRoute.js
export const useAuthContext = () => {
    //useAuthContext
    const context = useContext(AuthContext);

    if (!context) {
        //VERIFICAR SE O COMPONENTE CHAMANDO É FILHA DO AUTHCONTEXT:
        throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
    }

    return context;
};
