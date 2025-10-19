import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import logo from "../../assets/logo.png";
import cadeado from "../../assets/cadeado.png";
import Olho from "../../assets/olho.png";
import icone from "../../assets/icone.png";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailCpf, setEmailCpf] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (emailCpf && password) {
      if (onLogin && typeof onLogin === 'function') {
        onLogin();
      }
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>
          PAINEL DE COLETA E <br />
          GESTÃO DE OCORRÊNCIAS <br />
          <span>CBMPE</span>
        </h2>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <img src={icone} alt="Ícone de Usuário" className="icon" />
            <input 
              type="text" 
              placeholder="E-mail ou CPF"
              value={emailCpf}
              onChange={(e) => setEmailCpf(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <img src={cadeado} alt="Ícone de Cadeado" className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={Olho}
              alt="Ícone de Olho"
              className="icon eye"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>
          
          <Link to="/esqueceu-senha" className="forgot">
            Esqueceu sua senha?
          </Link>
          
          <button type="submit" className="btn">
            Entrar
          </button>
        </form>
      </div>

      <div className="logo-box">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
}