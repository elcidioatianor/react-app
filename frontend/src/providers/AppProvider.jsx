// src/providers/AppProviders.jsx
import { useAuthContext } from "../contexts/AuthContext";
import { AuthProvider } from "./AuthProvider";
import { ThemeProvider } from "./ThemeProvider";
import { NotificationProvider } from "./NotificationProvider";
import { LoadingOverlay } from "../components/LoadingOverlay";

function GlobalLoader() {
    const { loading } = useAuthContext();
    return (
        <LoadingOverlay
            isLoading={loading}
            message="Verificando autenticação..."
        />
    );
}

//TODO: USAR LOADER APENAS EM ACÇÕES ESPECÍFICAS 
//PARA LOGIN, USAR SPINNER DE BOTÃO 
//COMENTAR GLOBAL LOADER MAIS TARDE
export const AppProvider = ({ children }) => {
    return (
		<ThemeProvider>
        	<AuthProvider>
            	<NotificationProvider>
                	<GlobalLoader />
                	{children}
            	</NotificationProvider>
        	</AuthProvider>
		</ThemeProvider>
    );
};
