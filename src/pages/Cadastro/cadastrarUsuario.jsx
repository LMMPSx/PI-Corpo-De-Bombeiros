// src/pages/Perfil/CadastrarUsuario.jsx

import React, { useState } from 'react';
import './cadastrarUsuario.css'; // Importa o CSS para esta tela
import { FaImage } from 'react-icons/fa'; // Importa um ícone de imagem (necessita de 'npm install react-icons')

const CadastrarUsuario = () => {
  // Estados para armazenar os valores dos campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    perfil: '',
    senha: '',
    foto: null, 
  });

  // Handler para atualizar o estado quando um campo de input/select muda
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler para quando a foto é adicionada
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      foto: file,
    }));
    if (file) {
        console.log('Arquivo de foto selecionado:', file.name);
    }
  };

  // Handler para o botão Cadastrar
  const handleSubmit = (e) => {
    e.preventDefault(); 
    console.log('Dados do novo usuário:', formData);
    alert('Novo usuário cadastrado com sucesso! (Verifique o console para os dados)');
    // Aqui você enviaria os dados para um backend (API)
  };

  return (
    <div className="register-user-page">
      <h1 className="register-user-title">Cadastrar novo usuário</h1>

      <div className="register-user-card">
        <form onSubmit={handleSubmit} className="register-user-form">
          {/* Input: Nome */}
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            required
            className="form-input"
          />
          
          {/* Input: CPF */}
          <input
            type="text"
            name="cpf"
            placeholder="CPF"
            value={formData.cpf}
            onChange={handleChange}
            required
            className="form-input"
          />
          
          {/* Input: E-mail */}
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
          
          {/* Select: Perfil */}
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
            {/* Seta customizada (usada no CSS) */}
            <span className="select-arrow"></span> 
          </div>

          {/* Input: Senha */}
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            required
            className="form-input"
          />

          {/* Área para Adicionar Foto (Input do tipo file estilizado) */}
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

          {/* Botão Cadastrar */}
          <button type="submit" className="submit-button">
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastrarUsuario;