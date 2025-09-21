import { useState } from "react";
import "./Login.css";
import logo from "./assets/logo.png";
import cadeado from "./assets/cadeado.png";


<img src={logo.png} alt="CBMPE" />




export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          <span className="icon">👤</span>
          <input type="text" placeholder="E-mail ou CPF" />
        </div>

        {/* Campo Senha */}
        <div className="input-group">
          <img src={cadeado.png} alt="" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
          />
          <span
            className="icon eye"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
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
  );
}
