// src/App.jsx

import { Routes, Route, Navigate } from "react-router-dom";

import { useState } from "react";

import { setAuthToken } from './services/AuthService';



import Login from "./pages/Login/login";

import EsqueceuSenha from "./pages/Login/esqueceu";

import Dashboard from "./pages/Dashboard/Dashboard";

import Ocorrencias from "./pages/Ocorrencias/Ocorrencias";

import NovaOcorrencia from "./pages/NovaOcorrencia/NovaOcorrencia";

import Relatorios from "./pages/Relatorios/Relatorios";

import Usuarios from "./pages/Usuarios/Usuario";

import Configuracoes from "./pages/Configuracoes/Config";

import Sobre from "./pages/Sobre/Sobre";

import Sidebar from "./components/Sidebar/Sidebar";

import Header from "./components/Header/Header";

import Loading from "./components/Loading/Loading";



// 🔥 Contexto Global (inclui o de usuários)

import { ConfigProvider } from "./Contexts/ConfigContext";



// Páginas de usuários

import CadastrarUsuario from "./pages/Cadastro/cadastrarUsuario";

import EditarUsuario from "./pages/Perfil/editarperfil";



import "./App.css";



const storedToken = localStorage.getItem('jwtToken');

// ⭐️ LENDO OS DADOS DO LOCALSTORAGE

const storedNome = localStorage.getItem('nomeUsuario');

const storedTipo = localStorage.getItem('tipoUsuario'); // Lendo a chave correta



if (storedToken) {

    // ⭐️ Chamando setAuthToken com os três parâmetros lidos

    setAuthToken(storedToken, storedNome, storedTipo);

}



export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);



  const handleLogin = () => {

    console.log("Login realizado com sucesso!");

    setIsLoggedIn(true);

  };



  const handleLogout = () => {

    setIsLoggedIn(false);

  };



  const handleCloseSidebar = () => {

    if (window.innerWidth <= 1024) {

      setSidebarOpen(false);

    }

  };



  // Layout principal com Sidebar e Header

  const MainLayout = () => (

    <div className="app">

      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />



      <div

        className={`main-content ${

          sidebarOpen ? "sidebar-open" : "sidebar-closed"

        }`}

      >

        <Header

          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}

          onLogout={handleLogout}

        />



        <div className="content">

          <Routes>

            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/ocorrencias" element={<Ocorrencias />} />

            <Route path="/nova-ocorrencia" element={<NovaOcorrencia />} />

            <Route path="/relatorios" element={<Relatorios />} />



            {/* 👇 Gerenciamento de usuários */}

            <Route path="/usuarios" element={<Usuarios />} />

            <Route path="/usuarios/cadastrar" element={<CadastrarUsuario />} />

            <Route path="/editar-usuario/:cpf" element={<EditarUsuario />} />



            <Route path="/configuracoes" element={<Configuracoes />} />

            <Route path="/sobre" element={<Sobre />} />



            {/* Rota padrão */}

            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>

        </div>

      </div>

    </div>

  );



  return (

    <ConfigProvider>

      <div className="App">

        <Loading />



        <Routes>

          {/* Login */}

          <Route

            path="/login"

            element={

              isLoggedIn ? (

                <Navigate to="/dashboard" replace />

              ) : (

                <Login onLogin={handleLogin} />

              )

            }

          />



          {/* Esqueceu senha */}

          <Route

            path="/esqueceu-senha"

            element={

              isLoggedIn ? (

                <Navigate to="/dashboard" replace />

              ) : (

                <EsqueceuSenha />

              )

            }

          />



          {/* Redirecionamentos principais */}

          <Route

            path="/"

            element={

              isLoggedIn ? (

                <Navigate to="/dashboard" replace />

              ) : (

                <Navigate to="/login" replace />

              )

            }

          />



          {/* ÁREA LOGADA */}

          <Route

            path="/*"

            element={

              isLoggedIn ? <MainLayout /> : <Navigate to="/login" replace />

            }

          />

        </Routes>

      </div>

    </ConfigProvider>

  );

}