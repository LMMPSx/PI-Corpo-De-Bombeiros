// components/UltimasOcorrencias/UltimasOcorrencias.jsx
import React from 'react';
import './UltimasOcorrencias.css';

function UltimasOcorrencias({ ocorrencias }) {
  const formatarData = (dataString) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const lowerStatus = status ? status.toLowerCase() : '';
    switch (status) {
      case 'Resolvida': return 'success';
      case 'Em_Andamento': return 'warning';
      case 'Pendente': return 'danger';
      default: return 'secondary';
    }
  };

  const getTipoIcone = (tipo) => {
    const lowerTipo = tipo ? tipo.toLowerCase() : '';
    switch (tipo) {
      case 'infraestrutura': return 'bi-tools';
      case 'iluminacao': return 'bi-lightbulb';
      case 'limpeza': return 'bi-trash';
      case 'meio_ambiente': return 'bi-tree';
      default: return 'bi-geo-alt';
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
                <i className={getTipoIcone(ocorrencia.tipo)}></i>
              </div>
              
              <div className="ocorrencia-info">
                <h4>{ocorrencia.titulo}</h4>
                <p className="ocorrencia-endereco">
                  <i className="bi bi-geo-alt"></i>
                  {ocorrencia.endereco}
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
                <span className={`prioridade-badge ${ocorrencia.prioridade}`}>
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