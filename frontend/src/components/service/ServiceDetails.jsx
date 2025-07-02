import React from "react";
import services from "../../assets/services";
import img1 from "../../assets/images/1.png";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.png";
import "./service.css";

const ServiceDetails = () => {
  return (
    <div className="service-details-section">
      {services.map((service, idx) => {
        const imgs = [img1, img2, img3];
        const detailTexts = [
          "Entenda seus resultados com através de metodologia científica . Com nossa análise estratégica, você descobre gargalos, fortalezas e oportunidades de crescimento ocultas. Usamos dados atualizados para traçar um panorama claro do seu negócio e orientar decisões com foco em resultados reais.",
          "Automatize análises complexas com IA  e antecipe tendências do seu mercado. Nossa solução ajuda você a reduzir desperdícios, otimizar campanhas e tomar decisões mais assertivas, com base em dados confiáveis e algoritmos avançados.",
          "Pare de perder tempo com planilhas confusas e relatórios manuais. Tenha acesso a dashboards interativos e intuitivos que mostram, em tempo real, os principais indicadores do seu negócio. Entenda com clareza o desempenho das suas estratégias e tome decisões rápidas e embasadas."
        ];
        return (
          <section
            id={`service-detail-${idx}`}
            className="service-detail-block"
            key={service.name}
            style={{ flexDirection: idx % 2 === 0 ? 'row' : 'row-reverse' }}
          >
            <div className="service-detail-content">
              <h4>{service.name}</h4>
              <p>{detailTexts[idx]}</p>
            </div>
            <div className="service-detail-image">
              <img src={imgs[idx]} alt={service.name} />
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default ServiceDetails;
