//import { useNavigate } from 'react-router-dom';
import { XHR } from './xhr';
// 1 - Criar serviço de API

// Criar instância global do cliente
const baseURL = import.meta.env.VITE_API_URL;
const xhr = new XHR(baseURL);
let accessToken = null;

//Evitar loop: refresh lock
// Configurar opções padrão
xhr.defaultOptions.timeout = 30000; // 30 segundos

// Adicionar token automaticamente à requisição
xhr.transformRequest(async config => {
    const csrfCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('csrfToken='));

    if (csrfCookie) {
        config.headers['X-CSRF-Token'] = csrfCookie.split('=')[1];
    }
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
        //TODO: REMOVE IN PRODUCTION
        console.warn('XHR: Enviando requisição sem token de acesso');
    }
    return config;
});

xhr.transformResponse(async res => {
    //TODO: Add next()
    try {
        let { accessToken: newToken } = res.json(); //CAPTURAR NOVO ACCESS TOKEN
        if (newToken) accessToken = newToken;
    } catch {}

    return res;
});

// Interceptor para refresh token
xhr.interceptError(async (error, config) => {
    //TODO: HANDLE REFRESH QUEUE
    //Refresh token é httpOnly, portanto, sem acesso JS
    if (error.status === 401 && error.code === 'EEXPIRY') {
        //
        // Solicitar novo access token
        const response = await xhr.post('/auth/refresh', {});
        const { accessToken: token } = response.json();

        if (token) {
            try {
                let res = await xhr.request(config.url, config);

                return res;
            } catch (err) {
                throw err;
            }
        } else {
            throw error;
        }
    } else {
        //REDIRECIONAR ERRO
        throw error;
    }
});

export { xhr };
//2 - Criar context de autenticação > ../context/authContext.js
