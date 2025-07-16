

import "./banner.css";
import ellipse from "../../assets/images/ellipse.png";

const Banner = () => {
  const handleFaleConosco = () => {
    window.location.href = "http://localhost:3000/contato";
  };

  const handleSaibaMais = () => {
    window.location.href = "http://localhost:3000/sobre";
  };

  return (
    <div className="banner-container-empresa">
      <div className="banner-content">
        <div className="banner-heading">
          <h2>
            Transforme seu<br />
            negócio com<br />
            Inteligência Artificial
          </h2>
        </div>

        <div className="banner-subheading">
          <p>
            Melhore sua tomada de decisão com método científico,
            estatística e computação.
          </p>
        </div>
        <div className="banner-buttons">
          <button
            className="banner-appointment-button"
            onClick={handleFaleConosco}
          >
            Fale conosco
          </button>
          <button
            className="banner-learn-button"
            onClick={handleSaibaMais}
          >
            Saiba mais
          </button>
        </div>
      </div>

      <div className="banner-graphic">
        <img src={ellipse} alt="ellipse" />
      </div>
    </div>
  );
};

export default Banner;






