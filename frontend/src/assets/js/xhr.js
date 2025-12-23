// xhr.js - Versão otimizada para autenticação
//TODO: MAIS TARDE USAR FETCH PURO

class XHRError extends Error {
    constructor(xhr, message = null) {
        super(message || xhr.statusText || "Network Error");
        this.name = "XHRError";
        this.status = xhr.status;
        this.statusText = xhr.statusText;
        this.xhr = xhr;
		
		//let res = new XHRResponse(xhr);
		//let headers = res.headers();
		
		switch (xhr.status) {
			
		}
		
        this.response = xhr.response;
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
                const [key, ...valueParts] = line.split(": ");
                const value = valueParts.join(": ");
                headers[key.toLowerCase()] = value;
            }
        }
        return headers;
    }

    json() {
        try {
            return JSON.parse(this.xhr.responseText);
        } catch {
            throw new Error("Response is not valid JSON");
        }
    }

    text() {
        return this.xhr.responseText;
    }

    blob() {
        return this.xhr.response;
    }
}

/***
 * OPÇÕES PADRAO
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
*/

export class XHR {
    constructor(baseURL = "", options = {}) {
        this.baseURL = baseURL;
        this.defaultOptions = {
            method: "GET",
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                Accept: "application/json",
            },
            credentials: "include", //'same-origin'
            responseType: "",
            timeout: 0,
            ...options,
        };

        // Sistema de interceptors
        this.interceptors = {
            request: new Set(),
            response: new Set(),
            responseError: new Set(),
        };
    }

    // INTERCEPTORS
    //TRANSFORMAÇÃO DA REQUISIÇÃO
    useRequestInterceptor(onFulfilled, onRejected = null) {
        this.interceptors.request.add({ onFulfilled, onRejected });
    }

    //PROCESSAR RESPOSTA
    useResponseInterceptor(onFulfilled, onRejected = null) {
        this.interceptors.response.add({ onFulfilled, onRejected });
    }

    //LOG DE ERROS
    useResponseErrorInterceptor(onRejected) {
        this.interceptors.responseError.add(onRejected);
    }

    // REMOÇÃO DE INTERCEPTORS
    clearInterceptors() {
        this.interceptors.request.clear();
        this.interceptors.response.clear();
        this.interceptors.responseError();
    }

    // CORE REQUEST
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

        // Apply query params
        if (requestOptions.params) {
            Object.entries(requestOptions.params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    url.searchParams.set(key, value);
                }
            });
        }

        // Prepare request config
        let config = {
            method: requestOptions.method.toUpperCase(),
            url: url.toString(),
            headers: requestOptions.headers,
            body: requestOptions.body,
            credentials: requestOptions.credentials,
            responseType: requestOptions.responseType,
            timeout: requestOptions.timeout,
        };

        // ========== REQUEST INTERCEPTORS ==========
        for (const interceptor of this.interceptors.request) {
            try {
                const result = await interceptor.onFulfilled(config);
                if (result) config = result;
            } catch (error) {
                if (interceptor.onRejected) {
                    interceptor.onRejected(error);
                }
                throw error;
            }
        }

        // Execute request
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open(config.method, config.url, true);

            // Set headers
            Object.entries(config.headers || {}).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    xhr.setRequestHeader(key, value);
                }
            });

            // Set response type
            if (config.responseType) {
                xhr.responseType = config.responseType;
            }

            // Set timeout
            if (config.timeout > 0) {
                xhr.timeout = config.timeout;
            }

            // Set credentials
            if (config.credentials === "include") {
                xhr.withCredentials = true;
            }

            // Event handlers
            xhr.onload = async () => {
                const response = new XHRResponse(xhr);

                try {
                    // ========== RESPONSE INTERCEPTORS ==========
                    let processedResponse = response;
                    for (const interceptor of this.interceptors.response) {
                        const result =
                            await interceptor.onFulfilled(processedResponse);
                        if (result) processedResponse = result;
                    }

                    // Check for error status
                    if (xhr.status >= 400) {
                        const error = new XHRError(xhr);

                        // ========== RESPONSE ERROR INTERCEPTORS ==========
                        for (const errorInterceptor of this.interceptors.responseError) {
                            await errorInterceptor(error, config);
                        }

                        reject(error);
                    } else {
                        resolve(processedResponse);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            xhr.onerror = async () => {
                const error = new XHRError(xhr, "Network error occurred");
				try {
                	// Error interceptors
                	for (const errorInterceptor of this.interceptors.responseError) {
                    	await errorInterceptor(error, config);
                	}
				} catch(err) {
					return reject(err)
				}
                reject(error);
            };

            xhr.ontimeout = () => {
                const error = new XHRError(xhr, "Request timeout");
                reject(error);
            };

            // Prepare and send body
            let bodyToSend = config.body;
            if (bodyToSend) {
                // Auto-detect body type
                if (
                    typeof bodyToSend === "object" &&
                    !(bodyToSend instanceof FormData) &&
                    !(bodyToSend instanceof URLSearchParams) &&
                    !(bodyToSend instanceof Blob) &&
                    !(bodyToSend instanceof ArrayBuffer) &&
                    !ArrayBuffer.isView(bodyToSend)
                ) {
                    // JSON
                    bodyToSend = JSON.stringify(bodyToSend);
                    if (!config.headers["Content-Type"]) {
                        xhr.setRequestHeader(
                            "Content-Type",
                            "application/json",
                        );
                    }
                }
            }

            xhr.send(bodyToSend);
        });
    }

    // CONVENIENCE METHODS
    get(path, options = {}) {
        return this.request(path, { ...options, method: "GET" });
    }

    post(path, body = null, options = {}) {
        return this.request(path, { ...options, method: "POST", body });
    }

    put(path, body = null, options = {}) {
        return this.request(path, { ...options, method: "PUT", body });
    }

    patch(path, body = null, options = {}) {
        return this.request(path, { ...options, method: "PATCH", body });
    }

    delete(path, options = {}) {
        return this.request(path, { ...options, method: "DELETE" });
    }

    head(path, options = {}) {
        return this.request(path, { ...options, method: "HEAD" });
    }
}
