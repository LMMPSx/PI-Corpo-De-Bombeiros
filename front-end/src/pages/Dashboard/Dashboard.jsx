// pages/Dashboard/Dashboard.jsx (atualizado)
import React, { useState, useEffect } from 'react';
import { useConfig } from '../../Contexts/ConfigContext';
import MapaOcorrencias from '../../components/MapaOcorrencias/MapaOcorrencias';
import EstatisticasRapidas from '../../components/EstatisticasRapidas/EstatisticasRapidas';
import UltimasOcorrencias from '../../components/UltimasOcorrencias/UltimasOcorrencias';
import { fetchOcorrencias } from '../../services/ocorrenciaService';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const { config } = useConfig();
  const [ocorrencias, setOcorrencias] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    total: 0,
    emAndamento: 0,
    resolvidas: 0,
    criticas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);

    try {
      const dadosOcorrencias = await fetchOcorrencias();

      setOcorrencias(dadosOcorrencias);

      const total = dadosOcorrencias.length;

      const emAndamento = dadosOcorrencias.filter(o => o.status === 'Em_Andamento').length;
      const resolvidas = dadosOcorrencias.filter(o => o.status === 'Resolvida').length;
      const criticas = dadosOcorrencias.filter(o => o.prioridade === 'Crítica').length;

      setEstatisticas({ total, emAndamento, resolvidas, criticas });

    } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);

    } finally {
        setLoading(false);

    }
  };

  const handleNovaOcorrencia = () => {
    navigate('/nova-ocorrencia');;
  };

  const handleGerarRelatorio = () => {
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'relatorio-ocorrencias.pdf';
    link.click();
    alert('Relatório PDF gerado com sucesso!');
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Carregando dados do dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard overflow-container">
      <header className="dashboard-header">
        <h1 className="force-break">Painel de coleta e gestão de ocorrências - SiSBMPE</h1>
        <div className="dashboard-actions">
          <button 
            className="btn btn-primary"
            onClick={handleNovaOcorrencia}
          >
            <i className="bi bi-plus-circle"></i>
            Nova ocorrência
          </button>
          <button 
            className="btn btn-secondary"
            onClick={handleGerarRelatorio}
          >
            <i className="bi bi-file-earmark-pdf"></i>
            Gerar relatório (PDF)
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <EstatisticasRapidas estatisticas={estatisticas} />

        <div className="dashboard-main">
          <section className="mapa-section">
            <div className="section-header">
              <h2>Mapa de Ocorrências</h2>
              <div className="map-search">
                <input 
                  type="text" 
                  placeholder="Pesquisar endereço"
                  className="search-input"
                />
                <button className="search-btn">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
            <div className="mapa-container">
              <MapaOcorrencias ocorrencias={ocorrencias} />
            </div>
          </section>

          <section className="ocorrencias-section">
            <div className="section-header">
              <h2>Últimas Ocorrências</h2>
              <a href="/ocorrencias" className="ver-todas">
                Ver todas
              </a>
            </div>
            <UltimasOcorrencias ocorrencias={ocorrencias.slice(0, 5)} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;