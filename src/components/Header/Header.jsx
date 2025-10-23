import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks/useUserData';
import { 
  FaBars, 
  FaBell, 
  FaSignOutAlt, 
  FaUserCircle,
  FaShieldAlt,
  FaFire,
  FaUserTie,
  FaChartLine
} from 'react-icons/fa';
import './Header.css';

const Header = ({ onToggleSidebar, onLogout, notificationCount = 0 }) => {
  const { userName, userRole, userPhoto } = useUserData();
  const navigate = useNavigate();

  // Função para obter ícone baseado no perfil
  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'administrador':
        return <FaShieldAlt className="role-icon admin" />;
      case 'chefe':
        return <FaUserTie className="role-icon chefe" />;
      case 'analista':
        return <FaChartLine className="role-icon analista" />;
      default:
        return <FaUserCircle className="role-icon" />;
    }
  };

  // Função para obter texto do cargo formatado
  const getRoleText = (role) => {
    switch(role?.toLowerCase()) {
      case 'administrador':
        return 'Administrador';
      case 'chefe':
        return 'Chefe';
      case 'analista':
        return 'Analista';
      default:
        return role || 'Perfil';
    }
  };

  // Navegar para ocorrências ao clicar no sino
  const handleNotificationClick = () => {
    navigate('/ocorrencias');
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <FaBars />
        </button>
        <div className="header-brand">
          <FaFire className="brand-icon" />
          <h1>Painel de Ocorrências - CBMPE</h1>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <div className="user-avatar">
            {userPhoto ? (
              <img src={userPhoto} alt={userName} className="user-photo" />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </div>
          <div className="user-details">
            <span className="user-name">{userName || 'Usuário'}</span>
            <div className="user-role">
              {getRoleIcon(userRole)}
              <span className="role-text">{getRoleText(userRole)}</span>
            </div>
          </div>
        </div>
        
        <div className="header-actions">
          <button 
            className="btn-notification" 
            onClick={handleNotificationClick}
            title="Ver ocorrências"
          >
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-badge">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>
          <button className="btn-logout" onClick={onLogout} title="Sair do sistema">
            <FaSignOutAlt />
            <span className="logout-text">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;