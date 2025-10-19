// src/pages/Perfil/EditarUsuario.jsx

import React, { useState } from 'react';
import './editarperfil.css'; // Importa o CSS para esta tela

const EditarUsuario = () => {
  // Estado para armazenar os valores dos campos do formulário
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    perfil: '',
    email: '',
    senha: '',
    foto: null, // Para armazenar o arquivo da foto
  });

  // Handler para atualizar o estado quando um campo de input muda
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
    // Você pode querer exibir uma pré-visualização da imagem aqui
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Exemplo de como você poderia usar o reader.result para exibir a imagem
        console.log('Pré-visualização da imagem:', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handler para o botão Salvar
  const handleSave = (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário de recarregar a página
    console.log('Dados do usuário para salvar:', formData);
    alert('Usuário salvo com sucesso! (Verifique o console para os dados)');
    // Aqui você enviaria os dados para um backend (API)
  };

  // Handler para o botão Cancelar
  const handleCancel = () => {
    console.log('Operação de edição cancelada.');
    alert('Edição cancelada!');
    // Aqui você voltaria para a tela anterior, por exemplo:
    // navigate('/gestao-usuarios'); 
  };

  return (
    <div className="edit-user-page">
      <h1 className="edit-user-title">Editar usuário</h1>

      <div className="edit-user-card">
        <form onSubmit={handleSave} className="edit-user-form">
          {/* Campos de Input */}
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
          <input
            type="text"
            name="perfil"
            placeholder="Perfil"
            value={formData.perfil}
            onChange={handleChange}
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
          <input
            type="password"
            name="senha"
            placeholder="Senha"
            value={formData.senha}
            onChange={handleChange}
            className="form-input"
          />

          {/* Área para Adicionar Foto */}
          <div className="add-photo-area">
            <input
              type="file"
              id="photoUpload"
              name="foto"
              accept="image/*"
              onChange={handlePhotoChange}
              style={{ display: 'none' }} // Esconde o input de arquivo padrão
            />
            <label htmlFor="photoUpload" className="add-photo-button">
              Adicionar foto
            </label>
            {formData.foto && <p className="file-name">{formData.foto.name}</p>}
          </div>

          {/* Botões de Ação */}
          <div className="action-buttons">
            <button
              type="button" // Use 'button' para evitar que cancele submeta o form
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
  );
};

export default EditarUsuario;