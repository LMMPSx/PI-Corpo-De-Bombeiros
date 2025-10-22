import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaImage } from 'react-icons/fa';

// 🚨 CERTIFIQUE-SE DE QUE ESTE CAMINHO ESTÁ CORRETO
import { createUsuario } from '../../services/usuarioService'; 
import './cadastrarUsuario.css'; 

const CadastrarUsuario = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        perfil: '', // Mapeia para tipoUsuario no backend
        senha: '',
        userPhotoFile: null, // Armazena o objeto File
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
        const { userPhotoFile, ...restOfData } = formData;

        // Usa a mesma lógica do editar
        await createUsuario(restOfData, userPhotoFile);

        alert("Usuário cadastrado com sucesso!");
        navigate('/usuarios');
    } catch (error) {
        console.error("Erro ao cadastrar:", error);
        alert("Erro ao cadastrar usuário. Verifique o console.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className="register-user-page">
            <h1 className="register-user-title">Cadastrar novo usuário</h1>

            <div className="register-user-card">
                <form onSubmit={handleSubmit} className="register-user-form">
                    <input
                        type="text"
                        name="nome"
                        placeholder="Nome"
                        value={formData.nome}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={loading}
                    />

                    <input
                        type="text"
                        name="cpf"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={loading}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="E-mail"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-input"
                        required
                        disabled={loading}
                    />

                    <div className="form-select-container">
                        <select
                            name="perfil" // Usa 'perfil' no frontend
                            value={formData.perfil}
                            onChange={handleChange}
                            required
                            className="form-input form-select"
                            disabled={loading}
                        >
                            <option value="" disabled>Selecione o Perfil</option>
                            <option value="Chefe">Chefe</option>
                            <option value="Analista">Analista</option>
                            <option value="Admin">Administrador</option>
                        </select>
                        <span className="select-arrow"></span>
                    </div>

                    <input
                        type="password"
                        name="senha"
                        placeholder="Senha"
                        value={formData.senha}
                        onChange={handleChange}
                        required
                        className="form-input"
                        disabled={loading}
                    />

                    <div className="add-photo-area">
                        <input
                            type="file"
                            id="photoUpload"
                            name="foto"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            style={{ display: 'none' }}
                            disabled={loading}
                        />
                        <label htmlFor="photoUpload" className="form-input photo-input-label">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Pré-visualização da foto" className="photo-preview" />
                            ) : (
                                <>
                                    Adicionar foto
                                    <FaImage className="photo-icon" />
                                </>
                            )}
                        </label>
                    </div>

                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Cadastrando...' : 'Cadastrar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CadastrarUsuario;