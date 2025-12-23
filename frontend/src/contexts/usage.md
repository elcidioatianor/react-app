Integração com React + Vite: XHR Client Avançado

📦 Instalação e Configuração

1. Criar o arquivo do cliente XHR

```javascript
// src/lib/xhr-client.js
import { createXHRClient } from "./xhr.js";

// Criar instância global do cliente
const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const xhrClient = createXHRClient(API_BASE_URL);

// Configurar opções padrão
xhrClient.defaultOptions.timeout = 30000; // 30 segundos

// Interceptor para React Query/SWR (opcional)
xhrClient.useResponseInterceptor(async (response) => {
    // Adicionar metadata para React Query
    response._timestamp = Date.now();
    response._etag = response.headers["etag"];
    return response;
});

export default xhrClient;
```

2. Contexto de Autenticação Integrado

```jsx
// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { xhrClient } from "../lib/xhr-client";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
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

        return () => {
            window.removeEventListener("auth-expired", handleAuthExpired);
        };
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await xhrClient.get("/auth/me");
            setUser(response.json());
            setError(null);
        } catch (err) {
            console.error("Falha na verificação de autenticação:", err);
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
        } finally {
            setLoading(false);
        }
    };

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
            localStorage.setItem("token", accessToken);
            if (refreshToken) {
                localStorage.setItem("refreshToken", refreshToken);
            }

            // Atualizar estado
            setUser(userData);
            setError(null);
            return { success: true, user: userData };
        } catch (err) {
            const errorMsg = err.response?.json()?.message || "Falha no login";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Limpar storage
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        // Limpar estado
        setUser(null);
        setError(null);

        // Disparar evento global
        window.dispatchEvent(new CustomEvent("user-logged-out"));
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const response = await xhrClient.post("/auth/register", userData);
            const result = response.json();
            return { success: true, data: result };
        } catch (err) {
            const errorMsg =
                err.response?.json()?.message || "Falha no registro";
            setError(errorMsg);
            return { success: false, error: errorMsg };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de AuthProvider");
    }
    return context;
};
```

3. Hook Personalizado para Requisições API

```jsx
// src/hooks/useApi.js
import { useState, useCallback, useEffect, useRef } from "react";
import { xhrClient } from "../lib/xhr-client";
import { useAuth } from "../contexts/AuthContext";

export const useApi = (options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const { isAuthenticated } = useAuth();

    // Opções padrão
    const defaultOptions = {
        autoCancel: true,
        showErrors: true,
        requireAuth: false,
        ...options,
    };

    const execute = useCallback(
        async (path, config = {}) => {
            // Verificar autenticação se necessário
            if (defaultOptions.requireAuth && !isAuthenticated) {
                throw new Error("Autenticação necessária");
            }

            // Cancelar requisição anterior se existir
            if (defaultOptions.autoCancel && abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Criar novo abort controller
            abortControllerRef.current = new AbortController();

            setLoading(true);
            setError(null);

            try {
                const response = await xhrClient.request(path, {
                    ...config,
                    signal: abortControllerRef.current.signal,
                });

                const result = response.json ? response.json() : response.data;
                setData(result);
                return result;
            } catch (err) {
                // Ignorar erros de cancelamento
                if (err.name === "AbortError") {
                    return;
                }

                setError(err);

                if (defaultOptions.showErrors) {
                    // Aqui você pode integrar com um sistema de notificações
                    console.error("API Error:", err);
                }

                throw err;
            } finally {
                setLoading(false);
            }
        },
        [defaultOptions, isAuthenticated],
    );

    const get = useCallback(
        (path, config = {}) => execute(path, { ...config, method: "GET" }),
        [execute],
    );

    const post = useCallback(
        (path, body, config = {}) =>
            execute(path, { ...config, method: "POST", body }),
        [execute],
    );

    const put = useCallback(
        (path, body, config = {}) =>
            execute(path, { ...config, method: "PUT", body }),
        [execute],
    );

    const patch = useCallback(
        (path, body, config = {}) =>
            execute(path, { ...config, method: "PATCH", body }),
        [execute],
    );

    const del = useCallback(
        (path, config = {}) => execute(path, { ...config, method: "DELETE" }),
        [execute],
    );

    // Limpeza na desmontagem
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return {
        data,
        loading,
        error,
        execute,
        get,
        post,
        put,
        patch,
        delete: del,
        reset: () => {
            setData(null);
            setError(null);
        },
    };
};

// Hook para fetch automático
export const useFetch = (path, config = {}, deps = []) => {
    const api = useApi(config);
    const { execute, ...rest } = api;

    useEffect(() => {
        if (path) {
            execute(path, config);
        }
    }, [path, ...deps]);

    return { ...rest, refetch: () => execute(path, config) };
};
```

