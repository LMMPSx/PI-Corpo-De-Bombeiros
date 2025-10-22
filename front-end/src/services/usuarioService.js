import { apiAuthenticated } from "./AuthService";
import { logout } from "./AuthService"; 
import axios from 'axios'; 

const USUARIO_BASE_URL = "/usuario";
const USUARIOS_ALL_URL = `${USUARIO_BASE_URL}/all`; 
const FULL_API_BASE_URL = 'https://pi-corpo-de-bombeiros-production.up.railway.app'; // URL completa do Backend

/**
 * Mapeia um objeto UsuarioResponse (Java DTO) para o formato esperado pelo React.
 * @param {object} javaUsuario - O objeto UsuarioResponse retornado pelo Spring Boot.
 * @returns {object} O objeto de usuário formatado para o frontend.
 */
const mapJavaToReact = (javaUsuario) => {
    if (!javaUsuario) return null;

    return {
        // Mapeamento baseado no UsuarioResponse.java e no UsuarioCard.js
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

/**
 * Busca a lista de todos os usuários do backend. (Usa apiAuthenticated)
 */
export const fetchUsuarios = async () => {
    try {
        const response = await apiAuthenticated.get(USUARIOS_ALL_URL); 
        return response.data.map(mapJavaToReact);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error.response || error);
        throw error;
    }
};

/**
 * Busca um usuário específico pelo seu CPF. (Usa apiAuthenticated)
 * ATENÇÃO: Seu componente usa o parâmetro 'email' na rota, mas a API busca por CPF. 
 * Vou manter a lógica da API buscando por CPF, mas você pode precisar ajustar o componente.
 * @param {string} userCpf - O CPF do usuário.
 */
export const fetchUsuarioByCpf = async (userCpf) => {
    try {
        const response = await apiAuthenticated.get(`${USUARIO_BASE_URL}/cpf/${userCpf}`); 
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error(`Erro ao buscar usuário ${userCpf}:`, error.response || error);
        throw error;
    }
};

/**
 * Exclui um usuário do backend. (Usa apiAuthenticated)
 */
export const deleteUsuario = async (userCpf) => {
    try {
        await apiAuthenticated.delete(`${USUARIO_BASE_URL}/delete/${userCpf}`);
    } catch (error) {
        console.error(`Erro ao excluir usuário ${userCpf}:`, error.response || error);
        throw error;
    }
};

/**
 * Cria um novo usuário no backend, incluindo o envio de arquivo (foto).
 * @param {object} userData - Dados do usuário (nome, cpf, email, tipoUsuario, senha)
 * @param {File} userPhoto - O objeto File da foto (se existir)
 * @returns {Promise<object>} Uma promessa que resolve com o objeto do usuário criado.
 */
export const createUsuario = async (userData, userPhoto) => {
    
    const formPayload = new FormData();
    
    // 1. ANEXAR O JSON PRIMEIRO (Chave: 'usuario')
    const usuarioJson = JSON.stringify({
        nomeUsuario: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        tipoUsuario: userData.perfil, // Mapeado de volta para 'perfil' do React
        senha: userData.senha,
    });
    
    const usuarioBlob = new Blob([usuarioJson], { type: 'application/json' });
    formPayload.append('usuario', usuarioBlob);

    // 2. ANEXAR A FOTO EM SEGUNDO (Chave: 'foto')
    if (userPhoto && userPhoto instanceof File) {
        formPayload.append('foto', userPhoto, userPhoto.name); 
    }

    // Pega o token de autenticação (AJUSTE CONFORME SEU MÉTODO DE ARMAZENAMENTO)
    const token = localStorage.getItem('jwtToken');
    console.log('Token Encontrado:', token ? 'Sim' : 'Não'); // Adicione este log!
    if (!token) {
        // Adicione aqui uma lógica para redirecionar para o login ou lançar um erro explícito de autenticação.
        throw new Error("Token de autenticação não encontrado. Usuário não logado.");
    }
    const authorizationHeader = `Bearer ${token}`;
    const finalUrl = `${FULL_API_BASE_URL}${USUARIO_BASE_URL}/create`;

    

    try {
        const response = await axios.post( 
            finalUrl, 
            formPayload,
            {
                headers: {
                    'Content-Type': undefined, 
                    'Authorization': authorizationHeader, 
                },
            }
        );
        
        return mapJavaToReact(response.data); 
    } catch (error) {
        console.error("ERRO AO CADASTRAR USUÁRIO NO FRONTEND:");
        console.error("  -> Status HTTP:", error.response?.status);
        console.error("  -> Mensagem do Servidor (Corpo):", error.response?.data);
        console.error("  -> Objeto de Erro Completo:", error);
        
        throw error;
    }

    
};


/**
 * 🆕 ATUALIZA UM USUÁRIO EXISTENTE (PATCH)
 * Esta função utiliza multipart/form-data para enviar o JSON do usuário e, opcionalmente, a nova foto.
 * @param {string} originalCpf - O CPF original para identificar o usuário na rota.
 * @param {object} userData - Dados do usuário atualizados (nome, cpf, email, perfil, [senha])
 * @param {File|null} userPhoto - O novo objeto File da foto (se existir) ou null.
 * @returns {Promise<object>} Uma promessa que resolve com o objeto do usuário atualizado.
 */
export const updateUsuario = async (originalCpf, userData, userPhoto) => {
    
    const formPayload = new FormData();
    
    // 1. ANEXAR O JSON (Chave: 'usuario')
    const usuarioJson = JSON.stringify({
        nomeUsuario: userData.nome,
        cpf: userData.cpf,
        email: userData.email,
        tipoUsuario: userData.perfil, // Mapeado de volta para 'perfil' do React

        // A senha só é incluída se tiver sido preenchida no formulário (não vazia)
        ...(userData.senha && { senha: userData.senha }), 
        
        // Se a foto atual era uma URL (string), reenvie-a para que o backend saiba que ela deve ser mantida,
        // a menos que um novo arquivo (File) esteja sendo enviado.
        ...(typeof userData.foto === 'string' && !userPhoto && { caminhoFoto: userData.foto }),
    });
    
    const usuarioBlob = new Blob([usuarioJson], { type: 'application/json' });
    // Chave 'usuario' corresponde ao @RequestPart("usuario") do Java
    formPayload.append('usuario', usuarioBlob);

    // 2. ANEXAR A NOVA FOTO (Chave: 'foto')
    if (userPhoto && userPhoto instanceof File) {
        // Chave 'foto' corresponde ao @RequestPart(value = "foto") do Java
        formPayload.append('foto', userPhoto, userPhoto.name); 
    }

    // Pega o token de autenticação e URL
    const token = localStorage.getItem('jwtToken'); 
    const authorizationHeader = token ? `Bearer ${token}` : '';
    // Assumindo endpoint de PATCH/PUT que usa o CPF original na rota
    const finalUrl = `${FULL_API_BASE_URL}${USUARIO_BASE_URL}/update/${originalCpf}`; 

    try {
        // Usamos o axios diretamente para controlar o header Content-Type e Authorization manualmente
        const response = await axios.patch( // PATCH para atualização parcial
            finalUrl, 
            formPayload,
            {
                headers: {
                    // Não defina Content-Type, o FormData o fará corretamente (multipart/form-data com boundary)
                    'Content-Type': undefined, 
                    'Authorization': authorizationHeader, 
                },
            }
        );
        
        return mapJavaToReact(response.data); 
    } catch (error) {
        console.error("ERRO AO ATUALIZAR USUÁRIO NO FRONTEND:");
        console.error("  -> Status HTTP:", error.response?.status);
        console.error("  -> Mensagem do Servidor (Corpo):", error.response?.data);
        
        throw error;
    }
};