import { useState } from "react";
import { Link } from "react-router-dom";
import "./login.css";
import logo from "../../assets/logo.png";
import cadeado from "../../assets/cadeado.png";
import Olho from "../../assets/olho.png";
import icone from "../../assets/icone.png";
import { login as authLogin } from "../../services/AuthService";

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [emailCpf, setEmailCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if(!emailCpf || !password) {
      setLoading(false);
      alert("Por favor, preencha todos os campos.");
      return;
    }

    try {
        const responseData = await authLogin(emailCpf, password);

        const token = responseData.token || responseData.jwt;

        if (token) {
            localStorage.setItem('jwtToken', token);

            if (onLogin && typeof onLogin === 'function') {
                onLogin();
            }
        } else {
            alert("Token não encontrado na resposta do servidor.");
        }

    } catch (error) {
        const errorMsg = error.response 
                             ? error.response.data.message || 'Credenciais inválidas.'
                             : 'Erro de conexão com o servidor.';

        setError(errorMsg);
        alert(`Erro de Login: ${errorMsg}`);

    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="login-page-custom">
      <div className="login-box-custom">
        <h2>
          PAINEL DE COLETA E <br />
          GESTÃO DE OCORRÊNCIAS <br />
          <span>CBMPE</span>
        </h2>

        <form onSubmit={handleLogin}>
          <div className="input-group-custom">
            <img src={icone} alt="Ícone de Usuário" className="icon-custom" />
            <input 
              type="text" 
              placeholder="CPF"
              value={emailCpf}
              onChange={(e) => setEmailCpf(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="input-group-custom">
            <img src={cadeado} alt="Ícone de Cadeado" className="icon-custom" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <img
              src={Olho}
              alt="Ícone de Olho"
              className="icon-custom eye-custom"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            />
          </div>
          
          <Link to="/esqueceu-senha" className="forgot-custom">
            Esqueceu sua senha?
          </Link>
          
          <button type="submit" className="btn-custom" disabled={loading}>
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>
      </div>

      <div className="logo-box-custom">
        <img src={logo} alt="Logo" className="logo-custom" />
      </div>
    </div>
  );
}