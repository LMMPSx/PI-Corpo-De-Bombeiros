import axios from 'axios';

const API_BASE_URL = "https://pi-corpo-de-bombeiros-production.up.railway.app"

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

export const setAuthToken = (token, nomeUsuario, tipoUsuario) => {
    if (token) {
        apiAuthenticated.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('nomeUsuario', nomeUsuario);
        localStorage.setItem('tipoUsuario', tipoUsuario);
    } else {
        delete apiAuthenticated.defaults.headers.common['Authorization'];
        localStorage.removeItem('jwtToken');
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('nomeUsuario');
        localStorage.removeItem('tipoUsuario');
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

        const nomeUsuario = response.data.nomeUsuario;
        const tipoUsuario = response.data.tipoUsuario;
        
        setAuthToken(token, nomeUsuario, tipoUsuario);

        return response.data;
    } catch (error) {
        // ...
    }
}

export const logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('nomeUsuario');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('isAuthenticated');
};

export default api;