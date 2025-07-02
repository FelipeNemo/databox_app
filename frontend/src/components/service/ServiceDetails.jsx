import React from "react";
import services from "../../assets/services";
import "./service.css";

const ServiceDetails = () => {
  return (
    <div className="service-details-section">
      {services.map((service, idx) => (
        <section id={`service-detail-${idx}`} className="service-detail-block" key={service.name}>
          <div className="service-detail-content">
            <h4>{service.name}</h4>
            <p>{service.body} Aqui você encontra uma explicação detalhada sobre o produto/serviço.</p>
          </div>
          <div className="service-detail-image">
            <img src={service.image} alt={service.name} />
          </div>
        </section>
      ))}
    </div>
  );
};

export default ServiceDetails;
