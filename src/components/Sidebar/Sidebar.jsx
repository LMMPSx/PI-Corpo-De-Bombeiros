import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Início', icon: 'house' },
    { path: '/dashboard-python', label: 'Dashboard Analítico', icon: 'graph-up' },
    { path: '/ocorrencias', label: 'Ocorrências', icon: 'exclamation-triangle' },
    { path: '/nova-ocorrencia', label: 'Nova Ocorrência', icon: 'plus-circle' },
    { path: '/relatorios', label: 'Gerar Relatório (PDF)', icon: 'file-pdf' },
    { path: '/usuarios', label: 'Usuários', icon: 'people' },
    { path: '/configuracoes', label: 'Configurações', icon: 'gear' },
    { path: '/sobre', label: 'Sobre', icon: 'info-circle' },
  ];

  const additionalItems = [
    { label: 'Mapa de Ocorrências', icon: 'map' },
    { label: 'Pesquisar Endereço', icon: 'search' }
  ];

  const handleLinkClick = () => {
    // Fecha a sidebar apenas em mobile/tablet
    if (window.innerWidth <= 1024 && onClose) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay para mobile - SÓ APARECE EM TELAS PEQUENAS */}
      {isOpen && window.innerWidth <= 1024 && (
        <div 
          className="sidebar-overlay" 
          onClick={onClose}
        />
      )}
      
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <img src="/src/assets/logo.png" className="iconHeader" alt="Logo CBMPE" />
          </div>
          <h3>CBMPE</h3>
        </div>
        
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <i className={`bi bi-${item.icon} nav-icon`}></i>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
          
          <div className="nav-section">
            {additionalItems.map((item, index) => (
              <div key={index} className="nav-item">
                <i className={`bi bi-${item.icon} nav-icon`}></i>
                <span className="nav-label">{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;