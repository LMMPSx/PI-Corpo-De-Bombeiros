// components/UltimasOcorrencias/UltimasOcorrencias.jsx
import React from 'react';
import './UltimasOcorrencias.css';

function UltimasOcorrencias({ ocorrencias }) {
    
    // Função para formatar a data
    const formatarData = (dataString) => {
        if (!dataString) return 'Data N/A';
        const data = new Date(dataString);
        if (isNaN(data.getTime())) return 'Data Inválida';
        
        return data.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Função para definir a cor do status
    const getStatusColor = (status) => {
        switch (status) {
            case 'Resolvida': return 'success';
            case 'Em_Andamento': return 'warning';
            case 'Pendente': return 'danger';
            case 'Aberta': return 'info';
            default: return 'secondary';
        }
    };

    // Função para definir o ícone pelo tipo (Natureza)
    const getTipoIcone = (natureza) => {
        const lowerNatureza = natureza ? natureza.toLowerCase() : '';
        
        if (lowerNatureza.includes('urgente')) return 'bi-exclamation-triangle-fill';
        if (lowerNatureza.includes('rotina')) return 'bi-calendar-check';
        if (lowerNatureza.includes('preventiva')) return 'bi-shield-check';
        
        // Mapeamento original (ajustar para seu contexto se necessário)
        switch (lowerNatureza) {
            case 'infraestrutura': return 'bi-tools';
            case 'iluminacao': return 'bi-lightbulb';
            default: return 'bi-geo-alt'; // Ícone padrão
        }
    };

    return (
        <div className="ultimas-ocorrencias">
            {ocorrencias.length === 0 ? (
                <div className="sem-ocorrencias">
                    <i className="bi bi-inbox"></i>
                    <p>Nenhuma ocorrência registrada</p>
                </div>
            ) : (
                <div className="ocorrencias-list">
                    {ocorrencias.map(ocorrencia => (
                        <div key={ocorrencia.id} className="ocorrencia-item">
                            <div className="ocorrencia-icon">
                                <i className={`bi ${getTipoIcone(ocorrencia.natureza)}`}></i>
                            </div>
                            
                            <div className="ocorrencia-info">
                                {/* Usa Natureza ou parte da Descrição como título */}
                                <h4>{ocorrencia.natureza || (ocorrencia.descricao ? ocorrencia.descricao.substring(0, 20) + '...' : 'Ocorrência N/A')}</h4>
                                <p className="ocorrencia-endereco">
                                    <i className="bi bi-geo-alt"></i>
                                    {ocorrencia.localizacao || 'Localização não informada'}
                                </p>
                                <p className="ocorrencia-descricao">{ocorrencia.descricao}</p>
                                <div className="ocorrencia-meta">
                                    <span className="ocorrencia-data">
                                        <i className="bi bi-clock"></i>
                                        {formatarData(ocorrencia.data)}
                                    </span>
                                </div>
                            </div>

                            <div className="ocorrencia-status">
                                <span className={`status-badge ${getStatusColor(ocorrencia.status)}`}>
                                    {ocorrencia.status ? ocorrencia.status.replace('_', ' ') : 'N/A'}
                                </span>
                                <span className={`prioridade-badge ${ocorrencia.prioridade ? ocorrencia.prioridade.toLowerCase() : 'N/A'}`}>
                                    {ocorrencia.prioridade || 'N/A'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default UltimasOcorrencias;