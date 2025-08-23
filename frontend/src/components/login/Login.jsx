import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Estados para Login
  const [usernameLogin, setUsernameLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  // Estados para Cadastro
  const [usernameCadastro, setUsernameCadastro] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [tipoConta, setTipoConta] = useState("");

  const handleToggleForm = () => {
    setIsRegistering((prev) => !prev);
  };

  // LOGIN
  const handleLogin = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/auth/login/", {
        username: usernameLogin,
        password: senhaLogin,
      });

      // 🔹 Salvar tokens e tipo de conta
      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      localStorage.setItem("tipo_conta", response.data.tipo_conta);

      alert("Login realizado com sucesso!");

      // 🔹 Redirecionamento baseado no tipo de conta
      switch (response.data.tipo_conta) {
        case "empresa":
          navigate("/area-empresa");
          break;
        case "estudante":
          navigate("/area-estudante");
          break;
        case "admin":
          navigate("/area-administrador");
          break;
        default:
          navigate("/area-helpers");
          break;
      }
    } catch (error) {
      alert(
        error.response?.data?.error ||
          "Usuário ou senha incorretos ou erro na conexão"
      );
    }
  };

  // CADASTRO
  const handleRegister = async () => {
    try {
      let url = "";
      if (tipoConta === "estudante") {
        url = "http://127.0.0.1:8000/auth/estudante/register/";
      } else if (tipoConta === "empresa") {
        url = "http://127.0.0.1:8000/auth/empresa/register/";
      } else {
        alert("Selecione um tipo de conta válido");
        return;
      }

      await axios.post(url, {
        username: usernameCadastro,
        nome,
        telefone,
        email: emailCadastro,
        password: senhaCadastro,
        tipo_conta: tipoConta,
      });

      alert("Cadastro realizado com sucesso!");
      setIsRegistering(false);
      setUsernameCadastro("");
      setNome("");
      setTelefone("");
      setEmailCadastro("");
      setSenhaCadastro("");
      setTipoConta("");
    } catch (error) {
      alert(
        error.response?.data?.error || "Erro no cadastro ou na conexão"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>{isRegistering ? "Cadastro" : "Login"}</h2>

        {!isRegistering ? (
          <>
            <input
              type="text"
              placeholder="Email ou Nome de usuário"
              value={usernameLogin}
              onChange={(e) => setUsernameLogin(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senhaLogin}
              onChange={(e) => setSenhaLogin(e.target.value)}
            />
            <button onClick={handleLogin}>Entrar</button>
            <p className="toggle-text">
              Ainda não tem conta?{" "}
              <span onClick={handleToggleForm}>Cadastrar</span>
            </p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Nome de usuário"
              value={usernameCadastro}
              onChange={(e) => setUsernameCadastro(e.target.value)}
            />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={emailCadastro}
              onChange={(e) => setEmailCadastro(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              value={senhaCadastro}
              onChange={(e) => setSenhaCadastro(e.target.value)}
            />
            <select
              value={tipoConta}
              onChange={(e) => setTipoConta(e.target.value)}
            >
              <option value="">Tipo de conta</option>
              <option value="estudante">Estudante</option>
              <option value="empresa">Empresa</option>
            </select>
            <button onClick={handleRegister}>Cadastrar</button>
            <p className="toggle-text">
              Já tem uma conta?{" "}
              <span onClick={handleToggleForm}>Login</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
