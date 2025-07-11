import React from "react";
import { Link } from "react-router-dom";
import './sobre.css';
import datarank from "../../assets/images/datarank.png";
import databox from "../../assets/images/databox.png";

const Sobre = () => {
  return (
    <section className="planos-container">
      <h2 className="titulo-centralizado">Sobre a Databox</h2>
      <p className="intro-centralizada">
        A <strong>Databox</strong> nasceu com a missão de transformar dados em decisões
        inteligentes, atuando em duas frentes: soluções empresariais personalizadas e educação
        prática para formar os profissionais do futuro.
      </p>

      <div className="planos-grid dois-cards">
        <Link to="/empresas" className="plano-card">
          <img src={databox} alt="Ícone Databox" className="card-icon-top" />
          <h3>Databox</h3>
          <p>
            Soluções empresariais sob medida. Mapeamos processos, criamos dashboards, automatizamos tarefas
            com IA e elevamos sua operação com dados. Ideal para empresas que desejam decisões baseadas em
            dados, redução de retrabalho e inteligência aplicada ao negócio.
          </p>
        </Link>

        <Link to="/estudantes" className="plano-card">
          <img src={datarank} alt="Ícone Datarank" className="card-icon-top" />
          <h3>Datarank</h3>
          <p>
            Plataforma gamificada de formação em dados. Com exercícios práticos, rankings, premiações e conexões
            com o mercado, o <strong>Datarank</strong> transforma o aprendizado em uma experiência envolvente.
            Voltado para estudantes que buscam se destacar na área com uma metodologia prática e moderna.
          </p>
        </Link>
      </div>
    </section>
  );
};

export default Sobre;
