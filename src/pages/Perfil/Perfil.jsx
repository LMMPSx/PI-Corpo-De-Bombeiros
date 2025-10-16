// components/Perfil.jsx
import React from 'react';
import { useConfig } from '../contexts/ConfigContext';

function Perfil() {
  const { config } = useConfig();

  return (
    <div className="perfil-page">
      <h1>Meu Perfil</h1>
      
      <div className="preferencias-rapidas">
        <h2>Preferências Atuais</h2>
        <div className="preferencias-list">
          <div className="preferencia-item">
            <span>Tema: </span>
            <strong>{config.configGerais.tema}</strong>
          </div>
          <div className="preferencia-item">
            <span>Tamanho da fonte: </span>
            <strong>{config.acessibilidade.tamanhoFonte}</strong>
          </div>
          <div className="preferencia-item">
            <span>Alto contraste: </span>
            <strong>{config.acessibilidade.altoContraste ? 'Sim' : 'Não'}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Perfil;