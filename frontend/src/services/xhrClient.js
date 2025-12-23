import { XHR } from "../assets/js/xhr";
import { secureStore, STORAGE_KEYS } from "./secureStore";

// FÁBRICA PARA SEU AUTHCONTEXT
export function createXHRClient(baseURL = "") {
    const client = new XHR(baseURL);

    // Interceptor para adicionar token automaticamente
    client.useRequestInterceptor(async (config) => {
        const token =
            secureStore.get(STORAGE_KEYS.TOKEN) ||
            secureStore.get(STORAGE_KEYS.TOKEN);

        if (token && !config.headers["Authorization"]) {
            config.headers = {
                ...config.headers,
                Authorization: `Bearer ${token}`,
            };
        }

        return config;
    });

    // Interceptor para refresh token
    client.useResponseErrorInterceptor(async (error, config) => {
        if (error.status === 401 /*&& !error.config?._retry*/) {
            const refreshToken =
                secureStore.get(STORAGE_KEYS.TOKEN) ||
                secureStore.get(STORAGE_KEYS.REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    // Tentar refresh
                    const refreshResponse = await client.post("/auth/refresh", {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } =
                        refreshResponse.json();

                    // Armazenar novos tokens
                    secureStore.set(STORAGE_KEYS.TOKEN, accessToken);
                    if (newRefreshToken) {
                        secureStore.set(STORAGE_KEYS.TOKEN, newRefreshToken);
                    }

                    // Retentar requisição original
                    config.headers.Authorization = `Bearer ${accessToken}`;
                    //error.config._retry = true;
					
                    return client.request(error.xhr.responseURL || '/auth/login', config);
                } catch (refreshError) {
                    // Refresh falhou, limpar tokens
                    secureStore.remove(STORAGE_KEYS.TOKEN);
                    secureStore.remove(STORAGE_KEYS.REFRESH_TOKEN);
                    secureStore.remove(STORAGE_KEYS.USER);

                    // Disparar evento para o AuthContext
                    window.dispatchEvent(new CustomEvent("auth-expired"));

                    throw refreshError;
                }
            } //SEM REFRESH TOKEN, MANIPULAR ERRO ORIGINAL 
        }
		//REDIRECIONAR ERRO
        throw error;
    });

    return client;
}
