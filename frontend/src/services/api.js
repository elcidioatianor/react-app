import { createXHRClient } from "./xhrClient";

// 1 - Criar serviço de API
// Criar instância global do cliente
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const xhrClient = createXHRClient(API_BASE_URL);

// Configurar opções padrão
xhrClient.defaultOptions.timeout = 30000; // 30 segundos

// Adicionar interceptor para logs
xhrClient.useRequestInterceptor(async (config) => {
    console.log(`[${new Date().toISOString()}] ${config.method} ${config.url}`);
    return config;
});

// Interceptor para erros globais
xhrClient.useResponseErrorInterceptor(async (error) => {
    if (error.status === 403) {
        // Redirecionar para página de acesso negado
        window.location.href = "/access-denied";
    }
    throw error;
});

// Interceptor para React Query/SWR (opcional)
xhrClient.useResponseInterceptor(async (response) => {
    // Adicionar metadata para React Query
    response._timestamp = Date.now();
    response._etag = response.headers["etag"];
    return response;
});

//2 - Criar context de autenticação > ../context/authContext.js
