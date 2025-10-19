import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './editarperfil.css';

// Dados simulados locais (substituem o contexto)
const mockUsers = [
  { nome: 'Victor Melo', cpf: '123.456.789-00', perfil: 'Administrador', email: 'victor@email.com', senha: '', foto: null },
  { nome: 'Maria Silva', cpf: '987.654.321-00', perfil: 'Analista', email: 'maria@email.com', senha: '', foto: null },
];

const EditarUsuario = () => {
  const { email } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usuarios, setUsuarios] = useState(mockUsers);

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    perfil: '',
    email: '',
    senha: '',
    foto: null,
  });

  useEffect(() => {
    const user = usuarios.find((u) => u.email === email);
    if (user) setFormData(user);
  }, [email, usuarios]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, foto: file }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    const updatedUsers = usuarios.map((u) =>
      u.email === email ? { ...u, ...formData } : u
    );
    setUsuarios(updatedUsers);
    alert('Usuário atualizado com sucesso!');
    navigate('/usuarios');
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };

  return (
    <div className="app">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Conteúdo principal */}
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Header */}
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Conteúdo da página */}
        <div className="content edit-user-page">
          <h1 className="edit-user-title">Editar usuário</h1>

          <div className="edit-user-card">
            <form onSubmit={handleSave} className="edit-user-form">
              <input
                type="text"
                name="nome"
                placeholder="Nome*"
                value={formData.nome}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                type="text"
                name="cpf"
                placeholder="CPF*"
                value={formData.cpf}
                onChange={handleChange}
                required
                className="form-input"
              />

              {/* Campo de seleção de perfil */}
              <select
                name="perfil"
                value={formData.perfil}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="" disabled>Selecione o perfil</option>
                <option value="Chefe">Chefe</option>
                <option value="Analista">Analista</option>
                <option value="Administrador">Administrador</option>
              </select>

              <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
              <input
                type="password"
                name="senha"
                placeholder="Senha"
                value={formData.senha}
                onChange={handleChange}
                className="form-input"
              />

              <div className="add-photo-area">
                <input
                  type="file"
                  id="photoUpload"
                  name="foto"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photoUpload" className="add-photo-button">
                  Adicionar foto
                </label>
                {formData.foto && <p className="file-name">{formData.foto.name}</p>}
              </div>

              <div className="action-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
                <button type="submit" className="save-button">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarUsuario;
