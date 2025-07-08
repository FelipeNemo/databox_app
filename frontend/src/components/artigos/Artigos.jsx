import React from "react";
import './artigos.css';
import artigo1 from '../../assets/images/artigo1.png';

const artigosData = [
  {
    id: 1,
    titulo: "Análise de Dados no Agronegócio",
    descricao: "Estudo aprofundado sobre o uso de dados para otimizar produção e logística.",
    linkLattes: "https://lattes.cnpq.br/1234567890123456",
    imagem: artigo1
  }
];

const Artigos = () => {
  return (
    <section className="artigos-container">
      <h2>Artigos Científicos</h2>
      <div className="artigos-grid">
        {artigosData.map(({ id, titulo, descricao, linkLattes, imagem }) => (
          <div key={id} className="artigo-card">
            <div className="thumbnail-placeholder">
              <img src={imagem} alt={`Miniatura de ${titulo}`} className="thumbnail-img" />
            </div>
            <div className="artigo-info">
              <h3>{titulo}</h3>
              <p>{descricao}</p>
              <a
                href={linkLattes}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-lattes"
              >
                Ver no Lattes
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Artigos;
