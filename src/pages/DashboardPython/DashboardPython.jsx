// src/pages/DashboardPython/DashboardPython.jsx

import React from 'react';
import './DashboardPython.css';

const DashboardPython = () => {
  return (
    <div className="dashboard-python">
      {/* <div className="dashboard-python-header">
        <h1>Dashboard Analítico - Corpo de Bombeiros</h1>
        <p>Visualização avançada de dados e estatísticas</p>
      </div> */}

      <div className="dashboard-python-content">
        <div className="iframe-container">
          <iframe
            src="https://dashboard-6ui8.onrender.com/"  // URL do seu dashboard Python
            title="Dashboard Python"
            width="100%"
            height="800px"
            frameBorder="0"
            scrolling="yes"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPython;