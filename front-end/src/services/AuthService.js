import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const apiAuthenticated = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const setAuthToken = (token) => {
    if (token) {
        apiAuthenticated.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('jwtToken', token);
    } else {
        delete apiAuthenticated.defaults.headers.common['Authorization'];
        localStorage.removeItem('jwtToken');
    }
};

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
        
        const token = response.data.token || response.data.accessToken; 
        
        // ⭐️ Usa a nova função para definir o header e salvar
        setAuthToken(token); 

        return response.data;
    } catch (error) {
        // ...
    }
}

export const logout = () => {
    localStorage.removeItem('jwtToken');
};

export default api;