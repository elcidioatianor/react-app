// services/api.js
import { XHR } from './xhr';

const baseURL = import.meta.env.VITE_API_URL;
const xhr = new XHR(baseURL);

let accessToken = null;
let isRefreshing = false;
let failedQueue = [];

// Processa requisições pendentes após refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// OPTIONS padrão
xhr.defaultOptions.timeout = 30000;
xhr.defaultOptions.credentials = 'include'; // CRUCIAL para enviar cookie httpOnly

// Adiciona token no header Authorization
xhr.transformRequest(async config => {
  const csrfCookie = document.cookie
    .split('; ')
    .find(c => c.startsWith('csrfToken='));
  if (csrfCookie) config.headers['X-CSRF-Token'] = csrfCookie.split('=')[1];

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

// Atualiza accessToken se recebido em qualquer resposta
xhr.transformResponse(async res => {
  try {
    const data = await res.json();
    if (data.accessToken) accessToken = data.accessToken;
    return res;
  } catch {
    return res;
  }
});

// Interceptor de erro com refresh automático
xhr.interceptError(async (error, config) => {
  // Intercepta qualquer 401 (accessToken ausente ou expirado)
  if (error.status === 401) {
    const originalRequest = config;

    if (isRefreshing) {
      return new Promise((resolve, reject) =>
        failedQueue.push({ resolve, reject })
      )
        .then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return xhr.request(originalRequest.url, originalRequest);
        })
        .catch(err => { throw err; });
    }

    isRefreshing = true;

    try {
      // Faz refresh usando cookie httpOnly
      const response = await xhr.post('/auth/refresh', {}, { credentials: 'include' });
      const data = await response.json();
      const token = data.accessToken;

      if (!token) throw new Error('Refresh falhou');

      accessToken = token;
      processQueue(null, token);

      // Retry da requisição original
      originalRequest.headers['Authorization'] = `Bearer ${token}`;
      return await xhr.request(originalRequest.url, originalRequest);
    } catch (err) {
      processQueue(err, null);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  // Para outros erros
  throw error;
});

export { xhr };