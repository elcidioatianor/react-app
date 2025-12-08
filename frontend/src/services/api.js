/***
 * 1 - Criar serviço de API (AXIOS + TOKEN)
 *
 */

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000'   // tua API backend
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
export default api