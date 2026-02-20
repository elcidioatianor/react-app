// xhr.js - Versão reimplementada e otimizada
// Mantém aprendizado de XHR e interceptors, sem depender de axios
// TODO: USE use() hook from socket
class XHRError extends Error {
    constructor(xhr, message = null) {
        super(message || xhr.statusText || 'Network Error');
        this.name = 'XHRError';
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        try {
            const response = JSON.parse(xhr.response);
            this.message = response.error;
        } catch {}
        this.xhr = xhr;
    }
}

class XHRResponse {
    constructor(xhr) {
        this.xhr = xhr;
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.data = xhr.response;
        this.url = xhr.responseURL;
    }

    get headers() {
        const headerStr = this.xhr.getAllResponseHeaders();
        const headers = {};
        if (headerStr) {
            const lines = headerStr.trim().split(/[\r\n]+/);
            for (const line of lines) {
                const [key, ...valueParts] = line.split(': ');
                headers[key.toLowerCase()] = valueParts.join(': ');
            }
        }
        return headers;
    }

    json() {
        try {
            return JSON.parse(this.xhr.responseText);
        } catch {
            throw new XHRError(this.xhr, 'Response is not valid JSON');
        }
    }

    text() {
        return this.xhr.responseText;
    }

    blob() {
        return this.xhr.response;
    }
}

/**
 * Serializa ranges para o header Range
 * @param {Array<[number, number]|string>} ranges - Array de pares [start, end] ou strings 'bytes=...'
 * @returns {string} Header Range formatado
 */
function serializeRangeHeader(ranges) {
    if (!ranges || !ranges.length) return null;
    
    // Se já veio como string, usa diretamente
    if (typeof ranges === 'string') return ranges;
    
    // Formata cada range como "start-end"
    const rangeUnits = ranges.map(range => {
        // Suporta tanto tuplas [10,20] quanto objetos {start:10,end:20}
        if (Array.isArray(range)) {
            const [start, end] = range;
            return `${start}-${end}`;
        } else if (range.start !== undefined && range.end !== undefined) {
            return `${range.start}-${range.end}`;
        } else if (range.unit) {
            // Caso especial para formato completo com unidade
            return `${range.unit}=${range.start}-${range.end}`;
        }
        return range; // fallback
    });

    return `bytes=${rangeUnits.join(', ')}`;
}

/**
 * Serializador de options para incluir range headers
 * @param {Object} options - Opções da requisição
 * @returns {Object} Opções processadas com headers atualizados
 */
function rangeHeaderSerializer(options = {}) {
    if (!options.range) return options;
    
    const headers = { ...options.headers };
    const rangeHeader = serializeRangeHeader(options.range);
    
    if (rangeHeader) {
        headers.Range = rangeHeader;
    }
    
    return {
        ...options,
        headers
    };
}

export class XHR {
    constructor(baseURL = '', options = {}) {
        // Garante trailing slash
        if (baseURL && !baseURL.endsWith('/')) baseURL += '/';

        this.baseURL = baseURL;
        this.defaultOptions = {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
            credentials: 'include',
            responseType: '',
            timeout: 0,
            ...options,
        };

        this.hook = {
            request: [],
            response: [],
            responseError: [],
        };
        
        // Interceptor automático para range
        this.transformRequest(rangeHeaderSerializer);
    }

    // ===== Métodos utilitários para range =====
    /**
     * Cria uma requisição com ranges específicos
     * @param {string} path - URL da requisição
     * @param {Array<[number, number]|Object>} ranges - Array de ranges
     * @param {Object} options - Opções adicionais
     */
    withRange(path, ranges, options = {}) {
        return this.request(path, {
            ...options,
            range: ranges
        });
    }

    /**
     * Requisição GET com suporte a múltiplos ranges
     * @param {string} path - URL da requisição
     * @param {Array<[number, number]>} ranges - Array de ranges [start, end]
     * @param {Object} options - Opções adicionais
     */
    getRange(path, ranges, options = {}) {
        return this.withRange(path, ranges, { ...options, method: 'GET' });
    }

    /**
     * Verifica se o servidor suporta requisições com range
     * @param {string} path - URL para testar
     * @returns {Promise<Object>} Informações de suporte a range
     */
    async supportsRange(path) {
        try {
            const response = await this.head(path);
            const acceptRanges = response.headers['accept-ranges'];
            const contentLength = response.headers['content-length'];
            
            return {
                supportsRange: acceptRanges === 'bytes',
                acceptRanges,
                contentLength: contentLength ? parseInt(contentLength) : null,
                unit: acceptRanges || 'none'
            };
        } catch {
            return {
                supportsRange: false,
                acceptRanges: null,
                contentLength: null,
                unit: 'none'
            };
        }
    }

