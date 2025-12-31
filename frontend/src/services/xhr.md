Documentação: XHR Client Avançado para Autenticação

📋 Visão Geral

Este módulo fornece uma implementação robusta de cliente HTTP baseado em XMLHttpRequest com sistema completo de interceptors, tratamento automático de tokens de autenticação e refresh token. É especialmente otimizado para integração com sistemas de autenticação modernos.

🏗️ Estrutura do Módulo

Classes Principais

1. XHRError - Classe de Erro Personalizada

Propósito: Extensão da classe Error padrão para fornecer informações detalhadas sobre falhas em requisições HTTP.

Propriedades:

· name: "XHRError"
· status: Código HTTP de status
· statusText: Descrição do status HTTP
· xhr: Instância original do XMLHttpRequest
· response: Resposta bruta da requisição

Exemplo:

```javascript
try {
    await client.get("/api/data");
} catch (error) {
    if (error instanceof XHRError) {
        console.error(`Erro ${error.status}: ${error.message}`);
        console.error("Resposta:", error.response);
    }
}
```

2. XHRResponse - Wrapper de Resposta

Propósito: Encapsula a resposta HTTP com métodos auxiliares para processamento.

Propriedades:

· xhr: Instância XMLHttpRequest original
· status: Código de status HTTP
· statusText: Texto do status
· data: Dados da resposta
· url: URL final da requisição

Métodos:

get headers()

Retorna os cabeçalhos de resposta como objeto JavaScript.

```javascript
const response = await client.get("/api/data");
const contentType = response.headers["content-type"];
```

json()

Converte a resposta para objeto JavaScript.

```javascript
const response = await client.get("/api/users");
const users = response.json(); // Retorna objeto parseado
```

text()

Retorna a resposta como texto.

```javascript
const response = await client.get("/api/data");
const textData = response.text();
```

blob()

Retorna a resposta como Blob (útil para arquivos).

```javascript
const response = await client.get("/api/file.pdf", {
    responseType: "blob",
});
const pdfBlob = response.blob();
```

3. XHR - Classe Principal do Cliente

Construtor

```javascript
const client = new XHR(baseURL, options);
```

Parâmetros:

· baseURL (String): URL base para todas as requisições
· options (Object): Configurações padrão

Opções Padrão:

```javascript
{
    method: 'GET',
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    },
    credentials: 'include', // Envia cookies automaticamente
    responseType: '', // 'json', 'text', 'blob', 'arraybuffer'
    timeout: 0 // 0 = sem timeout
}
```

Sistema de Interceptors

Request Interceptors

Interceptam e modificam configurações antes da requisição ser enviada.

```javascript
// Adicionar cabeçalho personalizado
client.useRequestInterceptor(async (config) => {
    config.headers["X-Custom-Header"] = "valor";
    return config;
});

// Interceptor com tratamento de erro
client.useRequestInterceptor(
    async (config) => {
        // Transformação da configuração
        return config;
    },
    (error) => {
        console.error("Erro no interceptor:", error);
    },
);
```

Response Interceptors

Interceptam e modificam respostas bem-sucedidas.

```javascript
// Processar resposta
client.useResponseInterceptor(async (response) => {
    console.log("Resposta recebida:", response.status);

    // Modificar dados da resposta
    if (response.data) {
        response.data.timestamp = new Date().toISOString();
    }

    return response;
});
```

Response Error Interceptors

Interceptam e tratam erros de resposta.

```javascript
// Log de erros
client.useResponseErrorInterceptor(async (error) => {
    console.error("Erro HTTP:", error.status, error.message);

    // Re-lançar o erro ou tratar
    if (error.status === 403) {
        // Redirecionar para login
        window.location.href = "/login";
    }

    throw error; // Importante: re-lançar para propagação
});
```

Limpar Interceptors

```javascript
client.clearInterceptors(); // Remove todos os interceptors
```

Método Core: request()

Assinatura: request(path, options) → Promise<XHRResponse>

Parâmetros:

· path (String): Caminho relativo ou URL completa
· options (Object): Configurações da requisição

Opções Disponíveis:

```javascript
{
    method: 'GET', // Método HTTP
    headers: {}, // Cabeçalhos adicionais
    body: null, // Corpo da requisição
    params: {}, // Parâmetros de query string
    credentials: 'include', // 'same-origin', 'omit'
    responseType: '', // Tipo de resposta
    timeout: 0 // Timeout em ms
}
```

