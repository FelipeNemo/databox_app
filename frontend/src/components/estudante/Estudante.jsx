import React, { useState } from "react";
import Partners from "../partners/Partners";
import Login from "../login/Login";
import Barra from "../barra/Barra";
import FraseAnimada from "./FraseAnimada";
import "./estudante.css";

const Estudante = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="estudante-page">
      {/* Frase animada antes da Barra */}
      <FraseAnimada />

      {/* Botão entre FraseAnimada e Barra */}
      <div className="btn-start-wrapper">
        <button className="btn-primary" onClick={() => setLoginVisible(true)}>
          Começar agora
        </button>
      </div>

      {/* Barra de navegação */}
      <Barra />

      {/* Cards explicativos logo abaixo da barra */}
      <section className="cards-section">
        <div className="card">
          <h3>Prepare-se pra provas</h3>
          <p>✓ Gere quizzes e simulados automaticamente</p>
          <p>✓ Transforme PDFs em guias de estudo</p>
          <p>✓ Receba resumos e explicações por etapas</p>
        </div>
        <div className="card">
          <h3>Se prepare para o mercado</h3>
          <p>✓ Aprenda a montar dashboards com IA</p>
          <p>✓ Desenvolva projetos com dados reais</p>
          <p>✓ Construa agentes que automatizam tarefas</p>
        </div>
        <div className="card">
          <h3>Conheça outras pessoas que estão na mesma jornada</h3>
          <p>✓ Participe de desafios em grupo</p>
          <p>✓ Compartilhe projetos e receba feedback</p>
          <p>✓ Cresça com uma comunidade de estudantes</p>
        </div>
      </section>

      {/* Seção de parceiros */}
      <section className="partners-section">
        <Partners />
      </section>

      {/* Seção de perguntas frequentes */}
      <section className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-list">
          {[
            {
              question: "O que vou aprender gratuitamente?",
              answer: "Ferramentas de IA, criação de dashboards, agentes, e muito mais.",
            },
            {
              question: "Preciso ter conhecimento técnico?",
              answer: "Não! É feito para iniciantes também.",
            },
            {
              question: "Como me inscrevo?",
              answer: "Clique no botão 'Comece o teste já' e preencha seu cadastro.",
            },
          ].map((faq, i) => (
            <div className="faq-item" key={i}>
              <button className="faq-question" onClick={() => toggleFAQ(i)}>
                {faq.question}
              </button>
              {openIndex === i && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Modal de login */}
      {loginVisible && (
        <div className="login-modal">
          <Login />
        </div>
      )}
    </div>
  );
};

export default Estudante;
