import "./footer.css"
import footerImage from "../../assets/images/footer logo.png"
import ellipse4 from "../../assets/images/Ellipse 4.png"
import ellipse5 from "../../assets/images/ellipse5.png"

const Footer = () => {
    return (
        <>
            <div className="footer-container">

                <div className="footer-logo">
                    <img src={footerImage} alt="footer-logo" />
                    <p>Ciências de dados<br />para negócios de impacto.</p>
                </div>

                <div className="footer-medic">
                    <ul className="footer-lists">
                        <li>Dados</li>
                        <li>Home</li>
                        <li>Data Lab</li>
                        <li>IA Lab</li>
                    </ul>
                </div>
                <div className="footer-about">
                    <ul className="footer-lists">
                        <li>Sobre</li>
                        <li>Suporte</li>
                        <li>FAQ</li>
                    </ul>
                </div>

                <div className="footer-social-media">
                    <ul className="footer-lists">
                        <li>Redes Sociais</li>
                        <li>Github</li>
                        <li>LinkedIn</li>
                        <li>Instagram</li>
                        <li>Tiktok</li>
                    </ul>
                </div>
                <div className="footer-contact">
                    <ul className="footer-lists">
                        <li>Contato</li>
                        <li>PUCRS - Av. Ipiranga, 6681 - Partenon, Porto Alegre - RS, 90619-900</li>
                        <li>databoxbrazil@gmail.com</li>
                    </ul>
                </div>

                <img className="footer-ellipse1" src={ellipse4} alt="ellipse4" />
                <img className="footer-ellipse2" src={ellipse5} alt="ellipse5" />

            </div>

            <div className="footer-bottom">
                <p>&copy; Databox 2028</p>
                <p>Legal Policies</p>
                <p>Sitemap</p>
                <p>Cookies</p>
            </div>

        </>


    )
}

export default Footer