import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage, FaUserPlus } from 'react-icons/fa';
import { createUsuario } from '../../services/usuarioService'; 
import './cadastrarUsuario.css'; 

const CadastrarUsuario = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        perfil: '',
        senha: '',
        userPhotoFile: null,
    });
    
    const [photoPreview, setPhotoPreview] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];

        setFormData((prevData) => ({
            ...prevData,
            userPhotoFile: file,
        }));

        if (file) {
            setPhotoPreview(URL.createObjectURL(file));
        } else {
            setPhotoPreview(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { userPhotoFile, ...userData } = formData;
            
            console.log("Token no localStorage:", localStorage.getItem('jwtToken'));
            console.log("Dados do formulário:", userData);
            console.log("Foto:", userPhotoFile);
            
            const novoUsuario = await createUsuario(userData, userPhotoFile);

            alert(`Usuário ${novoUsuario.nome} cadastrado com sucesso!`);
            
            navigate('/usuarios');
            
        } catch (error) {
            let errorMessage = "Erro ao cadastrar usuário. Verifique os dados.";
            
            const backendMessage = error.response?.data?.message;

            if (backendMessage) {
                errorMessage = backendMessage;
            } else if (error.response?.status === 409) {
                errorMessage = "Este CPF ou E-mail já está em uso.";
            } else if (error.response?.status === 403) {
                errorMessage = "Acesso negado. Verifique se você tem permissão de Administrador.";
            }

            alert(errorMessage);
            console.error("Detalhes do erro:", error.response || error);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="nova-ocorrencia-container">
            <div className="nova-ocorrencia-header">
                <h1>Cadastrar Novo Usuário</h1>
            </div>

            <form onSubmit={handleSubmit} className="nova-ocorrencia-form">
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
                            disabled={loading}
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
                            disabled={loading}
                        />
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
                            disabled={loading}
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
                            disabled={loading}
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
                        <label>Senha</label>
                        <input
                            type="password"
                            name="senha"
                            placeholder="Digite a senha"
                            value={formData.senha}
                            onChange={handleChange}
                            required
                            disabled={loading}
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
                            disabled={loading}
                        />
                        <label htmlFor="photoUpload" className="upload-btn">
                            <FaImage />
                            {photoPreview ? 'Alterar Foto' : 'Adicionar Foto'}
                        </label>
                        <span className="upload-hint">PNG, JPG até 5MB</span>
                        
                        {photoPreview && (
                            <div className="arquivos-list">
                                <h4>Pré-visualização:</h4>
                                <div className="arquivo-item">
                                    <span>Foto selecionada</span>
                                    <img 
                                        src={photoPreview} 
                                        alt="Pré-visualização" 
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            borderRadius: '4px',
                                            objectFit: 'cover'
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        className="cancel-btn"
                        onClick={() => navigate('/usuarios')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="submit-btn" 
                        disabled={loading}
                    >
                        {loading ? 'Cadastrando...' : (
                            <>
                                <FaUserPlus style={{ marginRight: '8px' }} />
                                Cadastrar Usuário
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CadastrarUsuario;