4. Componente de Loading Global

```jsx
// src/components/LoadingOverlay.jsx
import React from 'react';
import './LoadingOverlay.css';

export const LoadingOverlay = ({ isLoading, message = 'Carregando...' }) => {
    if (!isLoading) return null;

    return (
        <div className="loading-overlay">
            <div className="loading-spinner">
                <div className="spinner"></div>
                {message && <p className="loading-message">{message}</p>}
            </div>
        </div>
    );
};

// src/components/LoadingOverlay.css
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    backdrop-filter: blur(2px);
}

.loading-spinner {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-message {
    margin: 0;
    color: #333;
    font-size: 0.9rem;
}
```

5. Provider Principal da Aplicação

```jsx
// src/providers/AppProviders.jsx
import React from "react";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationProvider } from "./NotificationProvider";
import { LoadingOverlay } from "../components/LoadingOverlay";
import { useAuth } from "../contexts/AuthContext";

const GlobalLoader = () => {
    const { loading } = useAuth();
    return (
        <LoadingOverlay
            isLoading={loading}
            message="Verificando autenticação..."
        />
    );
};

export const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
            <NotificationProvider>
                <GlobalLoader />
                {children}
            </NotificationProvider>
        </AuthProvider>
    );
};
```

6. Hook para Notificações

```jsx
// src/providers/NotificationProvider.jsx
import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = "info", duration = 5000) => {
        const id = Date.now();
        const notification = { id, message, type };

        setNotifications((prev) => [...prev, notification]);

        // Remover automaticamente após duração
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const value = {
        notifications,
        addNotification,
        removeNotification,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer />
        </NotificationContext.Provider>
    );
};

const NotificationContainer = () => {
    const { notifications, removeNotification } =
        useContext(NotificationContext);

    return (
        <div className="notification-container">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification notification-${notification.type}`}
                    onClick={() => removeNotification(notification.id)}
                >
                    {notification.message}
                </div>
            ))}
        </div>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error(
            "useNotification must be used within NotificationProvider",
        );
    }
    return context;
};
```

7. Configuração do Vite

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        proxy: {
            "/api": {
                target: "http://localhost:8080",
                changeOrigin: true,
                secure: false,
            },
        },
    },
    envDir: "./env",
    build: {
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ["react", "react-dom"],
                    xhr: ["./src/lib/xhr.js"],
                },
            },
        },
    },
});
```

8. Arquivo .env.example

```env
# Variáveis de ambiente
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=My React App
VITE_ENVIRONMENT=development
VITE_SENTRY_DSN=
```

9. Exemplo de Componente que Usa a API

