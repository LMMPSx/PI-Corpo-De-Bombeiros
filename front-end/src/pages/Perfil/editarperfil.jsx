import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Importa as funções do seu serviço de API
import { fetchUsuarioByCpf, updateUsuario } from '../../services/usuarioService'; 
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header';
import './editarperfil.css';

const EditarUsuario = () => {
  // 🚨 ATENÇÃO: Mudando de 'email' para 'cpf' para coincidir com a API
  const { cpf } = useParams(); 
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true); // Para controle de carregamento
  const [error, setError] = useState(null); // Para controle de erro

  // Estado para armazenar o CPF original, caso ele seja alterado no formulário
  const [originalCpf, setOriginalCpf] = useState(''); 
    
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    perfil: '',
    email: '',
    senha: '', // Apenas para Nova Senha
    foto: null, // Pode ser o objeto File ou a URL da foto atual (string)
  });

  // 1. Carregar dados do usuário ao montar o componente
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        // Usa o parâmetro CPF da URL
        const user = await fetchUsuarioByCpf(cpf); 
        
        // Seta o CPF original para ser usado na rota de atualização
        setOriginalCpf(user.cpf); 

        // Popula o formulário. O campo senha é sempre vazio no frontend.
        setFormData({
          nome: user.nome || '',
          cpf: user.cpf || '',
          perfil: user.perfil || '',
          email: user.email || '',
          senha: '', // A senha nunca é carregada
          foto: user.foto || null, // Se for string (URL), armazena a URL
        });
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    if (cpf) fetchUser();
  }, [cpf]); // Dependência no CPF da URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    // Quando o usuário escolhe um novo arquivo, 'foto' é um objeto File
    setFormData((prev) => ({ ...prev, foto: file })); 
  };

  // 2. Enviar dados atualizados para o backend
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Separa os dados de texto do objeto File (se houver)
    const { foto, ...restOfData } = formData;
    
    // Verifica se 'foto' é um novo arquivo (objeto File)
    const newPhotoFile = foto instanceof File ? foto : null; 

    try {
      // Chama a função do serviço, usando o CPF original para a rota
      await updateUsuario(originalCpf, restOfData, newPhotoFile); 
      alert('Usuário atualizado com sucesso!');
      navigate('/usuarios');
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert('Erro ao atualizar usuário. Verifique o console.');
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };
    
  if (loading) {
    return <div className="loading-container"><p>Carregando usuário...</p></div>;
  }

  if (error) {
    return <div className="error-container"><p>{error}</p></div>;
  }

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
                placeholder="Nova Senha (Deixe em branco para não alterar)"
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
                  Adicionar/Trocar foto
                </label>
                {formData.foto && (
                    <p className="file-name">
                        {/* Exibe o nome do arquivo (se for File) ou um marcador (se for URL string) */}
                        {formData.foto instanceof File ? formData.foto.name : 'Foto atual carregada'}
                    </p>
                )}
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