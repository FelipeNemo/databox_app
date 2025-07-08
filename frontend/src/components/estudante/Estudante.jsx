import React, { useState } from "react";
import Partners from "../partners/Partners";
import Login from "../login/Login";
import Barra from "../barra/Barra";
import "./estudante.css";

const Estudante = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "O que vou aprender gratuitamente?",
      answer:
        "Você vai aprender como usar ferramentas de IA, criar dashboards, desenvolver agentes inteligentes e muito mais.",
    },
    {
      question: "Preciso ter conhecimento técnico?",
      answer:
        "Não! Os conteúdos são voltados tanto para iniciantes quanto para quem já está na área de dados.",
    },
    {
      question: "Como me inscrevo?",
      answer:
        "Clique no botão 'Comece o teste já' e faça seu cadastro com nome, email e tipo de conta.",
    },
  ];

  return (
    <div className="estudante-page">
      {/* Barra suspensa no topo da página estudante */}
      <Barra />

      <section className="intro">
        <div className="intro-subheading">
          <h1>Nossa oferta especial para estudantes</h1>
          <p>
            Acesse gratuitamente os conteúdos da Databox para se desenvolver profissionalmente,
            aprenda a usar IA, construir dashboards, criar agentes de forma sem custos.
          </p>
          <button className="btn-primary" onClick={() => setLoginVisible(true)}>
            Comece o teste já
          </button>
        </div>
      </section>

      {loginVisible && (
        <div className="login-modal">
          <Login />
        </div>
      )}

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

      <section className="partners-section">
        <Partners />
      </section>

      <section className="faq-section">
        <h2>Perguntas Frequentes</h2>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <div className="faq-item" key={index}>
              <button className="faq-question" onClick={() => toggleFAQ(index)}>
                {faq.question}
              </button>
              {openIndex === index && (
                <div className="faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Estudante;













