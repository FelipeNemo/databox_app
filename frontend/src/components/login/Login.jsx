import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

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
      const response = await fetch("http://localhost:8001/api/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameLogin,
          password: senhaLogin,
        }),
      });

      if (!response.ok) {
        throw new Error("Usuário ou senha incorretos");
      }

      const data = await response.json();
      localStorage.setItem("token", data.access);
      alert("Login realizado com sucesso!");
    } catch (error) {
      alert(error.message);
    }
  };

  // CADASTRO
  const handleRegister = async () => {
    try {
      let url = "";
      if (tipoConta === "estudante") {
        url = "http://localhost:8001/api/estudante/register/";
      } else if (tipoConta === "empresa") {
        url = "http://localhost:8001/api/empresa/register/";
      } else {
        alert("Selecione um tipo de conta válido");
        return;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameCadastro,
          nome,
          telefone,
          email: emailCadastro,
          password: senhaCadastro,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro no cadastro");
      }

      alert("Cadastro realizado com sucesso!");
      setIsRegistering(false);
      // Limpa os campos
      setUsernameCadastro("");
      setNome("");
      setTelefone("");
      setEmailCadastro("");
      setSenhaCadastro("");
      setTipoConta("");
    } catch (error) {
      alert(error.message);
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
              placeholder="Nome de usuário"
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
