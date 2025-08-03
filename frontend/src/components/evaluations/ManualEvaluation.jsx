import React, { useState } from 'react';
import TopbarAdm from '../../topbarAdm/TopbarAdm';
import SidebarAdm from '../../sidebarAdm/SidebarAdm';
import GamificationStats from '../../GamificationStats/GamificationStats'; // ajuste o caminho se necessário
import './AreaAdm.css';

const AreaAdministrador = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="area-adm-layout">
      <SidebarAdm isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="area-adm-main">
        <TopbarAdm toggleSidebar={toggleSidebar} />
        <div className="area-adm-content">
          <h2>Bem-vindo, Administrador!</h2>
          <p>Você pode gerenciar os dados por aqui.</p>
          <GamificationStats />
        </div>
      </div>
    </div>
  );
};

export default AreaAdministrador;
