import "./navbar.css"
import logo from "../../assets/images/logo.png"
import search from "../../assets/images/search.png"

const Navbar = () => {
  return (
    <div className="navbar-container">

      <div className="logo">
        <img src={logo} alt="medic-logo" />
      </div>

      <div className="nav-items">
        <h3>Solução</h3>
        <h3>Contrato</h3>
        <h3>Análise</h3>
        <h3>Integração</h3>
        <h3>Cliente</h3>
      </div>
      <div className="side-nav-items">
        <h3>Login</h3>
        <img src={search} alt="search" />
      </div>
    </div>
  )
}

export default Navbar