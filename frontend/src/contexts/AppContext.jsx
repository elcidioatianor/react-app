// src/providers/AppProviders.jsx
import { useAuthContext, AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';
import { LoadingOverlay } from '../components/LoadingOverlay';

function GlobalLoader() {
    const { loading } = useAuthContext();
    return (
        <LoadingOverlay
            isLoading={loading}
            message='Verificando autenticação...'
        />
    );
}

//TODO: USAR LOADER APENAS EM ACÇÕES ESPECÍFICAS
//PARA LOGIN, USAR SPINNER DE BOTÃO
//COMENTAR GLOBAL LOADER MAIS TARDE
export const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <GlobalLoader />
                {children}
            </NotificationProvider>
        </AuthProvider>
    );
};
