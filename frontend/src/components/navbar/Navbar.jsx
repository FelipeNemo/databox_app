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
        <h3>Para Empresas</h3>
        <h3>Para Estudantes</h3>
        <h3>Soluções</h3>
        <h3>Artigos</h3>
        <h3>Contato</h3>
      </div>
      <div className="side-nav-items">
        <h3>Login</h3>
        <img src={search} alt="search" />
      </div>
    </div>
  )
}

export default Navbar