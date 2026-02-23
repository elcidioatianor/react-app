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
    console.log('=== REQUEST INTERCEPTOR ===');
    console.log('URL:', config.url);
    console.log('Current accessToken:', accessToken ? accessToken.substring(0, 20) + '...' : 'null');
    
    const csrfCookie = document.cookie
        .split('; ')
        .find(cookie => cookie.startsWith('csrfToken='));

    if (csrfCookie) {
        config.headers['X-CSRF-Token'] = csrfCookie.split('=')[1];
        console.log('CSRF Token set');
    }
    if (accessToken) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        console.log('Authorization header set');
    } else {
        console.warn('XHR: Enviando requisição sem token de acesso');
    }
    console.log('Request headers:', Object.keys(config.headers));
    return config;
});

xhr.transformResponse(async res => {
    //TODO: Add next()
    console.log('=== RESPONSE INTERCEPTOR ===');
    console.log('Response status:', res.status);
    console.log('Response URL:', res.url);
    
    try {
        const jsonData = res.json();
        console.log('Response data keys:', Object.keys(jsonData));
        const { accessToken: newToken } = jsonData;
        
        if (newToken) {
            console.log('New accessToken found in response:', newToken.substring(0, 20) + '...');
            accessToken = newToken;
            console.log('Access token updated. New value:', accessToken.substring(0, 20) + '...');
        } else {
            console.log('No accessToken in response');
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
