import "./partners.css"
import partner1 from "../../assets/images/partner1.png"
import partner2 from "../../assets/images/partner2.png"
import partner3 from "../../assets/images/partner3.png"
import partner4 from "../../assets/images/partner4.png"
import partner5 from "../../assets/images/partner5.png"

const Partners = () => {
  return (
    <div className="partners-container">
        <h3>Ferramentas</h3>
        <p>Ferramentas usadas para pesquisa e desenvolvimento.</p>
        <div className="partners-wrapper">
            <div className="partner-logo">
                <img src={partner1} alt="parceiro1" />
                <img src={partner2} alt="parceiro2" />
                <img src={partner3} alt="parceiro3" />
                <img src={partner4} alt="parceiro4" />
                <img src={partner5} alt="parceiro5" />
            </div>
        </div>
    </div>
  )
}

export default Partners