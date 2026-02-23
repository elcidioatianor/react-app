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
                    if (isAuthenticated) setAuthenticated(false);
                    
                    setLoading(false);
                    setError(err.message);
                }
            };
        checkAuthentication();
        return () => {
            //CLEANUP HERE (LISTENERS, ETC)
        };
    }, [isAuthenticated]);

    // Registrar
    const register = async formData => {
        try {
            const res = await xhr.post('/auth/register', formData);
            const { user: userData, accessToken } = res.json();

            // Validar dados obrigatórios
            if (!userData || !accessToken) {
                throw new Error('Dados de autenticação incompletos');
            }
            //setAuthenticated(true);
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
            console.log('=== LOGIN FUNCTION ===');
            console.log('Credentials being sent:', { phoneNumber: credentials.phoneNumber.substring(0, 5) + '...', password: '***' });
            
            const res = await xhr.post('/auth/login', credentials);
            console.log('Login response received:', res);
            console.log('Login response status:', res.status);
            
            const responseData = res.json();
            console.log('Login response data:', responseData);
            const { user: userData } = responseData;
            
            console.log('User data from login:', userData);

            setUser(userData);
            setAuthenticated(true);
            //setError(null);
            return { done: true, user: userData };
        } catch (err) {
            console.error('Login error:', err);
            console.error('Error message:', err.message);
            //setError(err.message);
            //setAuthenticated(false);
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