import axios from 'axios';
import { apiAuthenticated } from './AuthService';

const OCORRENCIA_BASE_URL = '/ocorrencias';
const FULL_API_BASE_URL = 'https://pi-corpo-de-bombeiros-production-c7b5.up.railway.app';

/**
 * Mapeia o objeto vindo do Java (Backend) para o formato usado no React.
 * Baseado nas tabelas: 'ocorrencia' e 'endereco'.
 */
const mapJavaToReact = (javaOcorrencia) => {
    if (!javaOcorrencia) return null;

    // Tenta obter dados de endereço do objeto aninhado 'endereco' (padrão JPA)
    // ou verifica se vieram na raiz (caso seja um DTO personalizado)
    const lat = javaOcorrencia.endereco?.latitude || javaOcorrencia.latitude;
    const lng = javaOcorrencia.endereco?.longitude || javaOcorrencia.longitude;
    const endCompleto = javaOcorrencia.endereco 
        ? `${javaOcorrencia.endereco.rua}, ${javaOcorrencia.endereco.numero} - ${javaOcorrencia.endereco.bairro}, ${javaOcorrencia.endereco.cidade}`
        : javaOcorrencia.localizacao;

    return {
        id: javaOcorrencia.idOcorrencia,                // PK: ID_Ocorrencia
        natureza: javaOcorrencia.naturezaOcorrencia,    // Enum: Urgente, Rotina, Preventiva
        solicitante: javaOcorrencia.nomeSolicitante,    // Coluna: Nome_Solicitante
        data: javaOcorrencia.dataOcorrencia,            // Coluna: Data_Ocorrencia
        descricao: javaOcorrencia.descricao,            // Coluna: Descricao
        prioridade: javaOcorrencia.prioridadeOcorrencia,// Enum: Baixa, Média, Alta, Crítica
        status: javaOcorrencia.statusOcorrencia,        // Enum: Aberta, Em_Andamento, Pendente, Resolvida
        anexo: javaOcorrencia.anexoOcorrencia,          // Coluna: Anexo_Ocorrencia
        assinatura: javaOcorrencia.assinaturaOcorrencia,// Coluna: Assinatura_Ocorrencia
        // Dados de Endereço (Tabela Endereco)
        localizacao: endCompleto,
        latitude: lat,
        longitude: lng,
        enderecoObj: javaOcorrencia.endereco // Mantém o objeto original caso precise de CEP/Cidade isolados
    };
};

export const fetchOcorrencias = async () => {
    try {
        const response = await apiAuthenticated.get(`${OCORRENCIA_BASE_URL}/all`);
        return response.data.map(mapJavaToReact);
    } catch (error) {
        console.error("Erro ao buscar ocorrências:", error.response || error);
        throw error;
    }
};

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
 * Cria uma nova ocorrência.
 * Nota: O Backend deve tratar o recebimento de 'latitude', 'longitude' e dados de endereço
 * para popular a tabela 'endereco' e vincular o ID_Endereco na 'ocorrencia'.
 */
export const createOcorrencia = async (ocorrenciaData, anexoFiles = [], assinaturaDataUrl = '') => {
    const formPayload = new FormData();

    const enderecoRequest = {
        cep: ocorrenciaData.endereco?.cep || "",
        estado: ocorrenciaData.endereco?.estado || "",
        cidade: ocorrenciaData.endereco?.cidade || "",
        bairro: ocorrenciaData.endereco?.bairro || "",
        rua: ocorrenciaData.endereco?.rua || "",
        numero: ocorrenciaData.endereco?.numero || "",
        complemento: ocorrenciaData.endereco?.complemento || "",
        latitude: ocorrenciaData.latitude ? parseFloat(ocorrenciaData.latitude) : null,
        longitude: ocorrenciaData.longitude ? parseFloat(ocorrenciaData.longitude) : null
    };

    const ocorrenciaRequest = {
        naturezaOcorrencia: ocorrenciaData.natureza,
        nomeSolicitante: ocorrenciaData.responsavel,
        descricao: ocorrenciaData.descricao,
        prioridadeOcorrencia: ocorrenciaData.prioridade,
        statusOcorrencia: "Aberta", 
        assinaturaOcorrencia: "assinatura_pendente",
        anexoOcorrencia: "anexo_pendente",
        endereco: enderecoRequest
    };

    const jsonString = JSON.stringify(ocorrenciaRequest);
    const ocorrenciaBlob = new Blob([jsonString], { type: 'application/json' });
    formPayload.append('ocorrencia', ocorrenciaBlob);

    if (anexoFiles && anexoFiles.length > 0) {
        const anexoFile = anexoFiles[0];
        if (anexoFile instanceof File) {
            formPayload.append('anexo', anexoFile, anexoFile.name);
        }
    }

    if (assinaturaDataUrl && assinaturaDataUrl.startsWith('data:image')) {
        try {
            const response = await fetch(assinaturaDataUrl);
            const blob = await response.blob();
            const assinaturaFile = new File([blob], 'assinatura.png', { type: 'image/png' });
            formPayload.append('assinatura', assinaturaFile, 'assinatura.png');
        } catch (err) {
            console.error("Erro blob assinatura", err);
        }
    }

    try {
        const response = await apiAuthenticated.post(
            `${OCORRENCIA_BASE_URL}/create`,
            formPayload,
            { headers: { 'Content-Type': undefined } }
        );
        return response.data;
    } catch (error) {
        console.error("Erro create:", error);
        throw error;
    }
};

export const updateOcorrencia = async (id, ocorrenciaData, anexoFile, assinaturaFile) => {
    const formPayload = new FormData();

    const ocorrenciaJson = JSON.stringify({
        naturezaOcorrencia: ocorrenciaData.natureza,
        nomeSolicitante: ocorrenciaData.solicitante,
        descricao: ocorrenciaData.descricao,
        localizacao: ocorrenciaData.localizacao,
        latitude: ocorrenciaData.latitude,
        longitude: ocorrenciaData.longitude,
        prioridadeOcorrencia: ocorrenciaData.prioridade,
        statusOcorrencia: ocorrenciaData.status,
        // Mantém string se não houver arquivo novo
        ...(typeof ocorrenciaData.anexo === 'string' && !anexoFile && { anexoOcorrencia: ocorrenciaData.anexo }),
        ...(typeof ocorrenciaData.assinatura === 'string' && !assinaturaFile && { assinaturaOcorrencia: ocorrenciaData.assinatura })
    });

    formPayload.append('ocorrencia', new Blob([ocorrenciaJson], { type: 'application/json' }));

    if (anexoFile instanceof File) {
        formPayload.append('anexo', anexoFile, anexoFile.name);
    }
    if (assinaturaFile instanceof File) {
        formPayload.append('assinatura', assinaturaFile, assinaturaFile.name);
    }

    // Correção: Usando apiAuthenticated para garantir o token correto no PUT
    try {
        const response = await apiAuthenticated.put(
            `${OCORRENCIA_BASE_URL}/update/${id}`,
            formPayload,
            { headers: { 'Content-Type': undefined } }
        );
        return mapJavaToReact(response.data);
    } catch (error) {
        console.error("Erro ao atualizar ocorrência:", error.response?.data || error);
        throw error;
    }
};

export const deleteOcorrencia = async (id) => {
    try {
        await apiAuthenticated.delete(`${OCORRENCIA_BASE_URL}/delete/${id}`);
    } catch (error) {
        console.error(`Erro ao deletar ocorrência ${id}:`, error.response || error);
        throw error;
    }
};