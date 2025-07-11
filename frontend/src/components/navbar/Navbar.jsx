import "./navbar.css";
import logo from "../../assets/images/logo.png";
import search from "../../assets/images/search.png";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const lowerQuery = query.toLowerCase();

    // Remove marcações anteriores
    const highlights = document.querySelectorAll(".highlight-search");
    highlights.forEach(el => {
      const parent = el.parentNode;
      parent.replaceChild(document.createTextNode(el.innerText), el);
      parent.normalize();
    });

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let found = false;

    while (walker.nextNode()) {
      const node = walker.currentNode;
      const text = node.nodeValue;
      const index = text.toLowerCase().indexOf(lowerQuery);

      if (index !== -1 && !found) {
        found = true;

        const before = document.createTextNode(text.slice(0, index));
        const match = document.createElement("mark");
        match.className = "highlight-search";
        match.textContent = text.slice(index, index + query.length);
        const after = document.createTextNode(text.slice(index + query.length));

        const parent = node.parentNode;
        parent.replaceChild(after, node);
        parent.insertBefore(match, after);
        parent.insertBefore(before, match);

        match.scrollIntoView({ behavior: "smooth", block: "center" });
        break;
      }
    }

    if (!found) {
      alert(`"${query}" não foi encontrado na página.`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="navbar-container">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="medic-logo" />
        </Link>
      </div>

      <div className="nav-items">
        <Link to="/empresas"><h3>Para Empresas</h3></Link>
        <Link to="/estudantes"><h3>Para Estudantes</h3></Link>
        <Link to="/sobre"><h3>Sobre</h3></Link>
        <Link to="/artigos"><h3>Artigos</h3></Link>
        <Link to="/contato"><h3>Contato</h3></Link>
      </div>

      <div className="side-nav-items">
        <Link to="/login"><h3>Login</h3></Link>

        <div className={`search-wrapper ${showSearch ? "show" : ""}`}>
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </div>

        <img
          src={search}
          alt="search"
          className="search-icon"
          onClick={() => {
            if (showSearch && query.trim() !== "") handleSearch();
            else setShowSearch(!showSearch);
          }}
        />
      </div>
    </div>
  );
};

export default Navbar;