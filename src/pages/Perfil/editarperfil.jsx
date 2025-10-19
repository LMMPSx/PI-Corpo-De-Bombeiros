import React, { useState } from "react";
import "./editarperfil.css";


export default function EditarPerfil() {
  const [formData, setFormData] = useState({
    nome: "",
    cpf: "",
    cargo: "",
    email: "",
    foto: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, foto: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados salvos:", formData);
    alert("Perfil salvo com sucesso!");
  };

  return (
    <div className="editar-perfil">
      <h2 className="titulo">Editar perfil</h2>

      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF*"
            value={formData.cpf}
            onChange={handleChange}
          />
          <input
            type="text"
            name="cargo"
            placeholder="Cargo"
            value={formData.cargo}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
          />

          <div className="foto-area">
            {formData.foto ? (
              <img
                src={formData.foto}
                alt="Foto de perfil"
                className="foto-preview"
              />
            ) : (
              <div className="foto-placeholder">Adicionar foto</div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFoto}
              className="input-foto"
            />
          </div>

          <div className="botoes">
            <button
              type="button"
              className="btn cancelar"
              onClick={() =>
                setFormData({
                  nome: "",
                  cpf: "",
                  cargo: "",
                  email: "",
                  foto: null,
                })
              }
            >
              Cancelar
            </button>
            <button type="submit" className="btn salvar">
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
