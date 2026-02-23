//import { useNavigate } from 'react-router-dom';
import { XHR } from './xhr';
// 1 - Criar serviço de API

// Criar instância global do cliente
const baseURL = import.meta.env.VITE_API_URL;
const xhr = new XHR(baseURL);
let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

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
        const jsonData = res.json();
        const { accessToken: newToken } = jsonData;
        if (newToken) {
            accessToken = newToken;
            console.log('Access token updated from response');
        }
        return res;
    } catch(err) {
        console.log('Error parsing response: ' + err.message)
        return res;
    }
});

// Interceptor para refresh token
xhr.interceptError(async (error, config) => {
    // Refresh token code check (adjust based on actual API error code)
    if (error.status === 401 && (error.code === 'EEXPIRY' || error.message === 'Token expired')) {
        const originalRequest = config;

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    return xhr.request(originalRequest.url, originalRequest);
                })
                .catch(err => {
                    throw err;
                });
        }

        isRefreshing = true;

        try {
            const response = await xhr.post('/auth/refresh', {});
            const { accessToken: token } = response.json();

            if (token) {
                accessToken = token;
                processQueue(null, token);
                
                // Retry original request
                originalRequest.headers['Authorization'] = `Bearer ${token}`;
                return await xhr.request(originalRequest.url, originalRequest);
            } else {
                throw new Error('Refresh failed');
            }
        } catch (err) {
            processQueue(err, null);
            // Optional: Redirect to login or clear storage
            throw err;
        } finally {
            isRefreshing = false;
        }
    } 
    
    throw error;
});

export { xhr };
//2 - Criar context de autenticação > ../context/authContext.js
