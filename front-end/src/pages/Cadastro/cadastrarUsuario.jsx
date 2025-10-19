// src/pages/Perfil/CadastrarUsuario.jsx

import React, { useState } from 'react';
import './cadastrarUsuario.css';
import { FaImage } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importa para redirecionar

const CadastrarUsuario = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    perfil: '',
    senha: '',
    foto: null,
  });

  // Atualiza os campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Atualiza a foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      foto: file ? URL.createObjectURL(file) : null, // gera URL pra visualizar depois
    }));
  };

  // Envia o formulário
  const handleSubmit = (e) => {
    e.preventDefault();

    // Busca os usuários já salvos (ou cria um array novo)
    const usuariosSalvos = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Adiciona o novo usuário
    const novosUsuarios = [...usuariosSalvos, formData];

    // Salva no localStorage
    localStorage.setItem('usuarios', JSON.stringify(novosUsuarios));

    alert('Usuário cadastrado com sucesso!');

    // Redireciona para a tela de gestão
    navigate('/usuarios');
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
          />

          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            required
            className="form-input"
          />

          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />

          <div className="form-select-container">
            <select
              name="perfil"
              value={formData.perfil}
              onChange={handleChange}
              required
              className="form-input form-select"
            >
              <option value="" disabled>Perfil</option>
              <option value="Chefe">Chefe</option>
              <option value="Analista">Analista</option>
              <option value="Administrador">Administrador</option>
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
            <label htmlFor="photoUpload" className="form-input photo-input-label">
              Adicionar foto
              <FaImage className="photo-icon" />
            </label>
          </div>

          <button type="submit" className="submit-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarUsuario;
