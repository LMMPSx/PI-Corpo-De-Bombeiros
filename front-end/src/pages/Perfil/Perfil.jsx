// components/Perfil.jsx
import React, { useState } from "react";
import "./perfil.css";
import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
// 1. Importe o hook 'useNavigate'
import { useNavigate } from "react-router-dom";

const initialUsers = [
  { nome: "Victor Melo", email: "victor@email.com", perfil: "Admin" },
  { nome: "Maria Silva", email: "maria@email.com", perfil: "Usuário" },
  { nome: "João Santos", email: "joao@email.com", perfil: "Supervisor" },
];

export default function GestaoUsuarios() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usuarios, setUsuarios] = useState(initialUsers);
  // 2. Inicialize o hook de navegação
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logout realizado com sucesso!");
  };

  // 3. Atualize a função de editar para usar o navigate
  const handleEditar = (userEmail) => {
    // Navega para a rota de edição, passando o email como parâmetro na URL
    navigate(`/editar-usuario/${userEmail}`);
  };

  const handleExcluir = (userEmail) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      const novaLista = usuarios.filter((user) => user.email !== userEmail);
      setUsuarios(novaLista);
    }
  };

  return (
    <div className={`app-container ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
        <div className="gestao-page-container">
          <div className="gestao-header">
            <h1>Gerenciar Usuários</h1>
            <button className="btn-cadastrar">Cadastrar</button>
          </div>
          <div className="user-list-container">
            {usuarios.map((user) => (
              <div key={user.email} className="user-card">
                <div className="avatar"></div>
                <div className="user-info">
                  <strong>{user.nome}</strong>
                  <span>{user.email}</span>
                  <span>{user.perfil}</span>
                </div>
                <div className="action-buttons">
                  {/* 4. Chame a nova função handleEditar */}
                  <button className="btn-action btn-edit" onClick={() => handleEditar(user.email)}>
                    Editar
                  </button>
                  <button className="btn-action btn-delete" onClick={() => handleExcluir(user.email)}>
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}