Exemplo:

```javascript
const response = await client.request("/api/users", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: { name: "João", email: "joao@exemplo.com" },
    params: {
        limit: 10,
        page: 1,
    },
    timeout: 5000,
});
```

Métodos Convenientes (HTTP Verbs)

get(path, options)

```javascript
const users = await client.get("/api/users", {
    params: { active: true },
});
```

post(path, body, options)

```javascript
const newUser = await client.post(
    "/api/users",
    {
        name: "Maria",
        email: "maria@exemplo.com",
    },
    {
        headers: { "X-Request-ID": "123" },
    },
);
```

put(path, body, options)

```javascript
const updated = await client.put("/api/users/123", {
    name: "Maria Silva",
});
```

patch(path, body, options)

```javascript
const partialUpdate = await client.patch("/api/users/123", {
    email: "novo@email.com",
});
```

delete(path, options)

```javascript
await client.delete("/api/users/123");
```

head(path, options)

```javascript
const headers = await client.head("/api/resource");
```

4. createXHRClient() - Fábrica para Autenticação

Propósito: Cria uma instância pré-configurada do cliente XHR com interceptors para autenticação automática.

Funcionalidades Automáticas:

1. Adição Automática de Token

```javascript
// Adiciona token Bearer automaticamente aos cabeçalhos
const token =
    localStorage.getItem("token") || sessionStorage.getItem("auth_token");
// Resultado: Authorization: Bearer <token>
```

2. Refresh Token Automático

· Detecta erros 401 (Unauthorized)
· Tenta renovar o token usando refresh token
· Reexecuta a requisição original automaticamente
· Limpa tokens inválidos e dispara evento de logout

Uso:

```javascript
import { createXHRClient } from "./xhr.js";

// Criação do cliente com base URL
const apiClient = createXHRClient("https://api.exemplo.com");

// Uso transparente com autenticação automática
async function fetchUserData() {
    try {
        // Token será adicionado automaticamente
        const response = await apiClient.get("/user/profile");

        // Se token expirar, será renovado automaticamente
        // e a requisição será reexecutada
        return response.json();
    } catch (error) {
        // Erro 401 sem refresh token disponível
        // Evento 'auth-expired' será disparado
        console.error("Falha na autenticação:", error);
    }
}
```

Evento de Autenticação Expirada

Quando o refresh token falha, o cliente dispara um evento customizado:

```javascript
// Listener para tratamento global de logout
window.addEventListener("auth-expired", () => {
    console.log("Sessão expirada. Redirecionando...");

    // Limpar estado local
    localStorage.clear();
    sessionStorage.clear();

    // Redirecionar para login
    window.location.href = "/login?expired=true";
});
```

🔧 Configuração Avançada

Customização do Client Factory

```javascript
function createCustomXHRClient(baseURL) {
    const client = new XHR(baseURL);

    // Interceptor customizado para logs
    client.useRequestInterceptor(async (config) => {
        console.log(`[${config.method}] ${config.url}`);
        return config;
    });

    // Interceptor para tratamento de erros globais
    client.useResponseErrorInterceptor(async (error) => {
        if (error.status === 500) {
            // Mostrar notificação de erro do servidor
            showNotification("Erro interno do servidor", "error");
        }
        throw error;
    });

    // Adicionar headers padrão
    client.defaultOptions.headers["X-Application-Version"] = "1.0.0";

    return client;
}
```

Tipos de Body Suportados

O cliente detecta automaticamente o tipo de body:

```javascript
// JSON (padrão para objetos)
await client.post("/api/data", { key: "value" });
// Content-Type: application/json

// FormData
const formData = new FormData();
formData.append("file", fileInput.files[0]);
await client.post("/api/upload", formData);
// Content-Type: multipart/form-data

// URLSearchParams
const params = new URLSearchParams();
params.append("key1", "value1");
await client.post("/api/submit", params);
// Content-Type: application/x-www-form-urlencoded

// Blob/ArrayBuffer
const blob = new Blob([binaryData], { type: "image/png" });
await client.post("/api/upload", blob);
```

🛡️ Tratamento de Erros

Estratégias Recomendadas

