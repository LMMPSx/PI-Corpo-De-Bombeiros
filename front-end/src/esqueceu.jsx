
import "./Esqueceu.css";
import logo from "./assets/logo.png";
import icone from "./assets/icone.png";

export default function EsqueceuSenha() {
  return (
    <div className="login-page">
      {/* Box do formulário */}
      <div className="login-box">
        <h2>
          Esqueceu sua senha?
        </h2>

        {/* Campo Email/CPF */}
        <div className="input-group">
          <img
            src={icone}
            alt="Ícone de Perfil"
            className="icon"
          />
          <input type="text" placeholder="E-mail ou CPF" />
        </div>

        <p className="forgot-message">
          Um e-mail com uma nova senha será enviado para sua caixa de mensagens.
        </p>

        <button className="btn">Confirmar</button>
      </div>

      {/* Logo à direita */}
      <div className="logo-box">
        <img
          src={logo}
          alt="Logo"
          className="logo"
        />
      </div>
    </div>
  );
}
