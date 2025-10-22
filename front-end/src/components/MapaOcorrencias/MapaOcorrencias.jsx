// components/MapaOcorrencias/MapaOcorrencias.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapaOcorrencias.css';

// Corrigir ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Ícones customizados para diferentes prioridades
const criarIcone = (prioridade) => {
  const cor = getCorPrioridade(prioridade);
  
  return L.divIcon({
    html: `
      <div class="custom-marker" style="background-color: ${cor}">
        <div class="marker-pulse"></div>
        <div class="marker-inner">
          ${prioridade === 'critica' ? '⚠️' : '📍'}
        </div>
      </div>
    `,
    className: 'custom-div-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });
};

const getCorPrioridade = (prioridade) => {
  const lowerPrioridade = prioridade ? prioridade.toLowerCase() : '';

  switch (prioridade) {
    case 'Crítica': return '#dc3545';
    case 'Alta': return '#fd7e14';
    case 'Média': return '#ffc107';
    case 'Baixa': return '#198754';
    default: return '#6c757d';
  }
};

// Componente para ajustar o viewport do mapa
function AjustarMapa({ ocorrencias }) {
  const map = useMap();
  
React.useEffect(() => {
    if (ocorrencias.length > 0) {
        const validMarkers = ocorrencias
            // ⭐️ Filtre novamente aqui para máxima segurança
            .filter(o => o.latitude && o.longitude) 
            .map(ocorrencia => 
                L.marker([ocorrencia.latitude, ocorrencia.longitude])
            );
        
        // Verifica se há marcadores válidos antes de criar o grupo
        if (validMarkers.length > 0) {
            const group = new L.FeatureGroup(validMarkers);
            map.fitBounds(group.getBounds().pad(0.1));
        } else {
            // Se não houver marcadores válidos, volte para a posição padrão
            map.setView([-8.0476, -34.8770], 10);
        }
    } else {
        map.setView([-8.0476, -34.8770], 10);
    }
}, [ocorrencias, map]);

  return null;
}

function MapaOcorrencias({ ocorrencias }) {
  // Coordenadas de Recife, Pernambuco
  const posicaoPadrao = [-8.0476, -34.8770];

const formatarData = (dataString) => {
    if (!dataString) return 'Data não informada';

    // ⭐️ Trunca a string de data para garantir compatibilidade
    const truncatedString = dataString.split('.')[0]; 
    
    const data = new Date(truncatedString);
    
    // Se a data ainda for inválida, retorne uma mensagem de erro
    if (isNaN(data)) {
        return 'Erro de Data';
    }

    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
};
  const getStatusText = (status) => {
    if (!status) {
        return 'N/A';
    }

    const statusMap = {
      'Aberta': 'Aberta',
      'Pendente': 'Pendente',
      'Em_Andamento': 'Em Andamento',
      'Resolvida': 'Resolvida'
    
    };
    // ⚠️ ATENÇÃO: Se os ENUMs do Spring forem "Aberta", "Em_Andamento", etc., 
    // você precisará ajustar o status aqui ou na função de mapeamento do service.
    // Vamos assumir que você está enviando os valores padronizados e minúsculos.
    return statusMap[status.toLowerCase()] || status;
  };

  const prioridades = [
    { nivel: 'Crítica', label: 'Crítica' },
    { nivel: 'Alta', label: 'Alta' },
    { nivel: 'Média', label: 'Média' },
    { nivel: 'Baixa', label: 'Baixa' }
  ];

  const bairros = [
    { value: "boa-viagem", label: "Boa Viagem" },
    { value: "boa-vista", label: "Boa Vista" },
    { value: "casa-forte", label: "Casa Forte" },
    { value: "olinda", label: "Olinda" },
    { value: "jaboatao", label: "Jaboatão" },
  ];

  return (
    <div className="mapa-ocorrencias-real">
      <MapContainer
        center={posicaoPadrao}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <AjustarMapa ocorrencias={ocorrencias} />
        
        {ocorrencias.map((ocorrencia) => (
          <Marker
            key={ocorrencia.id}
            position={[ocorrencia.latitude, ocorrencia.longitude]}
            icon={criarIcone(ocorrencia.prioridade)}
          >
            <Popup>
              <div className="popup-ocorrencia">
                <h3>{ocorrencia.titulo}</h3>
                <p><strong>Endereço:</strong> {ocorrencia.endereco}</p>
                <p><strong>Descrição:</strong> {ocorrencia.descricao}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-popup ${ocorrencia.status}`}>
                    {getStatusText(ocorrencia.status)}
                  </span>
                </p>
                <p><strong>Prioridade:</strong> 
                  <span className={`prioridade-popup ${ocorrencia.prioridade}`}>
                    {ocorrencia.prioridade}
                  </span>
                </p>
                <p><strong>Data:</strong> {formatarData(ocorrencia.data)}</p>
                <p><strong>Tipo:</strong> {ocorrencia.tipo}</p>
                <div className="popup-actions">
                  <button className="btn-popup btn-detalhes">
                    <i className="bi bi-info-circle"></i>
                    Ver Detalhes
                  </button>
                  <button className="btn-popup btn-atualizar">
                    <i className="bi bi-arrow-clockwise"></i>
                    Atualizar
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legenda do mapa */}
      <div className="mapa-legenda-real">
        <h4>🗺️ Pernambuco - Prioridades</h4>
        <div className="legenda-content">
          {prioridades.map((p) => (
            <div className="legenda-item" key={p.nivel}> 
              <div className={`legenda-marker ${p.nivel}`}></div>
              <span>{p.label}</span>
              <span className="legenda-count">
                ({ocorrencias.filter(o => o.prioridade === p.nivel).length})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contador de ocorrências */}
      <div className="mapa-stats">
        <div className="stats-badge">
          <i className="bi bi-pin-map"></i>
          {ocorrencias.length} ocorrências em PE
        </div>
      </div>

      {/* Filtro rápido por bairro */}
<div className="mapa-filtros">
        <select className="filtro-bairro">
          <option value="">Todos os bairros</option>
          {bairros.map(b => (
            <option key={b.value} value={b.value}>{b.label}</option> 
          ))}
        </select>
      </div>
    </div>
  );
}

export default MapaOcorrencias;