    // ===== Interceptors =====
    transformRequest(onFulfilled, onRejected = null) {
        this.hook.request.push({ onFulfilled, onRejected });
    }

    transformResponse(onFulfilled, onRejected = null) {
        this.hook.response.push({ onFulfilled, onRejected });
    }

    interceptError(onRejected) {
        this.hook.responseError.push(onRejected);
    }

    clearInterceptors() {
        this.hook.request = [];
        this.hook.response = [];
        this.hook.responseError = [];
    }

    // ===== Core request =====
    async request(path, options = {}) {
        // Merge options
        const requestOptions = {
            ...this.defaultOptions,
            ...options,
            headers: {
                ...this.defaultOptions.headers,
                ...options.headers,
            },
        };

        // Build URL
        let url;
        try {
            url = new URL(path, this.baseURL || window.location.origin);
        } catch {
            url = new URL(`${this.baseURL}${path}`);
        }
        
        // Query params
        if (requestOptions.params) {
            Object.entries(requestOptions.params).forEach(([k, v]) => {
                if (v !== undefined && v !== null) url.searchParams.set(k, v);
            });
        }

        // Prepare config
        let config = {
            method: requestOptions.method.toUpperCase(),
            url: url.toString(),
            headers: requestOptions.headers,
            body: requestOptions.body,
            credentials: requestOptions.credentials,
            responseType: requestOptions.responseType,
            timeout: requestOptions.timeout,
            // Propriedade range será processada pelo interceptor
            range: requestOptions.range,
        };

        // ===== Request interceptors =====
        for (const hook of this.hook.request) {
            try {
                const result = await hook.onFulfilled(config);
                if (result) config = result;
            } catch (error) {
                if (hook.onRejected) hook.onRejected(error);
                throw error;
            }
        }

        // ===== Execute XHR =====
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(config.method, config.url, true);

            // Headers
            Object.entries(config.headers || {}).forEach(([k, v]) => {
                if (v !== undefined && v !== null) xhr.setRequestHeader(k, v);
            });

            // Response type
            if (config.responseType) xhr.responseType = config.responseType;

            // Timeout
            if (config.timeout > 0) xhr.timeout = config.timeout;

            // Credentials
            if (config.credentials === 'include') xhr.withCredentials = true;

            // Events
            xhr.onload = async () => {
                const response = new XHRResponse(xhr);

                try {
                    let processed = response;
                    for (const hook of this.hook.response) {
                        const r = await hook.onFulfilled(processed);
                        if (r) processed = r;
                    }

                    if (xhr.status >= 400) {
                        const error = new XHRError(xhr);
                        for (const errInterceptor of this.hook.responseError) {
                            const r = await errInterceptor(error, config);
                            if (r) return resolve(r);
                        }
                        reject(error);
                    } else {
                        resolve(processed);
                    }
                } catch (err) {
                    reject(err);
                }
            };

            xhr.onerror = async () => {
                const error = new XHRError(xhr, 'Erro de rede');
                try {
                    for (const errInterceptor of this.hook.responseError) {
                        await errInterceptor(error, config);
                    }
                } catch (err) {
                    return reject(err);
                }
                reject(error);
            };

            xhr.ontimeout = () => reject(new XHRError(xhr, 'Request timeout'));

            // Body auto-detect
            let bodyToSend = config.body;
            if (bodyToSend) {
                if (
                    typeof bodyToSend === 'object' &&
                    !(bodyToSend instanceof FormData) &&
                    !(bodyToSend instanceof URLSearchParams) &&
                    !(bodyToSend instanceof Blob) &&
                    !(bodyToSend instanceof ArrayBuffer) &&
                    !ArrayBuffer.isView(bodyToSend)
                ) {
                    const contentType = Object.keys(config.headers).find(
                        k => k.toLowerCase() === 'content-type'
                    );

                    bodyToSend = JSON.stringify(bodyToSend);
                    if (!contentType)
                        xhr.setRequestHeader(
                            'Content-Type',
                            'application/json'
                        );
                }
            }

            xhr.send(bodyToSend);
        });
    }

    // ===== Convenience Methods =====
    get(path, options = {}) {
        return this.request(path, { ...options, method: 'GET' });
    }
    post(path, body = null, options = {}) {
        return this.request(path, { ...options, method: 'POST', body });
    }
    put(path, body = null, options = {}) {
        return this.request(path, { ...options, method: 'PUT', body });
    }
    patch(path, body = null, options = {}) {
        return this.request(path, { ...options, method: 'PATCH', body });
    }
    delete(path, options = {}) {
        return this.request(path, { ...options, method: 'DELETE' });
    }
    head(path, options = {}) {
        return this.request(path, { ...options, method: 'HEAD' });
    }
}