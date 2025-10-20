// components/EstatisticasRapidas/EstatisticasRapidas.jsx
import React from 'react';
import './EstatisticasRapidas.css';

function EstatisticasRapidas({ estatisticas }) {
  const cards = [
    {
      title: 'Total de Ocorrências',
      value: estatisticas.total,
      icon: 'bi-clipboard-data',
      color: 'primary',
      description: 'Ocorrências registradas'
    },
    {
      title: 'Em Andamento',
      value: estatisticas.emAndamento,
      icon: 'bi-clock',
      color: 'warning',
      description: 'Sendo atendidas'
    },
    {
      title: 'Resolvidas',
      value: estatisticas.resolvidas,
      icon: 'bi-check-circle',
      color: 'success',
      description: 'Concluídas esta semana'
    },
    {
      title: 'Críticas',
      value: estatisticas.criticas,
      icon: 'bi-exclamation-triangle',
      color: 'danger',
      description: 'Prioridade máxima'
    }
  ];

  return (
    <div className="estatisticas-rapidas">
      {cards.map((card, index) => (
        <div key={index} className={`estatistica-card ${card.color}`}>
          <div className="card-icon">
            <i className={card.icon}></i>
          </div>
          <div className="card-content">
            <h3>{card.value}</h3>
            <p className="card-title">{card.title}</p>
            <span className="card-description">{card.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EstatisticasRapidas;