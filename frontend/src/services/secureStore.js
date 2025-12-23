// Constantes para evitar typos
export const STORAGE_KEYS = {
    USER: "auth_user",
    TOKEN: "auth_token",
    REFRESH_TOKEN: "auth_refresh_token",
};

// Helper para armazenar dados de forma segura
export const secureStore = {
    set: (key, value) => {
        try {
            if (value === null || value === undefined) {
                sessionStorage.removeItem(key);
                return;
            }

            // Converter para string se for objeto
            const stringValue =
                typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value);

            sessionStorage.setItem(key, stringValue);
        } catch (error) {
            console.error(`Erro ao armazenar ${key}:`, error);
            // Fallback para memória em caso de erro?
        }
    },

    get: (key) => {
        try {
            const item = sessionStorage.getItem(key);
            if (!item) return null;

            // Tentar parsear como JSON, senão retornar como string
            try {
                return JSON.parse(item);
            } catch {
                return item;
            }
        } catch (error) {
            console.error(`Erro ao recuperar ${key}:`, error);
            return null;
        }
    },

    remove: (key) => {
        try {
            sessionStorage.removeItem(key);
        } catch (error) {
            console.error(`Erro ao remover ${key}:`, error);
        }
    },

    clear: () => {
        try {
            // Remove apenas itens de autenticação
            Object.values(STORAGE_KEYS).forEach((key) => {
                sessionStorage.removeItem(key);
            });
        } catch (error) {
            console.error("Erro ao limpar storage:", error);
        }
    },
};
