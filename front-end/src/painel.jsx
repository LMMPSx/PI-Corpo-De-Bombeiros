import { useState } from "react";
import "./Painel.css";
import logo from "./assets/logo.png";

export default function Painel() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="dashboard-page">
        {/* Barra Lateral */}
        <div className="sidebar">
          <div className="sidebar-header">
            <img src={logo} alt="CBMPE Logo" className="sidebar-logo" />
            <h3>Painel de coleta e gestão de ocorrências - CBMPE</h3>
          </div>
          <ul className="sidebar-menu">
            <li className="menu-item active">
              <i className="fa-solid fa-home"></i>
              <span>Início</span>
            </li>
            <li className="menu-item">
              <i className="fa-solid fa-exclamation-triangle"></i>
              <span>Ocorrências</span>
            </li>
            <li className="menu-item">
              <i className="fa-solid fa-chart-bar"></i>
              <span>Relatórios</span>
            </li>
            <li className="menu-item">
              <i className="fa-solid fa-users"></i>
              <span>Usuários</span>
            </li>
          </ul>
        </div>

        {/* Conteúdo Principal */}
        <div className="main-content">
          <div className="main-header">
            <h1>Detalhes da Ocorrência</h1>
            <i className="fa-solid fa-bars"></i>
          </div>

          <div className="form-container">
            {/* Coluna Esquerda */}
            <div>
              <div className="form-group">
                <label>Tipo de ocorrência</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Responsável</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Data/Hora</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea></textarea>
              </div>
              <div className="form-group">
                <label>Localização</label>
                <div className="location-box">
                  <i className="fa-solid fa-map-marker-alt"></i>
                  <p>Mapa</p>
                </div>
              </div>
            </div>

            {/* Coluna Direita */}
            <div>
              <div className="form-group">
                <label>Assinatura digital</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Prioridade</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Status</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Número do protocolo</label>
                <input type="text" />
              </div>
              <div className="form-group">
                <label>Anexos</label>
                <div className="attachments-container">
                  <div className="attachment-icon">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <div className="attachment-icon">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <div className="attachment-icon">
                    <i className="fa-solid fa-image"></i>
                  </div>
                  <div className="attachment-icon">
                    <i className="fa-solid fa-plus"></i>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <div className="timeline-box">
                  <p>Adicionado por:</p>
                  <p>Data/Hora:</p>
                  <p>Editado por:</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="edit-icon">
        <i className="fa-solid fa-pencil-alt"></i>
      </div>
    </>
  );
}
