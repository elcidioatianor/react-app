import { useState, useEffect } from "react";
//import {useNavigate} from 'react-router-dom';
import { AuthContext } from "../contexts/AuthContext";
import { xhr } from "../services/api";
//const {EREFRESH, ENOACCESS, EREFRESH_EXPIRED}  = errors;
import { LoadingOverlay } from "../components/LoadingOverlay";
import { AUTH_ERROR } from '../services/errors'

//Provider é o elemento (wrapper) que encapsula o Context,
//mas parq usar o valor temos que ler do proprio Context
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(null);

    // Verificar autenticação inicial
    useEffect(() => {
        checkAuthentication()

        return () => {
            //CLEANUP HERE (LISTENERS, ETC)
        }
    }, []);
    const checkAuthentication = async () => {
        try {
            //TENTAR CARREGAR USUÁRIO 
            const res = await xhr.post("/auth/profile", {});

            const user = res.json();

            if (user) {//SE CARREGOU USUÁRIO, ENTÃO TUDO ESTÁ BEM (NO ACTION NEEDED)
                //setAccessToken(accessToken)

                //TODO: SET USER
                //const response = await('/auth/profile');
                //let user = response.json();

                setUser(user)
                setAuthenticated(true);
                setLoading(false)
            }
        } catch (err) {//ANALISAR ERRO: EREFRESH OU REFRESH_EXPIRY, ENOACCESS
            if (window.location.path !== '/') {
                //PERMITIR USUÁRIO SEM SESSÃO NA PÁGINA INICIAL:
                //window.location.href = '/login'
            }
            console.error("Erro ao renovar sessão")
            console.error(err);

            setLoading(false)
            setError(err);
        }

    }
    // Registrar
    const register = async (formData) => {
        //setLoading(true);
        try {
            const res = await xhr.post("/auth/register", formData);
            console.log(res);
            //if (response.status === 201 && response.data) {
            const {
                user: userData,
                accessToken
            } = res.json();

            // Validar dados obrigatórios
            if (!userData || !accessToken) {
                throw new Error("Dados de autenticação incompletos");
            }

            // Refresh token pode ser armazenado em cookie httpOnly
            setUser(userData); //TODO: PRECISAMOS MESMO DE RETORNAR DADOS, OU SETUSER() JÁ BASTA?
            setAuthenticated(true);
            setError(null)

            return { done: true }; //return boolean
            //}
        } catch (err) {//TODO: HANDLE ERR.RESPONSE.JSON 
            console.log(err)
            let errorText = AUTH_ERROR[err.code] || err.message || 'Erro ao registrar usuário';

            setError(errorText)
            setAuthenticated(false);
            //setLoading(false)
            return { done: false, error: errorText }
        }
    };

    //LOGIN
    const login = async (credentials) => {
        //setLoading(true);

        try {
            const res = await xhr.post("/auth/login", credentials);
            const {
                user: userData
            } = res.json();

            // Atualizar estado
            setUser(userData);
            setAuthenticated(true);
            setError(null);

            return { done: true };
        } catch (err) {//401 OU ERRO DE REDE
            console.log(AUTH_ERROR)
            console.log(err)
            let errorText = AUTH_ERROR[err.code] || 'Erro ao entrar'

            setError(errorText);
            setAuthenticated(false)
            //setLoading(false)
            return { done: false, error: errorText };
        }
    };

    // Logout
    const logout = async () => {
        try {
            // 3. Opcional: Chamar API para invalidar token
            await xhr.post('/auth/logout', {})

            // Limpar estado
            setUser(null);
            setError(null);
            setAuthenticated(false)

            // 4. Redirecionar (se estiver usando router)
            // navigate('/login');
            console.log('Logout OK!')
            // Disparar evento global
            return true
        } catch (err) {
            return { done: false, error: err.message };
        }
    };

    //TODO: CONVERTER EM BOOLEAN
    // Verificar se está autenticado
    //const isAuthenticated = useCallback(() => {
    //console.log(sessionStorage)
    //return (user !== null) && (getAccess() !== undefined);
    //}, [user]);

    //TODO: REMOVER, USAR setUser CRU
    // Função para atualizar dados do usuário
    //const updateUser = useCallback((updatedUser) => {
    //sessionStore.setItem('auth_user', updatedUser);
    //setUser(updatedUser);
    //}, []);

    // Valor do contexto
    const contextValue = {
        user,
        error,
        setError,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
        //getToken, //REMOVE, USE TOKENSTORE
        //updateUser, //CHANGE
    };

    //TODO: USAR LOADER APENAS EM COMPONENTES ESPECÍFICOS
    //LOADER MOVIDO PARA APPPROVIDER 
    return (
        <AuthContext value={contextValue}>
            {loading ? (
                <LoadingOverlay isLoading={loading} message="Carregando..." />
            ) : (
                children
            )}
        </AuthContext>
    );
}
