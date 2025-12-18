/***
 * 1 - Criar serviço de API (AXIOS + TOKEN)
 *
 */
import {XHR} from '../assets/js/xhr'
import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3001'   // tua API backend
})

// inserir token automaticamente em cada requisição
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token')

    if (token) {
        config.headers.Authorization = token
    }
    return config
})

//2 - Criar context de autenticação > ../context/authContext.js
//export default api
let token = localStorage.getItem('token')
let headers = new Headers();

if (token) {
	headers.set('Authorization', token)
}

const xhr = new XHR({
	url: 'http://localhost:3001',
	headers,
	responseType: 'json'
})

export {
	xhr
}