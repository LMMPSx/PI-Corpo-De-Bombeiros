import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUsuarioByCpf, updateUsuario } from '../../services/usuarioService'; 
import { FaUser, FaImage, FaSave, FaTimes } from 'react-icons/fa';
import './editarperfil.css';

const EditarUsuario = () => {
  const { cpf } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [originalCpf, setOriginalCpf] = useState(''); 
    
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    perfil: '',
    email: '',
    senha: '',
    foto: null,
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const user = await fetchUsuarioByCpf(cpf); 
        setOriginalCpf(user.cpf);

        setFormData({
          nome: user.nome || '',
          cpf: user.cpf || '',
          perfil: user.perfil || '',
          email: user.email || '',
          senha: '',
          foto: user.foto || null,
        });

        if (user.foto && typeof user.foto === 'string') {
          setPhotoPreview(user.foto);
        }
      } catch (err) {
        console.error('Erro ao carregar usuário:', err);
        setError('Não foi possível carregar os dados do usuário.');
      } finally {
        setLoading(false);
      }
    };

    if (cpf) fetchUser();
  }, [cpf]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, foto: file }));
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { foto, ...restOfData } = formData;
    const newPhotoFile = foto instanceof File ? foto : null;

    try {
      await updateUsuario(originalCpf, restOfData, newPhotoFile);
      alert('Usuário atualizado com sucesso!');
      navigate('/usuarios');
    } catch (err) {
      console.error("Erro ao salvar usuário:", err);
      alert('Erro ao atualizar usuário. Verifique o console.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/usuarios');
  };
    
  if (loading) {
    return (
      <div className="nova-ocorrencia-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Carregando usuário...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nova-ocorrencia-container">
        <div className="error-state">
          <p>{error}</p>
          <button className="submit-btn" onClick={() => navigate('/usuarios')}>
            Voltar para Usuários
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nova-ocorrencia-container">
      <div className="nova-ocorrencia-header">
        <h1>Editar Usuário</h1>
      </div>

      <form onSubmit={handleSave} className="nova-ocorrencia-form">
        <div className="form-row">
          <div className="form-group">
            <label>Nome completo</label>
            <input
              type="text"
              name="nome"
              placeholder="Digite o nome completo"
              value={formData.nome}
              onChange={handleChange}
              required
              className="form-input"
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>CPF</label>
            <input
              type="text"
              name="cpf"
              placeholder="Digite o CPF"
              value={formData.cpf}
              onChange={handleChange}
              required
              className="form-input"
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Perfil</label>
            <select
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
              required
              className="form-input"
              disabled={saving}
            >
              <option value="" disabled>Selecione o perfil</option>
              <option value="Chefe">Chefe</option>
              <option value="Analista">Analista</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="Digite o e-mail"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
              disabled={saving}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Nova Senha</label>
            <input
              type="password"
              name="senha"
              placeholder="Deixe em branco para não alterar"
              value={formData.senha}
              onChange={handleChange}
              className="form-input"
              disabled={saving}
            />
          </div>
        </div>

        <div className="separator"></div>

        <div className="anexos-section">
          <h2>Foto do Perfil</h2>
          <div className="anexos-upload">
            <input
              type="file"
              id="photoUpload"
              name="foto"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }}
              disabled={saving}
            />
            <label htmlFor="photoUpload" className="upload-btn">
              <FaImage />
              {photoPreview ? 'Alterar Foto' : 'Adicionar Foto'}
            </label>
            <span className="upload-hint">PNG, JPG até 5MB</span>
            
            {photoPreview && (
              <div className="photo-preview-container">
                <img src={photoPreview} alt="Pré-visualização" className="photo-preview" />
                <div className="photo-info">
                  <span>Pré-visualização da foto</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={handleCancel}
            disabled={saving}
          >
            <FaTimes />
            Cancelar
          </button>
          <button 
            type="submit" 
            className="submit-btn" 
            disabled={saving}
          >
            {saving ? (
              <>
                <div className="loading-spinner-small"></div>
                Salvando...
              </>
            ) : (
              <>
                <FaSave />
                Salvar Alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarUsuario;