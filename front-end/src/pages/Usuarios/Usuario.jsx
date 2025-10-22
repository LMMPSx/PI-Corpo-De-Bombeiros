import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchUsuarios, deleteUsuario } from '../../services/usuarioService'; // Importe o novo serviço
import { logout } from "../../services/AuthService";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Estado para capturar o erro
    const navigate = useNavigate();

    useEffect(() => {
        if (error && (error.response?.status === 401 || error.response?.status === 403)) {
            console.warn("Sessão expirada ou acesso negado. Redirecionando para login...");
            logout(); // Faz o logout no AuthService
            navigate("/login"); // Redireciona usando navigate
        }
    }, [error, navigate]);

    // Novo useEffect para carregar do backend
    useEffect(() => {
        const loadUsuarios = async () => {
            try {
                setLoading(true);
                const data = await fetchUsuarios();
                setUsuarios(data);
                setError(null); // Limpa o erro em caso de sucesso
            } catch (err) {
                console.error("Falha ao carregar usuários:", err);
                setError(err); // Define o erro (incluindo o objeto de resposta do Axios)
                setUsuarios([]);
            } finally {
                setLoading(false);
            }
        };

        loadUsuarios();
    }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

    // Editar usuário (mantém a navegação)
    const handleEditar = (userCpf) => {
    navigate(`/editar-usuario/${userCpf}`); // Passa o CPF na URL
    };

// Excluir usuário - agora com CPF
const handleExcluir = async (userCpf) => { // Recebe CPF
    if (window.confirm("Tem certeza que deseja excluir este usuário?")) {
        try {
            await deleteUsuario(userCpf); // Usa o CPF

            // Remove da lista local após sucesso
            setUsuarios(prevUsuarios => prevUsuarios.filter(user => user.cpf !== userCpf)); // Filtra pelo CPF

            alert(`Usuário com CPF ${userCpf} excluído com sucesso!`);
        } catch (error) {
            console.error("Falha na exclusão:", error);
            alert("Erro ao excluir o usuário. Tente novamente.");
        }
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
                    {loading ? (
                        <p>Carregando usuários...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : usuarios.length > 0 ? (
                        usuarios.map((user) => (
                            <UsuarioCard
                                key={user.cpf} // Use key única, como email ou id
                                user={user}
                                onEditar={() => handleEditar(user.cpf)} 
                                onExcluir={() => handleExcluir(user.cpf)} // Passa o CPF
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
