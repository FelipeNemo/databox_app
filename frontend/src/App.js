import { Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Banner from './components/banner/Banner';
import Partners from './components/partners/Partners';
import Services from './components/services/Services';
import LoginPage from './components/login/LoginPage';

// Crie componentes temporários para páginas não criadas ainda
const Empresas = () => <div><h2>Página Para Empresas</h2></div>;
const Estudantes = () => <div><h2>Página Para Estudantes</h2></div>;
const Solucoes = () => <div><h2>Página de Soluções</h2></div>;
const Artigos = () => <div><h2>Página de Artigos</h2></div>;
const Contato = () => <div><h2>Página de Contato</h2></div>;

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Services />
              <Partners />
            </>
          }
        />
        <Route path="/empresas" element={<Empresas />} />
        <Route path="/estudantes" element={<Estudantes />} />
        <Route path="/solucoes" element={<Solucoes />} />
        <Route path="/artigos" element={<Artigos />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
