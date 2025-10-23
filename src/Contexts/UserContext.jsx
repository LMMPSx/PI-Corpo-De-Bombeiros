// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState } from "react";

// Cria o contexto
const UserContext = createContext();

// Hook para facilitar o uso
export const useUsers = () => useContext(UserContext);

// Dados iniciais
const initialUsers = [
  {
    nome: "Victor Melo",
    cpf: "123.456.789-00",
    perfil: "Admin",
    email: "victor@email.com",
    senha: "",
    foto: null,
  },
  {
    nome: "Maria Silva",
    cpf: "987.654.321-00",
    perfil: "Usuário",
    email: "maria@email.com",
    senha: "",
    foto: null,
  },
  {
    nome: "João Santos",
    cpf: "456.789.123-00",
    perfil: "Supervisor",
    email: "joao@email.com",
    senha: "",
    foto: null,
  },
];

export const UserProvider = ({ children }) => {
  const [usuarios, setUsuarios] = useState(initialUsers);

  const adicionarUsuario = (novoUsuario) => {
    setUsuarios((prev) => [...prev, novoUsuario]);
  };

  const atualizarUsuario = (email, novosDados) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.email === email ? { ...u, ...novosDados } : u))
    );
  };

  const excluirUsuario = (email) => {
    setUsuarios((prev) => prev.filter((u) => u.email !== email));
  };

  return (
    <UserContext.Provider
      value={{
        usuarios,
        adicionarUsuario,
        atualizarUsuario,
        excluirUsuario,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