```jsx
// src/components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useFetch } from "../hooks/useApi";
import { useAuth } from "../contexts/AuthContext";
import { LoadingOverlay } from "./LoadingOverlay";

export const UserProfile = ({ userId }) => {
    const { user: currentUser } = useAuth();
    const [updateData, setUpdateData] = useState(null);

    // Buscar dados do usuário
    const {
        data: userData,
        loading,
        error,
        refetch,
    } = useFetch(`/users/${userId}`, { requireAuth: true }, [userId]);

    // Hook para atualização
    const { execute: updateUser, loading: updating } = useApi({
        requireAuth: true,
    });

    const handleUpdate = async () => {
        if (!updateData) return;

        try {
            await updateUser(`/users/${userId}`, {
                method: "PUT",
                body: updateData,
            });

            // Atualizar dados locais
            refetch();
            setUpdateData(null);

            // Mostrar notificação de sucesso
            // (integração opcional com sistema de notificações)
        } catch (err) {
            console.error("Falha ao atualizar:", err);
        }
    };

    if (loading) return <LoadingOverlay isLoading={true} />;
    if (error) return <div className="error">Erro: {error.message}</div>;
    if (!userData) return <div>Usuário não encontrado</div>;

    return (
        <div className="user-profile">
            <LoadingOverlay isLoading={updating} message="Salvando..." />

            <div className="profile-header">
                <h2>{userData.name}</h2>
                <p>{userData.email}</p>
            </div>

            <div className="profile-form">
                <h3>Editar Perfil</h3>
                <input
                    type="text"
                    defaultValue={userData.name}
                    onChange={(e) =>
                        setUpdateData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="Nome"
                />
                <input
                    type="email"
                    defaultValue={userData.email}
                    onChange={(e) =>
                        setUpdateData((prev) => ({
                            ...prev,
                            email: e.target.value,
                        }))
                    }
                    placeholder="Email"
                />

                {updateData && (
                    <button onClick={handleUpdate} disabled={updating}>
                        {updating ? "Salvando..." : "Salvar Alterações"}
                    </button>
                )}
            </div>
        </div>
    );
};
```

10. Arquivo Principal da Aplicação

```jsx
// src/App.jsx
import React from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { AppProviders } from "./providers/AppProviders";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { UserProfile } from "./components/UserProfile";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
    return (
        <AppProviders>
            <Router>
                <Routes>
                    {/* Rotas públicas */}
                    <Route path="/login" element={<Login />} />

                    {/* Rotas protegidas */}
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Dashboard />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <PrivateRoute>
                                <UserProfile />
                            </PrivateRoute>
                        }
                    />

                    {/* Rota fallback */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AppProviders>
    );
}

export default App;
```

11. Componente de Rota Protegida

```jsx
// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LoadingOverlay } from "./LoadingOverlay";

export const PrivateRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <LoadingOverlay isLoading={true} message="Verificando acesso..." />
        );
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};
```

12. Estilos Globais (CSS)

```css
/* src/index.css */
:root {
    --primary-color: #3498db;
    --secondary-color: #2c3e50;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    --warning-color: #f39c12;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family:
        -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
        sans-serif;
    background-color: #f5f5f5;
}

.notification-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
}

.notification {
    padding: 1rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    animation: slideIn 0.3s ease-out;
}

.notification-info {
    background-color: var(--primary-color);
}

.notification-success {
    background-color: var(--success-color);
}

.notification-error {
    background-color: var(--danger-color);
}

.notification-warning {
    background-color: var(--warning-color);
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
```

13. Scripts do package.json

```json
{
    "scripts": {
        "dev": "vite",
        "build": "vite build",
        "preview": "vite preview",
        "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
        "format": "prettier --write src/"
    },
    "dependencies": {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.14.0"
    },
    "devDependencies": {
        "@types/react": "^18.2.0",
        "@types/react-dom": "^18.2.0",
        "@vitejs/plugin-react": "^4.0.0",
        "eslint": "^8.45.0",
        "eslint-plugin-react": "^7.32.2",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.0",
        "prettier": "^3.0.0",
        "vite": "^4.4.0"
    }
}
```

🚀 Como Usar

1. Inicialização

```bash
# Instalar dependências
npm install

# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

2. Uso Básico

```jsx
// Exemplo 1: Hook useFetch
import { useFetch } from './hooks/useApi';

function UserList() {
    const { data: users, loading, error } = useFetch('/users');

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>Erro: {error.message}</div>;

    return (
        <ul>
            {users?.map
```
