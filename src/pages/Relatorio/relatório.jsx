import "./relatorio.css";
import logo from "./assets/logo.png";
import graficoPizza from "./assets/graficopizza.png";
import graficoBarra from "./assets/graficobarra.png";
import MenuIcon from "./assets/menu.png";

import HomeIcon from "./assets/icons/Home.png"      
import AlertIcon from "./assets/icons/ocorrencia.png";    
import ReportIcon from "./assets/icons/relatorio.png";   
import UserIcon from "./assets/icons/usuario.png";   

export default function Relatorio() {
  return (
    <div className="relatorio-page">
      {/* ===== Sidebar ===== */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo CBMPE" />
        </div>
        <nav className="menu">
          <a href="./assets/inicio.png">Início</a>
          <a href="./assets/icon/ocorrencia.png">Ocorrências</a>
          <a href="#" className="active">Relatórios</a>
          <a href="#">Usuários</a>
        </nav>
      </aside>

      {/* ===== Conteúdo principal ===== */}
      <main className="main">
        {/* Barra superior azul */}
        <header className="main-header">
          <div className="menu-section">
            <img src={MenuIcon} alt="Menu" className="menu-icon" />
            <span className="menu-text">Menu</span>
          </div>
          <h1 className="main-title">
            Painel de coleta e gestão de ocorrências - <span>CBMPE</span>
          </h1>
        </header>

        {/* Cards de status */}
        <section className="status-cards">
          <div className="status-card vermelho">
            <span className="numero">X</span>
            <p>Em aberto</p>
          </div>
          <div className="status-card amarelo">
            <span className="numero">X</span>
            <p>Em andamento</p>
          </div>
          <div className="status-card azul">
            <span className="numero">X</span>
            <p>Concluídas</p>
          </div>
        </section>

        {/* Gráficos */}
        <section className="graficos">
          <div className="grafico-box">
            <h2>Ocorrências por tipo</h2>
            <img src={graficoPizza} alt="Gráfico de pizza" />
          </div>
          <div className="grafico-box">
            <h2>Ocorrências por região</h2>
            <img src={graficoBarra} alt="Gráfico de barras" />
          </div>
        </section>

        {/* Tabela */}
        <section className="tabela-box">
          <div className="tabela-header">
            <h2>Ocorrências</h2>
            <button className="exportar">Exportar</button>
          </div>
          <table className="tabela">
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
              <tr>
                <td>Alta</td>
                <td>Incêndio</td>
                <td>30/08/2025 - 12:50</td>
                <td>Olinda</td>
                <td>Em aberto</td>
              </tr>
              <tr>
                <td>Média</td>
                <td>Resgate animal em risco</td>
                <td>30/08/2025 - 13:00</td>
                <td>Olinda</td>
                <td>Em aberto</td>
              </tr>
              <tr>
                <td>Baixa</td>
                <td>Treinamento</td>
                <td>30/08/2025 - 15:00</td>
                <td>Olinda</td>
                <td>Em aberto</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}