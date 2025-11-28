// src/pages/DashboardPython/DashboardPython.jsx

import React from 'react';
import './DashboardPython.css';

const DashboardPython = () => {
  return (
    <div className="dashboard-python">
      <div className="dashboard-python-header">
        <h1>🚨 Dashboard Analítico - Corpo de Bombeiros</h1>
        <p>Visualização avançada de dados e estatísticas</p>
      </div>

      <div className="dashboard-python-content">
        <div className="iframe-container">
          <iframe
            src="http://localhost:8050"  // URL do seu dashboard Python
            title="Dashboard Python"
            width="100%"
            height="800px"
            frameBorder="0"
            scrolling="yes"
          />
        </div>
        
        <div className="dashboard-info">
          <div className="info-card">
            <h3>📊 Sobre este Dashboard</h3>
            <p>Este dashboard exibe análises avançadas e visualizações de dados 
            das ocorrências do Corpo de Bombeiros, desenvolvido em Python com Dash.</p>
            <ul>
              <li>✅ Estatísticas em tempo real</li>
              <li>✅ Gráficos interativos</li>
              <li>✅ Análise geográfica</li>
              <li>✅ Tendências temporais</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>🔧 Requisitos</h3>
            <p>Para visualizar o dashboard, certifique-se de que:</p>
            <ul>
              <li>O servidor Python está rodando na porta 8050</li>
              <li>As dependências estão instaladas</li>
              <li>A conexão com o banco está configurada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPython;