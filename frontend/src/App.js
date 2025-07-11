import { Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Banner from './components/banner/Banner';
import BannerHome from './components/banner/BannerHome'; // ← NOVO
import Partners from './components/partners/Partners';
import Services from './components/services/Services';
import Login from './components/login/Login';
import Sobre from './components/sobre/Sobre'; 
import Artigos from './components/artigos/Artigos'; 
import Contato from './components/contato/Contato';
import Barra from './components/barra/Barra';

import Estudante from './components/estudante/Estudante';


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
        <Route path="/estudantes" element={<Estudante />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
