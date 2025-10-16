import { Link } from "react-router-dom";
import "./esqueceu.css";
import logo from "../../assets/logo.png";
import icone from "../../assets/icone.png";

export default function EsqueceuSenha() {
  const handleConfirm = (e) => {
    e.preventDefault();
    alert("Email de recuperação enviado! Verifique sua caixa de entrada.");
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <Link to="/login" className="back-link">← Voltar para o Login</Link>
        
        <h2>Esqueceu sua senha?</h2>

        <form onSubmit={handleConfirm}>
          <div className="input-group">
            <img src={icone} alt="Ícone de Perfil" className="icon" />
            <input type="text" placeholder="E-mail ou CPF" required />
          </div>

          <p className="forgot-message">
            Um e-mail com uma nova senha será enviado para sua caixa de mensagens.
          </p>

          <button type="submit" className="btn">Confirmar</button>
        </form>
      </div>

      <div className="logo-box">
        <img src={logo} alt="Logo" className="logo" />
      </div>
    </div>
  );
}