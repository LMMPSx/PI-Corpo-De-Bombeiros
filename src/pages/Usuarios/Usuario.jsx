import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchUsuarios, deleteUsuario } from '../../services/usuarioService';
import { logout } from "../../services/AuthService";
import { FaUserPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaIdCard } from "react-icons/fa";
import "./Usuario.css";

function UsuarioCard({ user, onEditar, onExcluir }) {
  return (
    <div className="user-card">
      <div className="user-card-header">
        <div className="avatar">
          {user.foto ? (
            <img src={user.foto} alt={user.nome} className="user-photo" />
          ) : (
            <div className="no-photo">
              <FaUser />
            </div>
          )}
        </div>
        <div className="user-badge">{user.perfil}</div>
      </div>
      
      <div className="user-info">
        <div className="info-item">
          <FaUser className="info-icon" />
          <strong>{user.nome}</strong>
        </div>
        <div className="info-item">
          <FaEnvelope className="info-icon" />
          <span>{user.email}</span>
        </div>
        <div className="info-item">
          <FaIdCard className="info-icon" />
          <span>{user.cpf}</span>
        </div>
      </div>
      
      <div className="action-buttons">
        <button
          className="btn-action btn-edit"
          onClick={() => onEditar(user.cpf)}
          aria-label={`Editar usuário ${user.nome}`}
        >
          <FaEdit />
          Editar
        </button>
        <button
          className="btn-action btn-delete"
          onClick={() => onExcluir(user.cpf)}
          aria-label={`Excluir usuário ${user.nome}`}
        >
          <FaTrash />
          Excluir
        </button>
      </div>
    </div>
  );
}

export default function GestaoUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (error && (error.response?.status === 401 || error.response?.status === 403)) {
            console.warn("Sessão expirada ou acesso negado. Redirecionando para login...");
            logout();
            navigate("/login");
        }
    }, [error, navigate]);

    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                setLoading(true);
                const data = await fetchUsuarios();
                setUsuarios(data);
                setError(null);
            } catch (err) {
                console.error("Falha ao carregar usuários:", err);
                setError(err);
                setUsuarios([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsuarios();
    }, []);

    const handleEditar = (userCpf) => {
        navigate(`/editar-usuario/${userCpf}`);
    };

    const handleExcluir = async (userCpf) => {
        if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
            try {
                await deleteUsuario(userCpf);
                setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.cpf !== userCpf));
                alert(`Usuário excluído com sucesso!`);
            } catch (error) {
                console.error("Falha na exclusão:", error);
                alert("Erro ao excluir o usuário. Tente novamente.");
            }
        }
    };

    return (
        <div className="nova-ocorrencia-container">
            <div className="nova-ocorrencia-header">
                <h1>Gerenciar Usuários</h1>
                <Link to="/usuarios/cadastrar" className="submit-btn">
                    <FaUserPlus />
                    Cadastrar Usuário
                </Link>
            </div>

            <div className="nova-ocorrencia-form">
                {loading ? (
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Carregando usuários...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>Erro ao carregar usuários: {error.message}</p>
                    </div>
                ) : usuarios.length > 0 ? (
                    <div className="user-list-container">
                        {usuarios.map((user) => (
                            <UsuarioCard
                                key={user.cpf}
                                user={user}
                                onEditar={handleEditar}
                                onExcluir={handleExcluir}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <FaUser className="empty-icon" />
                        <p>Nenhum usuário cadastrado ainda.</p>
                        <Link to="/usuarios/cadastrar" className="submit-btn">
                            <FaUserPlus />
                            Cadastrar Primeiro Usuário
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}