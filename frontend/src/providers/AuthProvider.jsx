import { useState, useEffect, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { xhrClient } from "../services/api";
import { STORAGE_KEYS, secureStore } from "../services/secureStore";
import { LoadingOverlay } from "../components/LoadingOverlay";

//Provider é o elemento (wrapper) que encapsula o Context,
//mas parq usar o valor temos que ler do proprio Context
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Verificar autenticação inicial
    useEffect(() => {
        checkAuth();

        // Listener para evento de expiração de autenticação
        const handleAuthExpired = () => {
            logout();
        };

        window.addEventListener("auth-expired", handleAuthExpired);

        // Listener para sincronizar entre abas (opcional)
        //const handleStorageChange = (e) => {
        //if (e.key === STORAGE_KEYS.USER || e.key === STORAGE_KEYS.TOKEN) {
        //checkAuth();
        //}
        //};

        //window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener("auth-expired", handleAuthExpired);
            //window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const checkAuth = async () => {
        const token = secureStore.get(STORAGE_KEYS.TOKEN);

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            //ENVIAR CHAMADA API REAL PARA VERIFICAR SE O USUÁRIO ESTÁ LOGADO, TOKEN NÃO EXPIROU, ETC
            const response = await xhrClient.get(
                "/auth/IMPLEMENT_ME_ON_AUTHCONTEXT",
            );
            setUser(response.json());
            setError(null);
        } catch (err) {
            console.error("Falha na verificação de autenticação:", err);
            secureStore.remove(STORAGE_KEYS.TOKEN);
            secureStore.remove(STORAGE_KEYS.REFRESH_TOKEN);
        } finally {
            setLoading(false);
        }
    };

    // Registrar
    const register = async (formData) => {
        setLoading(true);
        try {
            const response = await xhrClient.post("/auth/register", formData);

            //if (response.status === 201 && response.data) {
            const {
                user: userData,
                accessToken,
                refreshToken,
            } = response.json();

            // Validar dados obrigatórios
            if (!userData || !accessToken) {
                throw new Error("Dados de autenticação incompletos");
            }

            // Armazenar de forma segura
            secureStore.set(STORAGE_KEYS.USER, userData); //TODO: MAIS TARDE, APENAS ARMAZENAR TOKENS E ID, E BUSCAR USUÁRIO NO SERVIDOR SEMPRE QUE PRECISAR
            secureStore.set(STORAGE_KEYS.TOKEN, accessToken);

            // Refresh token pode ser armazenado em cookie httpOnly
            // ou manter em sessionStorage para simplicidade
            if (refreshToken) {
                secureStore.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
            }

            setUser(userData);
            return { success: true, data: result };
            //}
        } catch (err) {//TODO: HANDLE ERR.RESPONSE.JSON 
            let errorText;

			if (err.name ==='XHRError') {
				try {
					const res = JSON.parse(err.xhr.response);
					errorText = res.message
				} catch {
            		errorText = err.xhr.response || err.statusText || (err.status === 0 ? "Erro de rede. Verifique a sua conexão" : err.message) || 'Erro no cadastro. Tente novamente dentro de instantes';
				}
			} else {
				errorText = err.message
			}
            return { success: false, error: errorText };
        } finally {//REMOVE TIMER LATER
			setTimeout(() => {
            	setLoading(false);
			}, 5000)
        }
    };

    //LOGIN
    const login = async (credentials) => {
        setLoading(true);
        try {
            const response = await xhrClient.post("/auth/login", credentials);
            const {
                accessToken,
                refreshToken,
                user: userData,
            } = response.json();

            // Armazenar tokens
            secureStore.set(STORAGE_KEYS.TOKEN, accessToken);
            if (refreshToken) {
                secureStore.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
            }

            // Atualizar estado
            setUser(userData);
            setError(null);
            return { success: true, user: userData };
        } catch (err) {//401 OU ERRO DE REDE
			let errorText;

			if (err.name ==='XHRError') {
				try {
					const res = JSON.parse(err.xhr.response);
					errorText = res.message
				} catch {
            		errorText = err.xhr.response || err.statusText || (err.status === 0 ? "Erro de rede. Verifique a sua conexão" : err.message) || 'Erro de autenticação. Tente novamente dentro de instantes';
				}
			} else {
				errorText = err.message
			}
			console.error(err)
            setError(errorText);
            return { success: false, error: errorText };
        } finally { //TODO: DEPOIS REMOVER TIMEOUT (APENAS PARA TESTES DE UI)
			setTimeout(() => {
            	setLoading(false);
			}, 5000)
        }
    };

    // Logout
    const logout = useCallback(() => {
        //É necessário usar callback??
        // Limpar storage
        secureStore.remove(STORAGE_KEYS.TOKEN);
        secureStore.remove(STORAGE_KEYS.AUTH_TOKEN);
        secureStore.remove(STORAGE_KEYS.USER);

        // Limpar estado
        setUser(null);
        setError(null);

        // 3. Opcional: Chamar API para invalidar token
        // xhr.post('/auth/logout').catch(console.error);

        // 4. Redirecionar (se estiver usando router)
        // window.location.href = '/login';

        // Disparar evento global
        window.dispatchEvent(new CustomEvent("user-logged-out"));
    }, []);

    // Verificar se está autenticado
    const isAuthenticated = useCallback(() => {
		//console.log(sessionStorage)
        return (user !== null) && (secureStore.get(STORAGE_KEYS.TOKEN) !== undefined);
    }, [user]);

    // Obter token (para usar em requisições)
    const getToken = useCallback(() => {
        return secureStore.get(STORAGE_KEYS.TOKEN);
    }, []);

    // Função para atualizar dados do usuário
    const updateUser = useCallback((updatedUser) => {
        secureStore.set(STORAGE_KEYS.USER, updatedUser);
        setUser(updatedUser);
    }, []);

    // Valor do contexto
    const contextValue = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
        getToken,
        updateUser,
    };

    //TODO: USAR LOADER APENAS EM COMPONENTES ESPECÍFICOS 
    return (
        <AuthContext value={contextValue}>
            {/*loading ? (
                  <LoadingOverlay isLoading={loading} message="Carregando..."/>
            ) : (*/
            	children
            /*)*/}
        </AuthContext>
    );
}
