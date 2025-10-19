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
  switch (prioridade) {
    case 'critica': return '#dc3545';
    case 'alta': return '#fd7e14';
    case 'media': return '#ffc107';
    case 'baixa': return '#198754';
    default: return '#6c757d';
  }
};

// Componente para ajustar o viewport do mapa
function AjustarMapa({ ocorrencias }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (ocorrencias.length > 0) {
      const group = new L.FeatureGroup(
        ocorrencias.map(ocorrencia => 
          L.marker([ocorrencia.latitude, ocorrencia.longitude])
        )
      );
      map.fitBounds(group.getBounds().pad(0.1));
    } else {
      // Foco em Pernambuco (Recife e região metropolitana)
      map.setView([-8.0476, -34.8770], 10);
    }
  }, [ocorrencias, map]);

  return null;
}

function MapaOcorrencias({ ocorrencias }) {
  // Coordenadas de Recife, Pernambuco
  const posicaoPadrao = [-8.0476, -34.8770];
  
  // Ocorrências reais em Pernambuco
  const ocorrenciasPernambuco = ocorrencias.length > 0 ? ocorrencias : [
    {
      id: 1,
      titulo: "Alagamento - Boa Viagem",
      endereco: "Av. Boa Viagem, 1500 - Boa Viagem, Recife",
      latitude: -8.1196,
      longitude: -34.9030,
      tipo: "infraestrutura",
      status: "em_andamento",
      prioridade: "alta",
      data: "2024-01-15T14:30:00",
      descricao: "Alagamento após chuva forte, trânsito interrompido"
    },
    {
      id: 2,
      titulo: "Buraco na PE-15 - Olinda",
      endereco: "PE-15, Km 5 - Olinda",
      latitude: -8.0081,
      longitude: -34.8550,
      tipo: "infraestrutura",
      status: "pendente",
      prioridade: "media",
      data: "2024-01-14T09:20:00",
      descricao: "Buraco na pista sentido Recife-Olinda"
    },
    {
      id: 3,
      titulo: "Iluminação Pública - Casa Forte",
      endereco: "Rua Real da Torre, 400 - Casa Forte, Recife",
      latitude: -8.0425,
      longitude: -34.9168,
      tipo: "iluminacao",
      status: "resolvido",
      prioridade: "baixa",
      data: "2024-01-13T18:45:00",
      descricao: "Lâmpada queimada no poste da praça"
    },
    {
      id: 4,
      titulo: "Coleta de Lixo Atrasada - Boa Vista",
      endereco: "Rua da Concórdia, 250 - Boa Vista, Recife",
      latitude: -8.0615,
      longitude: -34.8853,
      tipo: "limpeza",
      status: "em_andamento",
      prioridade: "alta",
      data: "2024-01-15T08:15:00",
      descricao: "Lixo acumulado há 4 dias no centro"
    },
    {
      id: 5,
      titulo: "Risco de Desabamento - Santo Amaro",
      endereco: "Rua do Apolo, 200 - Santo Amaro, Recife",
      latitude: -8.0639,
      longitude: -34.8723,
      tipo: "estrutural",
      status: "pendente",
      prioridade: "critica",
      data: "2024-01-12T16:30:00",
      descricao: "Prédio histórico com rachaduras aparentes"
    },
    {
      id: 6,
      titulo: "Semáforo Queimado - Caxangá",
      endereco: "Av. Caxangá, 3500 - Caxangá, Recife",
      latitude: -8.0528,
      longitude: -34.9506,
      tipo: "transito",
      status: "pendente",
      prioridade: "alta",
      data: "2024-01-15T07:00:00",
      descricao: "Semáforo não funciona no cruzamento movimentado"
    },
    {
      id: 7,
      titulo: "Esgoto a Céu Aberto - Afogados",
      endereco: "Rua dos Afogados, 500 - Afogados, Recife",
      latitude: -8.0750,
      longitude: -34.9125,
      tipo: "sanitario",
      status: "em_andamento",
      prioridade: "critica",
      data: "2024-01-14T10:00:00",
      descricao: "Vazamento de esgoto há 1 semana"
    },
    {
      id: 8,
      titulo: "Árvore Caída - Graças",
      endereco: "Rua das Graças, 150 - Graças, Recife",
      latitude: -8.0542,
      longitude: -34.8986,
      tipo: "meio_ambiente",
      status: "resolvido",
      prioridade: "media",
      data: "2024-01-11T22:15:00",
      descricao: "Árvore caída durante temporal, já removida"
    },
    {
      id: 9,
      titulo: "Fiação Elétrica Solta - São José",
      endereco: "Rua da Imperatriz, 300 - São José, Recife",
      latitude: -8.0631,
      longitude: -34.8739,
      tipo: "eletrica",
      status: "pendente",
      prioridade: "critica",
      data: "2024-01-15T12:00:00",
      descricao: "Fiação da Celpe solta e com risco de curto"
    },
    {
      id: 10,
      titulo: "Ponte com Estrutura Comprometida - Jaboatão",
      endereco: "PE-15, Ponte sobre Rio Jaboatão - Jaboatão dos Guararapes",
      latitude: -8.1128,
      longitude: -34.9367,
      tipo: "estrutural",
      status: "em_andamento",
      prioridade: "critica",
      data: "2024-01-13T15:45:00",
      descricao: "Estrutura da ponte apresenta fissuras"
    },
    {
      id: 11,
      titulo: "Praça com Manutenção Necessária - Pina",
      endereco: "Praça do Pina - Pina, Recife",
      latitude: -8.0869,
      longitude: -34.8886,
      tipo: "urbanismo",
      status: "pendente",
      prioridade: "baixa",
      data: "2024-01-14T11:30:00",
      descricao: "Bancos e equipamentos da praça danificados"
    },
    {
      id: 12,
      titulo: "Sinalização de Trânsito Apagada - Derby",
      endereco: "Rua do Derby, 200 - Derby, Recife",
      latitude: -8.0622,
      longitude: -34.8981,
      tipo: "transito",
      status: "resolvido",
      prioridade: "media",
      data: "2024-01-12T14:20:00",
      descricao: "Placa de pare danificada, já substituída"
    }
  ];

  const formatarData = (dataString) => {
    return new Date(dataString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento',
      'resolvido': 'Resolvido'
    };
    return statusMap[status] || status;
  };

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
        
        <AjustarMapa ocorrencias={ocorrenciasPernambuco} />
        
        {ocorrenciasPernambuco.map((ocorrencia) => (
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
          <div className="legenda-item">
            <div className="legenda-marker critica"></div>
            <span>Crítica</span>
            <span className="legenda-count">
              ({ocorrenciasPernambuco.filter(o => o.prioridade === 'critica').length})
            </span>
          </div>
          <div className="legenda-item">
            <div className="legenda-marker alta"></div>
            <span>Alta</span>
            <span className="legenda-count">
              ({ocorrenciasPernambuco.filter(o => o.prioridade === 'alta').length})
            </span>
          </div>
          <div className="legenda-item">
            <div className="legenda-marker media"></div>
            <span>Média</span>
            <span className="legenda-count">
              ({ocorrenciasPernambuco.filter(o => o.prioridade === 'media').length})
            </span>
          </div>
          <div className="legenda-item">
            <div className="legenda-marker baixa"></div>
            <span>Baixa</span>
            <span className="legenda-count">
              ({ocorrenciasPernambuco.filter(o => o.prioridade === 'baixa').length})
            </span>
          </div>
        </div>
      </div>

      {/* Contador de ocorrências */}
      <div className="mapa-stats">
        <div className="stats-badge">
          <i className="bi bi-pin-map"></i>
          {ocorrenciasPernambuco.length} ocorrências em PE
        </div>
      </div>

      {/* Filtro rápido por bairro */}
      <div className="mapa-filtros">
        <select className="filtro-bairro">
          <option value="">Todos os bairros</option>
          <option value="boa-viagem">Boa Viagem</option>
          <option value="boa-vista">Boa Vista</option>
          <option value="casa-forte">Casa Forte</option>
          <option value="olinda">Olinda</option>
          <option value="jaboatao">Jaboatão</option>
        </select>
      </div>
    </div>
  );
}

export default MapaOcorrencias;