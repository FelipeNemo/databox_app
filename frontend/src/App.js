import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

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

import AreaEmpresa from './components/Area/AreaEmpresa/AreaEmpresa';
import AreaEstudante from './components/Area/AreaEstudante/AreaEstudante';
import AreaAdministrador from './components/Area/AreaAdm/AreaAdm';
import AreaHelpers from './components/Area/AreaHelpers/AreaHelpers';

import UserLayout from './components/layouts/UserLayout';



import TopbarAdm from './components/topbarAdm/TopbarAdm';


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
  const location = useLocation();

  // Aqui você verifica se a rota começa com '/area-' para esconder Navbar e Footer
  const isPrivateRoute = location.pathname.startsWith("/area-");

  return (
    <>
      {!isPrivateRoute && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <BannerHome />
            </>
          }
        />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/estudantes" element={<Estudante />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />

        {/* Rotas privadas */}
        <Route path="/area-empresa" element={<AreaEmpresa />} />
        <Route path="/area-estudante" element={<AreaEstudante />} />
        <Route path="/area-administrador" element={<AreaAdministrador />} />
        <Route path="/area-helpers" element={<AreaHelpers />} />
        <Route path="/admin" element={<AreaAdministrador />} />

      </Routes>
      {!isPrivateRoute && <Footer />}
    </>
  );
}

export default App;