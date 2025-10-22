import React from 'react';
import './Menu.css';

// Imports corretos das imagens
import Logo from './assets/logo.png';
import IconeHome from './assets/Home.png';
import IconeOcorrencias from './assets/ocorrencia.png';
import IconeRelatorios from './assets/relatorio.png';
import IconeUsuarios from './assets/usuario.png';

import IconeConfig from './assets/engrenagem.png';
import IconeAssistente from './assets/assistente.png';
import IconeAuditoria from './assets/assistentepessoal.png';
import IconeSobre from './assets/sobre.png';
import IconeEditar from './assets/editar.png';
import AvatarUser from './assets/icone.png'; 
import IconeMenu from './assets/menu.png'; // botão de menu

// Ícones da sidebar
const SidebarIcon = ({ src, alt }) => {
  return <img src={src} alt={alt} className="icon-sidebar-image" />;
};

const DashboardMenu = () => {
  return (
    <div className="dashboard-layout">
      {/* -------------------- Sidebar -------------------- */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={Logo} alt="Logo CBMPE" className="cbmpe-logo" />
        </div>

        <nav className="nav-menu">
          <a href="#" className="nav-item active">
            <SidebarIcon src={IconeHome} alt="Início" />
            <span>Início</span>
          </a>
          <a href="#" className="nav-item">
            <SidebarIcon src={IconeOcorrencias} alt="Ocorrências" />
            <span>Ocorrências</span>
          </a>
          <a href="#" className="nav-item">
            <SidebarIcon src={IconeRelatorios} alt="Relatórios" />
            <span>Relatórios</span>
          </a>
          <a href="#" className="nav-item">
            <SidebarIcon src={IconeUsuarios} alt="Usuários" />
            <span>Usuários</span>
          </a>
        </nav>
      </div>

      {/* -------------------- Conteúdo Principal -------------------- */}
      <div className="main-content">
        <header className="top-header">
          <div className="header-title">
            Painel de coleta e gestão de ocorrências - CBMPE
          </div>
          <button className="menu-btn">
            <img src={IconeMenu} alt="Menu" className="menu-icon"/>
            <span>Menu</span>
          </button>
        </header>

        <div className="menu-container">
          <h2>Menu</h2>

          {/* Card de Perfil */}
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                <img src={AvatarUser} alt="Avatar usuário" />
              </div>
              <div className="profile-details">
                <p className="profile-text"><strong>Nome:</strong> João Silva</p>
                <p className="profile-text"><strong>CPF:</strong> 000.000.000-00</p>
                <p className="profile-text"><strong>Cargo:</strong> Bombeiro Militar</p>
              </div>
            </div>
            <button className="edit-btn">
              <img src={IconeEditar} alt="Editar" />
            </button>
          </div>

          {/* Opções do Menu */}
          <div className="option-list">
            <button className="menu-option">
              <img src={IconeConfig} alt="Configurações" />
              Configurações
            </button>
            <button className="menu-option">
              <img src={IconeAssistente} alt="Assistente" />
              Assistente virtual
            </button>
            <button className="menu-option">
              <img src={IconeAuditoria} alt="Auditoria" />
              Auditoria & Logs
            </button>
            <button className="menu-option">
              <img src={IconeSobre} alt="Sobre" />
              Sobre
            </button>
          </div>

          <button className="logout-btn">
            Sair
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMenu;