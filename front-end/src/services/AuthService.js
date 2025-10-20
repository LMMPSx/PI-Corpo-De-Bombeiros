import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

/**
 * Envia as credenciais para o endpoint de login do Spring Boot.
 * @param {string} username - O email ou CPF do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<Object>} - Os dados da resposta (incluindo o token).
 */

export const login = async (username, password) => {
    const LOGIN_URL = "/auth/login";

    try {
        const response = await api.post(LOGIN_URL, {
            cpf: username,
            senha: password
        });

        return response.data;
    } catch (error) {
        console.error("Erro ao fazer login:", error);
        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem('jwtToken');
};

// Se você tiver outras requisições protegidas, este interceptor será útil:
api.interceptors.request.use(config => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default api;