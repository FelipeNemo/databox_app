import React, { useState } from "react";
import "./ProjectGallery.css";

const projects = [
  {
    image: require("../../assets/images/project1.png"),
    url: "https://projeto1.com",
    alt: "Projeto 1"
  },
  {
    image: require("../../assets/images/project2.png"),
    url: "https://projeto2.com",
    alt: "Projeto 2"
  },
  {
    image: require("../../assets/images/project3.png"),
    url: "https://projeto3.com",
    alt: "Projeto 3"
  }
  // Adicione mais projetos conforme necessário
];

const ProjectGallery = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % projects.length);
  const prev = () => setCurrent((prev) => (prev - 1 + projects.length) % projects.length);

  return (
    <div>
      <h2 className="project-gallery-title" style={{ color: '#111' }}>Galeria de projetos</h2>
      <div className="project-gallery-container">
        <button className="gallery-btn" onClick={prev}>&lt;</button>
        <a href={projects[current].url} target="_blank" rel="noopener noreferrer">
          <img src={projects[current].image} alt={projects[current].alt} className="project-image" />
        </a>
        <button className="gallery-btn" onClick={next}>&gt;</button>
      </div>
    </div>
  );
};

export default ProjectGallery;
