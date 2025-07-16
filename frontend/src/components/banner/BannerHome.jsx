import "./bannerHome.css";
import Login from "../login/Login";



const BannerHome = () => {
  return (
    <div className="banner-container">
      <div className="banner-home-flex"> {/* NOVO wrapper em flex */}

        {/* Coluna da esquerda – Texto */}
        <div className="banner-home-text">
          <div className="banner-heading">
            <h2>Tudo sobre<br />Ciência de Dados</h2>
          </div>

          <div className="banner-subheading">
            <p>Acesse sua conta gratuitamente <br /> para explorar nossos recursos de IA.</p>
          </div>
        </div>

        {/* Coluna da direita – Login */}
        <div className="banner-home-login">
          <Login />
        </div>

      </div>
    </div>
  );
};

export default BannerHome;
