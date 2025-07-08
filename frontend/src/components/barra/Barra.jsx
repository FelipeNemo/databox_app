import { useState } from "react";
import "./barra.css";

const Barra = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu);
  };

  return (
    <div className="barra-container">
      <div className="barra-buttons">
        <div className="dropdown-wrapper">
          <button
            className="barra-button"
            onClick={() => toggleDropdown("aprender")}
          >
            O que você pode aprender
          </button>
          {activeDropdown === "aprender" && (
            <div className="dropdown-menu">
              <a href="#">Python</a>
              <a href="#">Engenharia de Prompt</a>
              <a href="#">Aplicações Web</a>
              <a href="#">Modelagem de Dados</a>
              <a href="#">Estatística</a>
              <a href="#">Visualização de Dados</a>
            </div>
          )}
        </div>

        <button className="barra-button">Assinaturas</button>

        <div className="dropdown-wrapper">
          <button
            className="barra-button"
            onClick={() => toggleDropdown("sobre")}
          >
            Sobre a Databox Educação
          </button>
          {activeDropdown === "sobre" && (
            <div className="dropdown-menu">
              <a href="#">Visão Geral</a>
              <a href="#">Nossa Abordagem</a>
              <a href="#">Databox Live</a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Barra;
