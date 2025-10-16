import React from 'react';
import './Sobre.css';

export default function Sobre() {
  return (
    <div className="sobre-content">
      <div className="sobre-container">
        <div className="sobre-section">
          <h2>Sobre</h2>
          <p>Bem-vindo ao Painel de Coleta e Gestão de Ocorrências do Corpo de Bombeiros Militar de Pernambuco (CBMPE). Este sistema foi desenvolvido para facilitar o registro, acompanhamento e gestão de ocorrências atendidas pelo CBMPE, proporcionando uma interface intuitiva e eficiente para os usuários.</p>
        </div>

        <div className="divider"></div>

        <div className="sobre-section">
          <h2>Versão do aplicativo</h2>
          <h3>Versão 10.0</h3>
        </div>

        <div className="sobre-section">
          <h2>Funcionalidades Principais</h2>
          <ul>
            <li><strong>Registro de Ocorrências:</strong> Permite o cadastro rápido e eficiente de novas ocorrências.</li>
            <li><strong>Acompanhamento em Tempo Real:</strong> Visualize o status das ocorrências em andamento.</li>
            <li><strong>Relatórios Detalhados:</strong> Gere relatórios em PDF para análise e documentação.</li>
            <li><strong>Gestão de Usuários:</strong> Controle o acesso ao sistema com diferentes níveis de permissão.</li>
          </ul>
        </div>

        <div className="sobre-section">
          <h2>Tecnologias Utilizadas</h2>
          <ul>
            <li><strong>Frontend:</strong> React.js para uma interface de usuário responsiva e interativa.</li>
            <li><strong>Backend:</strong> Java com Spring Boot para gerenciamento de APIs e lógica de negócios.</li>
            <li><strong>Banco de Dados:</strong> MySQL para armazenamento eficiente e escalável dos dados.</li>
            <li><strong>Autenticação:</strong> Implementação de login seguro para proteger o acesso ao sistema.</li>
          </ul>
        </div>

        <div className="divider"></div>

        <div className="sobre-section">
        </div>
      </div>
    </div>
  );
}

