import { apiAuthenticated } from "./AuthService";

const OCORRENCIAS_URL = "/ocorrencias/all";

/**
 * Mapeia um objeto de OcorrenciaModel (Java) para o formato esperado pelo React.
 * @param {object} javaOcorrencia - O objeto retornado pelo Spring Boot.
 */
const mapJavaToReact = (javaOcorrencia) => {
    if (!javaOcorrencia) return null;

    return {
        // --- CHAVES MAPEADAS ---
        id: javaOcorrencia.idOcorrencia, // id para a key do React
        endereco: javaOcorrencia.localizacao, // Correção: 'localizacao' -> 'endereco'
        status: javaOcorrencia.statusOcorrencia, // Correção: 'statusOcorrencia' -> 'status'
        prioridade: javaOcorrencia.prioridadeOcorrencia, // Correção: 'prioridadeOcorrencia' -> 'prioridade'
        tipo: javaOcorrencia.naturezaOcorrencia, // Correção: 'naturezaOcorrencia' -> 'tipo'
        data: javaOcorrencia.dataOcorrencia, // Correção: 'dataOcorrencia' -> 'data'

        // --- CHAVES JÁ CORRETAS OU COM VALORES PADRÃO ---
        latitude: javaOcorrencia.latitude,
        longitude: javaOcorrencia.longitude,
        descricao: javaOcorrencia.descricao,
        titulo: javaOcorrencia.titulo || 'Ocorrência Sem Título', // Adicione um título padrão se não existir no back
    };
};

export const fetchOcorrencias = async () => {
    try {
        const response = await apiAuthenticated.get(OCORRENCIAS_URL);
        return response.data.map(mapJavaToReact);
    } catch (error) {
        console.error("Erro ao buscar ocorrências:", error);

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Possível token expirado ou inválido
            logout();
            window.location.href = "/login";
        }

        throw error;
    }
}