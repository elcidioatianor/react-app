// src/hooks/useApi.js
import { useState, useCallback, useEffect, useRef } from "react";
import { xhrClient } from "../services/api";
import { useAuthContext } from "../contexts/AuthContext";

export const useApi = (options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const { isAuthenticated } = useAuthContext();

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
            if (defaultOptions.requireAuth && !isAuthenticated()) {
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
