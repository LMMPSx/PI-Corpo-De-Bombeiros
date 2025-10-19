import './Header.css';

const Header = ({ onToggleSidebar, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          ☰
        </button>
        <h1>Painel de Ocorrências - CBMPE</h1>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="user-name">Usuário Demo</span>
          <span className="user-role">Administrador</span>
        </div>
        <div className="header-actions">
          <button className="btn-notification">🔔</button>
          <button className="btn-logout" onClick={onLogout}>Sair</button>
        </div>
      </div>
    </header>
  );
};

export default Header;