```javascript
async function safeApiCall(apiFunction, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (error.status === 429 && i < retries - 1) {
                // Too Many Requests - esperar e retentar
                await new Promise((resolve) =>
                    setTimeout(resolve, Math.pow(2, i) * 1000),
                );
                continue;
            }

            // Outros erros
            if (error.status >= 500) {
                throw new Error("Serviço indisponível. Tente novamente.");
            }

            throw error;
        }
    }
}

// Uso
const data = await safeApiCall(() => client.get("/api/sensitive-data"));
```

📱 Exemplo de Integração com React/Vue

React Hook Example

```javascript
import { useState, useEffect, useCallback } from "react";
import { createXHRClient } from "./xhr.js";

const apiClient = createXHRClient(process.env.REACT_APP_API_URL);

export function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (method, path, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await apiClient[method](path, options);
            return response.json();
        } catch (err) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { fetchData, loading, error };
}
```

🔒 Considerações de Segurança

1. Armazenamento de Tokens

```javascript
// Recomendado: sessionStorage para tokens de sessão
sessionStorage.setItem("auth_token", token);

// localStorage apenas para refresh tokens (com expiração)
localStorage.setItem("refresh_token", refreshToken);
localStorage.setItem("token_expiry", Date.now() + 3600000);
```

2. Proteção CSRF

```javascript
// Adicionar token CSRF automaticamente
client.useRequestInterceptor(async (config) => {
    const csrfToken = document.querySelector(
        'meta[name="csrf-token"]',
    )?.content;
    if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
    }
    return config;
});
```

3. Rate Limiting

```javascript
// Interceptor para controle de rate limiting
const requestQueue = [];
let requestsInLastMinute = 0;

client.useRequestInterceptor(async (config) => {
    if (requestsInLastMinute > 60) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    requestsInLastMinute++;
    setTimeout(() => requestsInLastMinute--, 60000);

    return config;
});
```

🎯 Boas Práticas

1. Configuração Global

```javascript
// api-client.js
export const apiClient = createXHRClient(process.env.API_BASE_URL);

// Configurações adicionais
apiClient.defaultOptions.timeout = 30000; // 30 segundos
apiClient.defaultOptions.headers["X-Client-Version"] = APP_VERSION;

export default apiClient;
```

2. Tratamento Centralizado de Erros

```javascript
// error-handler.js
export function setupGlobalErrorHandling(client) {
    client.useResponseErrorInterceptor(async (error) => {
        // Log para serviço de monitoramento
        if (process.env.NODE_ENV === "production") {
            logToMonitoringService(error);
        }

        // Notificação para o usuário
        if (error.status !== 401) {
            // 401 tratado pelo refresh
            showUserFriendlyError(error);
        }

        throw error;
    });
}
```

3. Cache de Requisições

```javascript
const requestCache = new Map();

client.useRequestInterceptor(async (config) => {
    if (config.method === "GET" && config.cache !== false) {
        const cacheKey = `${config.method}:${config.url}`;
        const cached = requestCache.get(cacheKey);

        if (cached && Date.now() - cached.timestamp < 30000) {
            throw { cached: true, data: cached.data };
        }
    }

    return config;
});

client.useResponseInterceptor(async (response) => {
    const config = response.xhr._config;

    if (config.method === "GET" && config.cache !== false) {
        const cacheKey = `${config.method}:${config.url}`;
        requestCache.set(cacheKey, {
            data: response.data,
            timestamp: Date.now(),
        });
    }

    return response;
});
```

📦 Instalação e Uso

ES Modules (Recomendado)

```javascript
import { createXHRClient } from "./xhr.js";

const api = createXHRClient("https://api.exemplo.com");

// Uso
const data = await api.get("/endpoint");
```

Uso com TypeScript

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
}

async function getUser(id: number): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    const result = response.json();
    return result.data;
}
```

🚀 Performance Tips

1. Reutilização de Instâncias: Crie uma única instância global do cliente
2. Timeout Adequado: Configure timeouts baseados no tipo de operação
3. Cancelamento: Implemente abort controllers para requisições longas
4. Compressão: Ative gzip no servidor para reduzir payload
5. Pooling: Reutilize conexões HTTP quando possível

---

Esta documentação cobre todas as funcionalidades do módulo XHR otimizado para autenticação. O sistema é flexível, seguro e pronto para produção, oferecendo uma alternativa robusta ao Fetch API com funcionalidades avançadas de interceptors e gerenciamento automático de tokens.
