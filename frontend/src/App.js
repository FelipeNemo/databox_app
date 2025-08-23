// App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Banner from './components/banner/Banner';
import BannerHome from './components/banner/BannerHome';
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
import AreaAdministrador from './components/Area/AreaAdm/AreaAdm';  // Importa área administrativa
import AreaHelpers from './components/Area/AreaHelpers/AreaHelpers';

import UserLayout from './components/layouts/UserLayout';

import TopbarAdm from './components/topbarAdm/TopbarAdm';
import SidebarAdm from './components/sidebarAdm/SidebarAdm';
import GamificationStats from './components/GamificationStats/GamificationStats';

// 1) Define as notificações de exemplo aqui no App.js (pode estar em outro lugar se preferir)
const notificacoesTeste = [
  {
    titulo: 'Bem-vindo!',
    descricao: 'Obrigado por acessar o DataBox.',
    data: '31/07/2025',
    tipo: 'info'
  },
  {
    titulo: 'Confirmação',
    descricao: 'Você deseja atualizar seus dados?',
    data: '30/07/2025',
    tipo: 'confirm'
  }
];

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
  const isPrivateRoute = location.pathname.startsWith("/area-");

  return (
    <>
      {!isPrivateRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<BannerHome />} />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/estudantes" element={<Estudante />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<Login />} />

        {/* 2) Aqui você passa as notificações para a rota da área administrativa */}
        <Route 
          path="/area-administrador" 
          element={
            // Passa como prop para o componente da área
            <AreaAdministrador notifications={notificacoesTeste} />
          } 
        />

        <Route path="/area-empresa" element={<AreaEmpresa />} />
        <Route path="/area-estudante" element={<AreaEstudante />} />
        <Route path="/area-helpers" element={<AreaHelpers />} />
      </Routes>
      {!isPrivateRoute && <Footer />}
    </>
  );
}

export default App;
