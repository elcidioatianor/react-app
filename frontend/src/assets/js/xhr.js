class XHRError extends Error { 
	constructor(xhr) {
		super(xhr.status === 0 ? "Network Error: Unable To Connect": xhr.statusText);
		this.code = xhr.status;
		this.xhr = xhr;
	}
}

class XHRRes {
    constructor(xhr) {//doesn't return promise, it populates
        //text(), json(), stream(), buffer(), formdata, headers, xml, 
		this.xhr = xhr;
		this.headers = xhr.getAllResponseHeaders()
            	.split(/\n\n|\r\n\r\n/)
                .map(entry => entry.split(': '))
				.reduce((acc, curr)=>{
					acc[curr[0]] = curr[1];
					return acc
				},{})
                
        this.status = xhr.status;
        this.statusText = xhr.statusText;
		this.data = xhr.response
            //more: cookies, url, json(), text(), xml, body(): Body,
    }
    
}


//url deve ser location, send() ira receber body & path
export class XHR {
    constructor(options = {}) {//async, username, password
		if (typeof options== 'string') {
			options = {
				url: options 
			}
		}

        this.options = {
            url: location.href,
            method: 'GET',
			body: null,
            async: true,
            username: null,
            password: null,
            //body: null,
            headers: [//[], Headers, {}
                ['X-Requested-With', 'XMLHttpRequest']
            ],
            params: null,//new URLSearchParams(), //body
            range: null,//[], //[[0,9], [20,50]] (headers)
            responseType: '',
            timeout: 0,
            ...options
        }
        
        //this.xhr = xhr;
    }

    #send(path, options) {
        //if options is a valid XMLHttpRequestBodyInit or undefined or null, use as body; if a plain object, use as options extender
        return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
		
		options = {
			...this.options,
			...options
		};

		let url = new URL(path, options.url);
		console.log(url)
		if (options.params) {
			let params = new URLSearchParams(options.params);
			url.searchParams = params; //TODO
		}

        xhr.open(options.method, options.url + path, options.async, options.user, options.password);
        for (let [key, value] of options.headers) {
            xhr.setRequestHeader(key, value)
        }
        xhr.responseType = options.responseType;
        xhr.timeout = options.timeout;
        xhr.onload = () => {
            let response = new XHRRes(xhr);
            resolve(response)
        }
        xhr.onerror = () => {
			let error = new XHRError(xhr);
			reject(error)
        }
        
		let body = options.body;

		if ((typeof body != 'string') && (!(body instanceof ArrayBuffer) && !(body instanceof FormData) && !ArrayBuffer.isView(body) && !(body instanceof Blob))) {
			body = JSON.stringify(body)
			xhr.setRequestHeader('Content-Type', 'application/json')
		}

        //xhr.send();
        xhr.send(body);
        });
    }
    
    //aliases
    get(path, options = {}) {
		if (typeof path === 'object') {
			options = path;
			path = '';
		}

		options.method = "GET";
		options.body = null;

		return this.#send(path, options)
	}

    post(path, options = {}) {
		if (typeof path === 'object') {
			options = path;
			path = '';
		}

		options.method = "POST";

		return this.#send(path, options)
	}

    put(path, options = {}) {
		if (typeof path === 'object') {
			options = path;
			path = '';
		}

		options.method = "PUT";

		return this.#send(path, options)
	}

    head(path, options = {}) {
		if (typeof path === 'object') {
			options = path;
			path = '';
		}

		options.method = "HEAD";
		options.body = null;

		return this.#send(path, options)
	}
}
