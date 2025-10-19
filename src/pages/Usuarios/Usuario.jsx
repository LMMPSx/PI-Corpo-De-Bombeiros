import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./Usuario.css";

// Componente de Card de Usuário
function UsuarioCard({ user, onEditar, onExcluir }) {
  return (
    <div className="user-card">
      <div className="avatar">
        {user.foto ? (
          <img src={user.foto} alt={user.nome} className="user-photo" />
        ) : (
          <div className="no-photo">📷</div>
        )}
      </div>
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
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  // Carrega os usuários do localStorage quando o componente é montado
  useEffect(() => {
    const usuariosSalvos = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Se não houver nada salvo, usa os usuários iniciais
    if (usuariosSalvos.length === 0) {
      const initialUsers = [
        { nome: "Victor Melo", email: "victor@email.com", perfil: "Admin" },
        { nome: "Maria Silva", email: "maria@email.com", perfil: "Usuário" },
        { nome: "João Santos", email: "joao@email.com", perfil: "Supervisor" },
      ];
      localStorage.setItem("usuarios", JSON.stringify(initialUsers));
      setUsuarios(initialUsers);
    } else {
      setUsuarios(usuariosSalvos);
    }
  }, []);

  // Editar usuário
  const handleEditar = (userEmail) => {
    navigate(`/editar-usuario/${userEmail}`);
  };

  // Excluir usuário
  const handleExcluir = (userEmail) => {
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
      const novaLista = usuarios.filter((user) => user.email !== userEmail);
      setUsuarios(novaLista);
      localStorage.setItem("usuarios", JSON.stringify(novaLista)); // Atualiza o localStorage
    }
  };

  return (
    <div className="gestao-page-wrapper">
      <div className="gestao-page-container">
        <div className="gestao-header">
          <h1>Gerenciar Usuários</h1>
          <Link to="/usuarios/cadastrar" className="btn-cadastrar">
            Cadastrar
          </Link>
        </div>

        <div className="user-list-container">
          {usuarios.length > 0 ? (
            usuarios.map((user) => (
              <UsuarioCard
                key={user.email}
                user={user}
                onEditar={handleEditar}
                onExcluir={handleExcluir}
              />
            ))
          ) : (
            <p>Nenhum usuário cadastrado ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
}
