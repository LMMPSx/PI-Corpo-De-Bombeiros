import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import Login from './pages/Login/login'
import EsqueceuSenha from './pages/Login/esqueceu'
import Dashboard from './pages/Dashboard/Dashboard'
import Ocorrencias from './pages/Ocorrencias/Ocorrencias'
import NovaOcorrencia from './pages/NovaOcorrencia/NovaOcorrencia'
import Relatorios from './pages/Relatorios/Relatorios'
import Usuarios from './pages/Usuarios/Usuario'
import Configuracoes from './pages/Configuracoes/Config'
import Sobre from './pages/Sobre/Sobre'
import Sidebar from './components/Sidebar/Sidebar'
import Header from './components/Header/Header'
import { ConfigProvider } from './contexts/ConfigContext'
import Loading from './components/Loading/Loading'
import './App.css'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleLogin = () => {
    console.log('Login realizado com sucesso!')
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleCloseSidebar = () => {
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false)
    }
  }

  const MainLayout = () => (
    <div className="app">
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
      <div className={`main-content ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
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
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )

  return (
    <ConfigProvider>
      <div className="App">
        <Loading />
        <Routes>
          <Route 
            path="/login" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" replace /> : 
              <Login onLogin={handleLogin} />
            } 
          />
          
          <Route 
            path="/esqueceu-senha" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" replace /> : 
              <EsqueceuSenha />
            } 
          />
          
          <Route 
            path="/" 
            element={
              isLoggedIn ? 
              <Navigate to="/dashboard" replace /> : 
              <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/*" 
            element={
              isLoggedIn ? 
              <MainLayout /> : 
              <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </div>
    </ConfigProvider>
  )
}