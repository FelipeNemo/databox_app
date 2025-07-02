import "./banner.css"
import ellipse from "../../assets/images/ellipse.png"
import doctor from "../../assets/images/banner-doctor.png"

const Banner = () => {
    return (
        <div className="banner-container">

            <div className="banner-content">

                <div className="banner-heading">
                    <h2>Tranforme seu<br/> negócio com<br/>Inteligência Artificial</h2>
                </div>

                <div className="banner-subheading">
                    <p>Melhore a tomada de decisão do seu negócio com método científico, estatística e computação.</p>
                </div>

                <div className="banner-buttons">
                    <button className="banner-appointment-button">Fale conosco</button>
                    <button className="banner-learn-button">Saiba mais</button>
                </div>

            </div>

            <div className="banner-graphic">
                <img src={ellipse} alt="ellipse" />
            </div>

        </div>
    )
}

export default Banner