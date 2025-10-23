import { apiAuthenticated } from "./AuthService";
import axios from 'axios'; 

const FULL_API_BASE_URL = 'https://pi-corpo-de-bombeiros-production.up.railway.app';
const USUARIO_BASE_URL = `${FULL_API_BASE_URL}/usuario`;
const USUARIOS_ALL_URL = `${USUARIO_BASE_URL}/all`; 

const mapJavaToReact = (javaUsuario) => {
    if (!javaUsuario) return null;

    return {
        id: javaUsuario.id,
        nome: javaUsuario.nomeUsuario,
        email: javaUsuario.email,
        cpf: javaUsuario.cpf,
        perfil: javaUsuario.tipoUsuario,
        foto: javaUsuario.caminhoFoto,
        dataCriacao: javaUsuario.dataCriacao,
        ultimoLogin: javaUsuario.ultimoLogin,
    };
};

export const fetchUsuarios = async () => {
    try {
        const response = await apiAuthenticated.get(USUARIOS_ALL_URL); 
        return response.data.map(mapJavaToReact);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error.response || error);
        throw error;
    }
};

export const fetchUsuarioByCpf = async (userCpf) => {
    try {
        const response = await apiAuthenticated.get(`${USUARIO_BASE_URL}/cpf/${userCpf}`); 
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error(`Erro ao buscar usuário ${userCpf}:`, error.response || error);
        throw error;
    }
};

export const deleteUsuario = async (userCpf) => {
    try {
        await apiAuthenticated.delete(`${USUARIO_BASE_URL}/delete/${userCpf}`);
    } catch (error) {
        console.error(`Erro ao excluir usuário ${userCpf}:`, error.response || error);
        throw error;
    }
};

export const createUsuario = async (userData, userPhoto) => {
    const formPayload = new FormData();
    
    const usuarioJson = JSON.stringify({
        nomeUsuario: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        tipoUsuario: userData.perfil,
        senha: userData.senha,
    });
    
    const usuarioBlob = new Blob([usuarioJson], { type: 'application/json' });
    formPayload.append('usuario', usuarioBlob);

    if (userPhoto && userPhoto instanceof File) {
        formPayload.append('foto', userPhoto, userPhoto.name); 
    }

    try {
        const response = await apiAuthenticated.post( 
            `/usuario/create`, 
            formPayload,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        
        return mapJavaToReact(response.data); 
    } catch (error) {
        console.error("ERRO AO CADASTRAR USUÁRIO NO FRONTEND:");
        console.error("  -> Status HTTP:", error.response?.status);
        console.error("  -> Mensagem do Servidor:", error.response?.data);
        console.error("  -> URL:", error.config?.url);
        
        throw error;
    }
};

export const updateUsuario = async (originalCpf, userData, userPhoto) => {
    const formPayload = new FormData();
    
    const usuarioJson = JSON.stringify({
        nomeUsuario: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        tipoUsuario: userData.perfil,
        ...(userData.senha && { senha: userData.senha }),
        ...(typeof userData.foto === 'string' && !userPhoto && { caminhoFoto: userData.foto }),
    });
    
    const usuarioBlob = new Blob([usuarioJson], { type: 'application/json' });
    formPayload.append('usuario', usuarioBlob);

    if (userPhoto && userPhoto instanceof File) {
        formPayload.append('foto', userPhoto, userPhoto.name); 
    }

    try {
        const response = await apiAuthenticated.patch(
            `/usuario/update/${originalCpf}`, 
            formPayload,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            }
        );
        
        return mapJavaToReact(response.data); 
    } catch (error) {
        console.error("ERRO AO ATUALIZAR USUÁRIO NO FRONTEND:");
        console.error("  -> Status HTTP:", error.response?.status);
        console.error("  -> Mensagem do Servidor:", error.response?.data);
        
        throw error;
    }
};