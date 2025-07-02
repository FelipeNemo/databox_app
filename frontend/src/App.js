import './App.css';
import Banner from './components/banner/Banner';
import Footer from './components/footer/Footer';
import Navbar from './components/navbar/Navbar';
import Partners from './components/partners/Partners';
import Services from './components/services/Services';

function App() {
  return (
    <>
      <Navbar />
      <Banner />
      <Services />
      <Partners />
      <Footer />
    </>
  );
}

export default App;