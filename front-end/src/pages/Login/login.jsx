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
        const errorMsg = err.response 
                             ? err.response.data.message || 'Credenciais inválidas.' // Tenta pegar a mensagem do Spring
                             : 'Erro de conexão com o servidor.'; // Falha de rede/CORS

            setError(errorMsg);
            alert(`Erro de Login: ${errorMsg}`);

    } finally {
        setLoading(false);

    }


    
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