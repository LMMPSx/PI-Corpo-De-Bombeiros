import React from "react";
import "./editarperfil.css";

// Ícones do menu lateral (PNG)
import HomeIcon from "./assets/home.png";
import ReportIcon from "./assets/report.png";
import ChartIcon from "./assets/chart.png";
import UserIcon from "./assets/user.png";
import Logo from "./assets/logo.png";

export default function EditarPerfil() {
  return (
    <div className="app">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={Logo} alt="Logo" className="logo" />
        <nav className="menu">
          <button className="menu-btn">
            <img src={HomeIcon} alt="Início" /> Início
          </button>
          <button className="menu-btn">
            <img src={ReportIcon} alt="Ocorrências" /> Ocorrências
          </button>
          <button className="menu-btn">
            <img src={ChartIcon} alt="Relatórios" /> Relatórios
          </button>
          <button className="menu-btn">
            <img src={UserIcon} alt="Usuários" /> Usuários
          </button>
        </nav>
      </aside>

      {/* Área principal */}
      <div className="main">
        {/* Topbar */}
        <header className="topbar">
          Painel de coleta e gestão de ocorrências - SisBMPE
        </header>

        {/* Conteúdo */}
        <div className="content">
          <h2 className="titulo">Editar perfil</h2>

          <div className="form-container">
            <form className="form">
              <input type="text" placeholder="Nome" />
              <input type="text" placeholder="CPF*" />
              <input type="text" placeholder="Cargo" />
              <input type="email" placeholder="E-mail" />

              <div className="foto-area">
                <div className="foto-placeholder">Adicionar foto</div>
              </div>

              <div className="botoes">
                <button className="btn cancelar">Cancelar</button>
                <button className="btn salvar">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
