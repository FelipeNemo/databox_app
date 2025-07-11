import React, { useState } from "react";
import "./login.css";

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleToggleForm = () => {
    setIsRegistering((prev) => !prev);
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>{isRegistering ? "Cadastro" : "Login"}</h2>

        {!isRegistering ? (
          <>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <button>Entrar</button>
            <p className="toggle-text">
              Ainda não tem conta?{" "}
              <span onClick={handleToggleForm}>Cadastrar</span>
            </p>
          </>
        ) : (
          <>
            <input type="text" placeholder="Nome completo" />
            <input type="tel" placeholder="Telefone" />
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Senha" />
            <select>
              <option value="">Tipo de conta</option>
              <option value="estudante">Estudante</option>
              <option value="empresa">Empresa</option>
            </select>
            <button>Cadastrar</button>
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
