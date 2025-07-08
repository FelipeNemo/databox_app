import { Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Banner from './components/banner/Banner';
import BannerHome from './components/banner/BannerHome'; // ← NOVO
import Partners from './components/partners/Partners';
import Services from './components/services/Services';
import Estudantes from './components/estudante/Estudante';
import Login from './components/login/Login';
import Planos from './components/planos/Planos'; // ajuste o caminho conforme sua pasta
import Artigos from './components/artigos/Artigos'; // ajuste o caminho conforme sua estrutura
import Contato from './components/contato/Contato';
import Barra from './components/barra/Barra';




const Empresas = () => (
  <>
    <section id="banner">
      <Banner />
    </section>
    <section id="services">
      <Services />
    </section>
  </>
);


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <BannerHome /> {/* ← Novo banner para a home */}

            </>
          }
        />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/estudantes" element={<Estudantes />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
