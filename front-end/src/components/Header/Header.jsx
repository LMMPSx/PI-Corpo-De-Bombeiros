import React from 'react';
import { useUserData } from '../../hooks/useUserData'; // Ajuste o path conforme necessário
import './Header.css';

const Header = ({ onToggleSidebar, onLogout }) => {
  const { userName, userRole } = useUserData(); // <-- Consumindo os dados
  
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
          {/* ⭐️ 1. NOME: Deve usar a variável userName */}
          <span className="user-name">{userName}</span> 
          
          {/* ⭐️ 2. FUNÇÃO: Deve usar a variável userRole */}
          <span className="user-role">{userRole}</span> 
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