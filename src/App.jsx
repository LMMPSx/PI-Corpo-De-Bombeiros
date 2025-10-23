// src/App.jsx

// --> ADICIONADO 'useEffect'
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { setAuthToken } from './services/AuthService';

// --> ADICIONADO 'createOcorrencia' (confirme se este caminho está correto)
import { createOcorrencia } from './services/ocorrenciaService';

// (Seus outros imports originais)
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
import { ConfigProvider } from "./Contexts/ConfigContext"; // Corrigido caminho
import CadastrarUsuario from "./pages/Cadastro/cadastrarUsuario";
import EditarUsuario from "./pages/Perfil/editarperfil";
import "./App.css";

// --> ADICIONADO Bloco de Sincronização
const OUTBOX_KEY = 'ocorrenciasPendentes';

const sincronizarOcorrenciasPendentes = async () => {
  let fila;
  try {
    fila = JSON.parse(localStorage.getItem(OUTBOX_KEY)) || [];
  } catch (error) {
    console.error("Erro ao ler a fila de saída do localStorage:", error);
    localStorage.removeItem(OUTBOX_KEY); // Limpa fila corrompida
    return;
  }

  if (fila.length === 0) {
    // console.log('Sincronização: Fila de saída vazia.'); // Comentado para reduzir logs
    return;
  }

  console.log(`Sincronização: Iniciando envio de ${fila.length} ocorrências pendentes...`);

  const falhas = []; // Guarda itens que falharem
  let sucessoCount = 0;

  for (const item of fila) {
     // Verifica se o item tem a estrutura esperada
    if (!item || !item.ocorrenciaEnviar || !item.ocorrenciaEnviar.idUnico) {
      console.warn('Sincronização: Item inválido encontrado na fila, pulando.', item);
      continue;
    }
    try {
      // Tenta enviar o item da fila
      // Enviando sem arquivos/assinatura reais, como definido na lógica offline
      await createOcorrencia(item.ocorrenciaEnviar, [], ''); // Passa dados esperados
      console.log(`Sincronização: Item ${item.ocorrenciaEnviar.idUnico} enviado com sucesso.`);
      sucessoCount++;
    } catch (error) {
      console.error(`Sincronização: Falha ao enviar item ${item.ocorrenciaEnviar.idUnico}. Voltando para a fila. Erro:`, error);
      falhas.push(item);
    }
  }

  // Atualiza a fila no localStorage
  try {
    if (falhas.length > 0) {
      localStorage.setItem(OUTBOX_KEY, JSON.stringify(falhas));
      console.log(`Sincronização: ${sucessoCount} itens enviados. ${falhas.length} itens falharam e permanecem na fila.`);
    } else {
      localStorage.removeItem(OUTBOX_KEY); // Sucesso total! Limpa a fila.
      console.log(`Sincronização: ${sucessoCount} itens enviados. Fila de saída limpa com sucesso!`);
    }
   } catch (storageError) {
      console.error("Erro ao atualizar a fila de saída no localStorage:", storageError);
   }
};
// --- Fim do Bloco Adicionado ---


// (Seu código original de autenticação)
const storedToken = localStorage.getItem('jwtToken');
const storedNome = localStorage.getItem('nomeUsuario');
const storedTipo = localStorage.getItem('tipoUsuario');

if (storedToken) {
    setAuthToken(storedToken, storedNome, storedTipo);
}

export default function App() {
  // Inicializa isLoggedIn baseado na existência do token
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedToken); // Usar !! para garantir boolean
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // --> ADICIONADO 'useEffect' para escutar a internet e sincronizar
  useEffect(() => {
    let isOnline = navigator.onLine; // Guarda o estado inicial

    const handleOnline = () => {
      if (!isOnline) { // Só executa se MUDOU para online
        console.log('Status: Internet reconectada. Verificando fila de saída...');
        sincronizarOcorrenciasPendentes();
        isOnline = true;
      }
    };
    const handleOffline = () => {
       if (isOnline) { // Só executa se MUDOU para offline
          console.log('Status: Internet desconectada.');
          isOnline = false;
       }
    };

    // Tenta sincronizar ao carregar (se já online)
    if (navigator.onLine) {
      // console.log('Status: App iniciado online. Verificando fila de saída...'); // Comentado para reduzir logs
      sincronizarOcorrenciasPendentes();
    } else {
      console.log('Status: App iniciado offline.');
    }

    // Adiciona os "escutadores"
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Limpa os "escutadores" ao desmontar
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []); // '[]' = Roda apenas uma vez
  // --- Fim do Bloco Adicionado ---

  // (O resto do seu App.jsx original não muda)
  const handleLogin = () => {
    console.log("Login realizado com sucesso!");
    setIsLoggedIn(true);
    // Tenta sincronizar após login (com delay)
    setTimeout(sincronizarOcorrenciasPendentes, 1000); // Adicionado aqui também
  };

  const handleLogout = () => {
     console.log("Logout realizado.");
     // Limpa o localStorage e o estado
     localStorage.removeItem('jwtToken');
     localStorage.removeItem('nomeUsuario');
     localStorage.removeItem('tipoUsuario');
     setAuthToken(null, null, null);
     setIsLoggedIn(false);
     // O Navigate cuidará do redirecionamento
  };

  const handleCloseSidebar = () => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }
  };

  // Layout principal com Sidebar e Header (Sua estrutura original)
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
          onLogout={handleLogout} // Passa a função de logout correta
        />
        {/* ⚠️ AVISO: Manteve <Routes> aqui conforme pedido, mas pode causar erros de rota no React Router v6. */}
        <div className="content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/ocorrencias" element={<Ocorrencias />} />
            <Route path="/nova-ocorrencia" element={<NovaOcorrencia />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuarios/cadastrar" element={<CadastrarUsuario />} />
            <Route path="/editar-usuario/:cpf" element={<EditarUsuario />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );

  // (Sua estrutura de return original)
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

