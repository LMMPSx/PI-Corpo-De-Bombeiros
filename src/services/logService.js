// src/services/logService.js

// ⚠️ Ajuste o caminho de importação se necessário. Assumindo que api.js está no mesmo nível.
import { apiAuthenticated } from '../services/AuthService'; 

/**
 * Busca todos os logs de auditoria no servidor, mapeando o DTO (LogResponse)
 * para o formato esperado pelo Front-end.
 * @returns {Promise<Array>} Lista de objetos de log (DTOs) mapeados.
 */
export const buscarLogsAuditoria = async () => {
    // ENDPOINT AJUSTADO para o seu Back-end: /log/all
    const LOG_AUDITORIA_URL = '/log/all'; 
    try {
        const response = await apiAuthenticated.get(LOG_AUDITORIA_URL);
        
        // Mapeamento dos nomes do DTO (Back-end) para o Front-end
        const logsMapeados = response.data.map(log => {
            
            // Tratamento e Formatação da Data (necessário para exibição e filtro)
            // A API retorna "2025-10-21T13:09:34", que o JS entende no construtor Date.
            const dataHoraObj = new Date(log.dataAlteracao);
            
            // Formatação para 'DD/MM/YYYY HH:MM' para exibição na tabela
            const dataHoraFormatada = dataHoraObj.toLocaleDateString('pt-BR', {
                day: '2-digit', month: '2-digit', year: 'numeric', 
                hour: '2-digit', minute: '2-digit'
            });

            // Mapeamento da Ação (TipoAlteracao para Ação Realizada em Português)
            let acaoFormatada;
            switch (log.tipoAlteracao) {
                case 'CREATE': acaoFormatada = 'Criação'; break;
                case 'UPDATE': acaoFormatada = 'Alteração'; break;
                case 'DELETE': acaoFormatada = 'Exclusão'; break;
                default: acaoFormatada = log.tipoAlteracao;
            }

            return {
                id: log.idLog,
                // Armazena a data formatada para exibição
                dataHora: dataHoraFormatada, 
                // Armazena a data original (ISO) para uso nos filtros avançados
                dataHoraISO: log.dataAlteracao, 
                usuario: log.usuarioResponsavel,
                modulo: log.entidadeAlterada,
                acao: acaoFormatada,
                atributo: log.atributoAlterado,
                valorNovo: log.valorNovo || 'N/A',
                valorAntigo: log.valorAntigo || 'N/A',
            };
        });
        
        return logsMapeados;
    } catch (error) {
        // Lança o erro para que o componente React possa capturá-lo
        console.error("Erro ao buscar logs de auditoria:", error);
        throw error; 
    }
};