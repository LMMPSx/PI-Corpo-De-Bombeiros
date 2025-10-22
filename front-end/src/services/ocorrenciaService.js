import axios from 'axios';
import { apiAuthenticated } from './AuthService'; // Certifique-se de que este import está correto

const OCORRENCIA_BASE_URL = '/ocorrencias';
const FULL_API_BASE_URL = 'http://localhost:8080'; // Ajuste conforme seu backend

/**
 * Mapeia o OcorrenciaResponse do Java para o formato esperado no frontend
 */
const mapJavaToReact = (javaOcorrencia) => {
    if (!javaOcorrencia) return null;

    return {
        id: javaOcorrencia.idOcorrencia,
        natureza: javaOcorrencia.naturezaOcorrencia,
        solicitante: javaOcorrencia.nomeSolicitante,
        data: javaOcorrencia.dataOcorrencia,
        descricao: javaOcorrencia.descricao,
        localizacao: javaOcorrencia.localizacao,
        latitude: javaOcorrencia.latitude,
        longitude: javaOcorrencia.longitude,
        prioridade: javaOcorrencia.prioridadeOcorrencia,
        anexo: javaOcorrencia.anexoOcorrencia,
        status: javaOcorrencia.statusOcorrencia,
        assinatura: javaOcorrencia.assinaturaOcorrencia
    };
};

/**
 * Busca todas as ocorrências
 */
export const fetchOcorrencias = async () => {
    try {
        const response = await apiAuthenticated.get(`${OCORRENCIA_BASE_URL}/all`);
        return response.data.map(mapJavaToReact);
    } catch (error) {
        console.error("Erro ao buscar ocorrências:", error.response || error);
        throw error;
    }
};

/**
 * Busca uma ocorrência por ID
 */
export const fetchOcorrenciaById = async (id) => {
    try {
        const response = await apiAuthenticated.get(`${OCORRENCIA_BASE_URL}/id/${id}`);
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error(`Erro ao buscar ocorrência ${id}:`, error.response || error);
        throw error;
    }
};

/**
 * Cria uma nova ocorrência (JSON + 1 anexo + assinatura)
 * * @param {Object} ocorrenciaData Dados da ocorrência (natureza, responsavel, etc.)
 * @param {File[]} anexoFiles Array de arquivos (usaremos o primeiro como o 'anexo')
 * @param {string} assinaturaDataUrl Data URL da assinatura digital (base64)
 */
export const createOcorrencia = async (ocorrenciaData, anexoFiles = [], assinaturaDataUrl = '') => {
    const formPayload = new FormData();

    // 1️⃣ Adiciona os dados da ocorrência (JSON) como Blob
    const ocorrenciaJson = JSON.stringify({
        naturezaOcorrencia: ocorrenciaData.natureza,
        nomeSolicitante: ocorrenciaData.responsavel, // Mapeia 'responsavel' do React para 'nomeSolicitante' do Java
        dataOcorrencia: ocorrenciaData.data, // Adicionado para enviar a data do formulário
        descricao: ocorrenciaData.descricao,
        localizacao: ocorrenciaData.localizacao,
        prioridadeOcorrencia: ocorrenciaData.prioridade,
        statusOcorrencia: ocorrenciaData.status,
        latitude: ocorrenciaData.latitude,
        longitude: ocorrenciaData.longitude,
        titulo: ocorrenciaData.titulo || "Ocorrência sem título"// Adiciona o título
    });
    const ocorrenciaBlob = new Blob([ocorrenciaJson], { type: 'application/json' });
    // O nome 'ocorrencia' deve coincidir com o @RequestPart("ocorrencia") do Controller
    formPayload.append('ocorrencia', ocorrenciaBlob);

    // 2️⃣ Adiciona o arquivo de Anexo (Backend espera 'anexo' singular)
    const anexoFile = anexoFiles[0];
    if (anexoFile instanceof File) {
        // O nome 'anexo' deve coincidir com o @RequestPart(value = "anexo") do Controller
        formPayload.append('anexo', anexoFile, anexoFile.name);
    }

    // 3️⃣ Adiciona a assinatura digital (convertida de base64 para File)
    if (assinaturaDataUrl) {
        const response = await fetch(assinaturaDataUrl);
        const blob = await response.blob();
        // Cria um File com nome 'assinatura.png'
        const assinaturaFile = new File([blob], 'assinatura.png', { type: 'image/png' });

        // O nome 'assinatura' deve coincidir com o @RequestPart(value = "assinatura") do Controller
        formPayload.append('assinatura', assinaturaFile, assinaturaFile.name);
    }

    try {
        // Usa a instância 'apiAuthenticated' que já deve lidar com o Token
        const response = await apiAuthenticated.post(
            `${OCORRENCIA_BASE_URL}/create`,
            formPayload,
            {
                // 'Content-Type': undefined deixa o navegador setar o 'multipart/form-data' e o 'boundary'
                headers: { 'Content-Type': undefined } 
            }
        );
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error("Erro ao criar ocorrência:", error.response?.data || error);
        throw error;
    }
};

