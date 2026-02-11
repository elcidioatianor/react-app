// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { LoadingOverlay } from '../components/LoadingOverlay';
import { xhr } from '../services/api';

//CREATE THE CONTEXT
const AuthContext = createContext(null);

//Disponibilizar funcionalidades do contexto
function AuthProvider({ children }) {
    //TODO: USAR useReducer ou [state, setState] = useState(null) (para evitar múltiplos set...)
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Verificar autenticação inicial
    useEffect(() => {
        checkAuthentication();
        return () => {
            //CLEANUP HERE (LISTENERS, ETC)
        };
    }, []);

    const checkAuthentication = async () => {
        try {
            const res = await xhr.post('/auth/profile', {});
            const user = res.json();

            if (user) {
                setUser(user);
                setAuthenticated(true);
                setLoading(false);
            }
        } catch (err) {
            //TODO: USAR APENAS isAuthenticated PARA CONTROLAR REDIRECT
            setAuthenticated(false);

            // E REMOVER O CÓDIGO A SEGUIR
            if (window.location.path !== '/') {
                //PERMITIR USUÁRIO SEM SESSÃO NA PÁGINA INICIAL:
                //window.location.href = '/'
            }
            setLoading(false);
            setError(err.message);
        }
    };

    // Registrar
    const register = async formData => {
        try {
            const res = await xhr.post('/auth/register', formData);
            const { user: userData, accessToken } = res.json();

            // Validar dados obrigatórios
            if (!userData || !accessToken) {
                throw new Error('Dados de autenticação incompletos');
            }
            setAuthenticated(true);
            //setError(null)
            return { done: true };
        } catch (err) {
            console.error(err);
            //setError(err.message)
            setAuthenticated(false);
            return { done: false, error: err.message };
        }
    };

    //LOGIN
    const login = async credentials => {
        try {
            const res = await xhr.post('/auth/login', credentials);
            const { user: userData } = res.json();

            setUser(userData);
            setAuthenticated(true);
            //setError(null);
            return { done: true };
        } catch (err) {
            console.log(err);
            //setError(err.message);
            setAuthenticated(false);
            return { done: false, error: err.message };
        }
    };

    // LOGOUT
    const logout = async () => {
        try {
            await xhr.post('/auth/logout', {});
            setUser(null);
            //setError(null);
            setAuthenticated(false);
            // 4. Redirecionar (se estiver usando router)
            // navigate('/login');
            return { done: true };
        } catch (err) {
            //setError(err.message)
            return { done: false, error: err.message };
        }
    };

    // TODO: useMemo
    const contextValue = {
        user,
        error,
        setError,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
    };

    //TODO: USAR LOADER APENAS EM COMPONENTES ESPECÍFICOS
    return (
        <AuthContext value={contextValue}>
            {loading ? (
                <LoadingOverlay isLoading={loading} message='Carregando...' />
            ) : (
                children
            )}
        </AuthContext>
    );
}

export {
    AuthContext,
    AuthProvider
}