import React from "react";
import { Link } from "react-router-dom";
import './planos.css'; // ← importa o CSS que você salvou

const Planos = () => {
  return (
    <section className="planos-container">
      <h2>Nossos Planos</h2>
      <p className="intro">
        Na <strong>Databox</strong>, acreditamos que cada negócio tem uma jornada única com dados.
        Por isso, criamos três planos pensados para diferentes estágios de maturidade analítica.
        Todos são personalizados conforme a sua necessidade — do diagnóstico inicial à inteligência
        artificial aplicada ao dia a dia da sua empresa.
      </p>

      <div className="planos-grid">
        <div className="plano-card">
          <h3>Business Data Mapping</h3>
          <p>
            Mapeamento completo de processos, fluxos de dados e oportunidades para o uso de inteligência de dados no seu negócio. Ideal para empresas que estão começando ou desejam entender melhor sua estrutura interna e identificar pontos de melhoria.
          </p>
        </div>
        <div className="plano-card">
          <h3>IA Operacional Assistida</h3>
          <p>
            Automatize tarefas repetitivas e torne sua operação mais inteligente. Criamos soluções com IA sob medida — como bots, classificadores e sistemas preditivos — para reduzir retrabalho, otimizar tempo e aumentar a performance do seu time.
          </p>
        </div>
        <div className="plano-card">
          <h3>Smart Metrics Dashboard</h3>
          <p>
            Visualize suas métricas em tempo real com dashboards interativos, conectados diretamente às suas fontes de dados. Acompanhe KPIs essenciais, identifique oportunidades e tome decisões baseadas em dados com clareza e confiança.
          </p>
        </div>
      </div>

    <div className="solicitar-proposta-wrapper">
    <Link to="/contato" className="cta-button">
        Solicitar Proposta
    </Link>
    </div>


      <div className="planos-contrato">
        <h3>📄 Contrato e Condições</h3>
        <p>
          Todos os serviços prestados pela <strong>Databox</strong> são formalizados via contrato
          100% PJ (Pessoa Jurídica), com escopo definido, prazos claros e garantia de confidencialidade
          quando necessário.
          <br /><br />
          Também oferecemos manutenção contínua para projetos que exigem acompanhamento estratégico
          ou evolução constante.
        </p>
      </div>
    </section>
  );
};

export default Planos;
