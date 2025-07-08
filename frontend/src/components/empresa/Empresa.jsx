import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Empresas = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <>
      <section id="banner">
        <Banner />
      </section>

      <section id="services">
        <Services />
      </section>
    </>
  );
};

export default Empresas;
