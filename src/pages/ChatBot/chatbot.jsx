import React from "react";
import "./chatbot.css";
import LogoCBMPE from "./assets/logo.png";
import IconeHome from "./assets/Home.png";
import IconeOcorrencias from "./assets/ocorrencia.png";
import IconeRelatorios from "./assets/relatorio.png";
import IconeUsuarios from "./assets/usuario.png";

export default function chatbot() {
  return (
    <div className="container">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={LogoCBMPE} alt="Logo" className="logo" />
        <ul className="menu">
          <li>
            <img src={IconeHome} alt="Início" />
            <span>Início</span>
          </li>
          <li>
            <img src={IconeOcorrencias} alt="Ocorrências" />
            <span>Ocorrências</span>
          </li>
          <li>
            <img src={IconeRelatorios} alt="Relatórios" />
            <span>Relatórios</span>
          </li>
          <li>
            <img src={IconeUsuarios} alt="Usuários" />
            <span>Usuários</span>
          </li>
        </ul>
      </aside>

      {/* Conteúdo principal */}
      <main className="main">
        <header className="topbar">
          <h1>Painel de coleta e gestão de ocorrências - CBMPE</h1>
          <div className="menu-icon">
            <span className="hamburger">☰</span>
            <span className="menu-label">Menu</span>
          </div>
        </header>

        <section className="content">
          <h2>Assistente virtual</h2>

          <div className="chatbox">
            <div className="message">
              <div className="avatar">👤</div>
              <div className="bubble">Como posso ajudar?</div>
            </div>

            <div className="message user">
              <div className="bubble user-bubble">
                Gostaria de registrar uma ocorrência.
              </div>
              <div className="avatar user-avatar">⚪</div>
            </div>

            <div className="message">
              <div className="avatar">👤</div>
              <div className="bubble">Certo! Qual o tipo da ocorrência?</div>
            </div>

            <div className="options">
              <button className="btn red">Incêndio</button>
              <button className="btn yellow">Resgate</button>
              <button className="btn blue">Treinamento</button>
            </div>

            <div className="input-box">
              <input type="text" placeholder="Digite aqui..." />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}