/**
 * Atualiza uma ocorrência existente (JSON + arquivos)
 */
export const updateOcorrencia = async (id, ocorrenciaData, anexoFile, assinaturaFile) => {
    const formPayload = new FormData();

    // 1️⃣ Adiciona os dados da ocorrência (JSON) como Blob
    const ocorrenciaJson = JSON.stringify({
        naturezaOcorrencia: ocorrenciaData.natureza,
        nomeSolicitante: ocorrenciaData.solicitante,
        descricao: ocorrenciaData.descricao,
        localizacao: ocorrenciaData.localizacao,
        latitude: ocorrenciaData.latitude,
        longitude: ocorrenciaData.longitude,
        prioridadeOcorrencia: ocorrenciaData.prioridade,
        statusOcorrencia: ocorrenciaData.status,
        // Mantém os arquivos existentes se não houver substituição
        ...(typeof ocorrenciaData.anexo === 'string' && !anexoFile && { anexoOcorrencia: ocorrenciaData.anexo }),
        ...(typeof ocorrenciaData.assinatura === 'string' && !assinaturaFile && { assinaturaOcorrencia: ocorrenciaData.assinatura })
    });

    formPayload.append('ocorrencia', new Blob([ocorrenciaJson], { type: 'application/json' }));

    // 2️⃣ Adiciona o novo anexo (se existir)
    if (anexoFile instanceof File) {
        formPayload.append('anexo', anexoFile, anexoFile.name); // Nome 'anexo'
    }
    // 3️⃣ Adiciona a nova assinatura (se existir)
    if (assinaturaFile instanceof File) {
        formPayload.append('assinatura', assinaturaFile, assinaturaFile.name); // Nome 'assinatura'
    }

    // Nota: Aqui você está usando axios.put diretamente. Se você tem apiAuthenticated,
    // o ideal seria usar apiAuthenticated.put. Mantenho a sua lógica original para 
    // evitar introduzir bugs de autenticação, mas a duplicação de lógica é um risco.
    const token = localStorage.getItem('jwtToken');
    const authorizationHeader = token ? `Bearer ${token}` : '';

    try {
        const response = await axios.put(
            `${FULL_API_BASE_URL}${OCORRENCIA_BASE_URL}/update/${id}`,
            formPayload,
            {
                headers: {
                    'Content-Type': undefined, // Permite que o navegador defina o boundary
                    'Authorization': authorizationHeader
                }
            }
        );
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error("Erro ao atualizar ocorrência:", error.response?.data || error);
        throw error;
    }
};

/**
 * Deleta uma ocorrência pelo ID
 */
export const deleteOcorrencia = async (id) => {
    try {
        await apiAuthenticated.delete(`${OCORRENCIA_BASE_URL}/delete/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar ocorrência ${id}:`, error.response || error);
        throw error;
    }
};