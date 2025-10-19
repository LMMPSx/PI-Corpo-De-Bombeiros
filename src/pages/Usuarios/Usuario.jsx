import React, { useState } from "react";
import "./usuario.css";
// Header e Sidebar removidos dos imports
import { useNavigate } from "react-router-dom";

const initialUsers = [
  { nome: "Victor Melo", email: "victor@email.com", perfil: "Admin" },
  { nome: "Maria Silva", email: "maria@email.com", perfil: "Usuário" },
  { nome: "João Santos", email: "joao@email.com", perfil: "Supervisor" },
];

export default function GestaoUsuarios() {
  // sidebarOpen e setSidebarOpen removidos
  const [usuarios, setUsuarios] = useState(initialUsers);
  const navigate = useNavigate();

  // handleLogout removido

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
    // app-container, sidebar e main-content removidos/simplificados
    <div className="gestao-page-wrapper"> 
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
                <button 
                  className="btn-action btn-edit" 
                  onClick={() => handleEditar(user.email)}
                >
                  Editar
                </button>
                <button 
                  className="btn-action btn-delete" 
                  onClick={() => handleExcluir(user.email)}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}