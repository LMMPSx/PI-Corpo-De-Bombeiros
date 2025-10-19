import React, { useState } from 'react';
import './Ocorrencias.css';

const Ocorrencias = () => {
  const [mockOcorrencias] = useState([
    { prioridade: 'Alta', tipo: 'Incêndio', periodo: '30/08/2025 - 12:50', regiao: 'Olinda', status: 'Em aberto' },
    { prioridade: 'Média', tipo: 'Resgate animal em risco', periodo: '30/08/2025 - 13:00', regiao: 'Olinda', status: 'Em aberto' },
    { prioridade: 'Baixa', tipo: 'Treinamento', periodo: '30/08/2025 - 15:00', regiao: 'Olinda', status: 'Em aberto' },
    ...Array(8).fill({ prioridade: '', tipo: '', periodo: '', regiao: '', status: '' })
  ]);

  return (
    <div className="ocorrencias-container">
      <div className="page-header">
        <h2>Ocorrências</h2>
        <button className="btn-registrar">Registrar nova ocorrência</button>
      </div>

      <div className="prioridade-cards">
        <div className="card-prioridade alta"><span>3</span><p>Alta</p></div>
        <div className="card-prioridade media"><span>2</span><p>Média</p></div>
        <div className="card-prioridade baixa"><span>3</span><p>Baixa</p></div>
      </div>

      <div className="filtros-container">
        <div className="filtros-header">
          <i className="fa-solid fa-filter"></i>
          <span>Filtrar por:</span>
        </div>
        <div className="filtros-inputs">
          <select><option>Prioridade</option></select>
          <select><option>Tipo</option></select>
          <select><option>Período</option></select>
          <select><option>Região</option></select>
          <select><option>Status</option></select>
          <div className="search-wrapper">
            <i className="fa-solid fa-search"></i>
            <input type="text" placeholder="Pesquisar ocorrência" />
          </div>
          <button className="btn-aplicar">Aplicar</button>
        </div>
      </div>

      <div className="tabela-wrapper">
        <div className="tabela-header">
          <h3>Ocorrências</h3>
        </div>
        <div className="tabela-container">
          <table>
            <thead>
              <tr>
                <th>Prioridade</th>
                <th>Tipo</th>
                <th>Período</th>
                <th>Região</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOcorrencias.map((item, index) => (
                <tr key={index}>
                  <td>{item.prioridade}</td>
                  <td>{item.tipo}</td>
                  <td>{item.periodo}</td>
                  <td>{item.regiao}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ocorrencias;