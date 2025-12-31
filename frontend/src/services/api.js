//import { useNavigate } from 'react-router-dom';
import { XHR } from './xhr';
import { errors } from './errors';
// 1 - Criar serviço de API

// Criar instância global do cliente
const baseURL = import.meta.env.VITE_API_URL;
const xhr = new XHR(baseURL);
let accessToken = null;

//Evitar loop: refresh lock
// Configurar opções padrão
xhr.defaultOptions.timeout = 15000; // 30 segundos

// Interceptor para adicionar token automaticamente
xhr.transformRequest(async config => {
    //REQUEST LOGGER
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
        console.warn('XHR: No access token');
    }

    return config;
});

xhr.transformResponse(async res => {
    //add next()
    try {
        let { accessToken: newToken } = res.json(); //CAPTURE NEW ACCESS TOKEN HERE
        if (newToken) accessToken = newToken;
    } catch {
        return res;
    }

    return res;
});

// Interceptor para refresh token
xhr.interceptError(async (error, config) => {
    //TODO: HANDLE REFRESH QUEUE
    //Refresh token é httpOnly, portanto, sem acesso JS
    if (error.status === 401 && error.code === errors.EACCESS_EXPIRED) {
        //Tentar refresh (se o refresh existir no cookie, será enviado pelo browser
        //const refreshToken = getRefreshToken();
        //if (!refreshToken) throw error;
        console.log('Refreshing access token');
            // Solicitar novo access token
            const response = await xhr.post('/auth/refresh', {});
            //const refreshToken = getRefresh();
            ({ accessToken } = response.json());
            
            if (accessToken) {
                try {
                    let res = await xhr.request(config.url, config);
                    //throw error

                    return res;
                } catch (err) {
                    console.error(err);
                }
            } else {
                console.error('Erro ao obter novo token');
                throw error;
            }
        //SEM REFRESH TOKEN, MANIPULAR ERRO ORIGINAL
    } else if (error.status === 403) {
        //TODO: VER ESTE ERRO E LIDAR COM ELE DE FORMA ESPECÍFICA
        //navigate("/access-denied"); //usar Navigate()
    } else { //REDIRECIONAR ERRO
        throw error;
    }   
});

export { xhr };
//2 - Criar context de autenticação > ../context/authContext.js
