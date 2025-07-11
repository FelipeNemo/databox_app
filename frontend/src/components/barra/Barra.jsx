import { useState } from "react";
import "./barra.css";

const Barra = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  return (
    <div
      className="barra-container"
      // não precisa expandir nada aqui, o CSS controla
    >
      <div className="barra-buttons">
        {/* Dropdown 1 */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => setActiveDropdown("aprender")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="barra-button">O que você pode aprender</button>
          <div className={`dropdown-menu ${activeDropdown === "aprender" ? "show" : ""}`}>
            <a href="#">Python</a>
            <a href="#">Engenharia de Prompt</a>
            <a href="#">Aplicações Web</a>
            <a href="#">Modelagem de Dados</a>
            <a href="#">Estatística</a>
            <a href="#">Visualização de Dados</a>
          </div>
        </div>

        {/* Botão simples */}
        <button className="barra-button">Assinaturas</button>

        {/* Dropdown 2 */}
        <div
          className="dropdown-wrapper"
          onMouseEnter={() => setActiveDropdown("sobre")}
          onMouseLeave={() => setActiveDropdown(null)}
        >
          <button className="barra-button">Sobre a Databox Educação</button>
          <div className={`dropdown-menu ${activeDropdown === "sobre" ? "show" : ""}`}>
            <a href="#">Visão Geral</a>
            <a href="#">Nossa Abordagem</a>
            <a href="#">Databox Live</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barra;
