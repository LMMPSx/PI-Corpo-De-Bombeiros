import { useState } from "react";
import "./login.css"; 
import logo from "./assets/logo.png";
import cadeado from "./assets/cadeado.png";
import Olho from "./assets/olho.png";
import icone from "./assets/icone.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="login-page">
        {/* Box do formulário */}
        <div className="login-box">
          <h2>
            PAINEL DE COLETA E <br />
            GESTÃO DE OCORRÊNCIAS <br />
            <span>CBMPE</span>
          </h2>

          {/* Campo Email/CPF */}
          <div className="input-group">
            {/* Ícone de usuário */}
            <img src={icone} alt="Ícone de Usuário" className="icon" />
            <input type="text" placeholder="E-mail ou CPF" />
          </div>

          {/* Campo Senha */}
          <div className="input-group">
            {/* Ícone de cadeado */}
            <img src={cadeado} alt="Ícone de Cadeado" className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
            />
            {/* Ícone de olho */}
            <img
              src={Olho}
              alt="Ícone de Olho"
              className="icon eye"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>

          <a href="#" className="forgot">
            Esqueceu sua senha?
          </a>

          <button className="btn">Entrar</button>
        </div>

        {/* Logo à direita */}
        <div className="logo-box">
          <img src={logo} alt="Logo" className="logo" />
        </div>
      </div>
    </>
  );
}
