import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./usuario.css";

// Dados iniciais
const initialUsers = [
  { nome: "Victor Melo", email: "victor@email.com", perfil: "Admin" },
  { nome: "Maria Silva", email: "maria@email.com", perfil: "Usuário" },
  { nome: "João Santos", email: "joao@email.com", perfil: "Supervisor" },
];

// Componente de Card de Usuário
function UsuarioCard({ user, onEditar, onExcluir }) {
  return (
    <div className="user-card">
      <div className="avatar"></div>
      <div className="user-info">
        <strong>{user.nome}</strong>
        <span>{user.email}</span>
        <span>{user.perfil}</span>
      </div>
      <div className="action-buttons">
        <button
          className="btn-action btn-edit"
          onClick={() => onEditar(user.email)}
          aria-label={`Editar usuário ${user.nome}`}
        >
          Editar
        </button>
        <button
          className="btn-action btn-delete"
          onClick={() => onExcluir(user.email)}
          aria-label={`Excluir usuário ${user.nome}`}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

// Componente principal
export default function GestaoUsuarios() {
  const [usuarios, setUsuarios] = useState(initialUsers);
  const navigate = useNavigate();

  const handleEditar = (userEmail) => {
    navigate(`/editar-usuario/${userEmail}`);
  };

  const handleExcluir = (userEmail) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      const novaLista = usuarios.filter((user) => user.email !== userEmail);
      setUsuarios(novaLista);
    }
  };

  const handleCadastrar = () => {
    navigate("/cadastrar-usuario");
  };

  return (
    <div className="gestao-page-wrapper">
      <div className="gestao-page-container">
        <div className="gestao-header">
          <h1>Gerenciar Usuários</h1>
          <button className="btn-cadastrar" onClick={handleCadastrar}>
            Cadastrar
          </button>
        </div>
        <div className="user-list-container">
          {usuarios.map((user) => (
            <UsuarioCard
              key={user.email}
              user={user}
              onEditar={handleEditar}
              onExcluir={handleExcluir}
            />
          ))}
        </div>
      </div>
    </div>
  );
}