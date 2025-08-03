import React, { useState } from 'react';
import TopbarAdm from '../../topbarAdm/TopbarAdm';
import SidebarAdm from '../../sidebarAdm/SidebarAdm';
import GamificationStats from '../../GamificationStats/GamificationStats';
import Dashboards from '../../analytics/Dashboards';

import './AreaAdm.css';

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

const AreaAdministrador = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Exemplo de dados para gamificação
  const xpPercent = 75;
  const healthPercent = 60;
  const coins = 120;
  return (
    <div className="area-adm-layout">
      <SidebarAdm isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="area-adm-main">
        <TopbarAdm toggleSidebar={toggleSidebar} notifications={notificacoesTeste} />

        <div className="area-adm-content">
          <div className="gamification-wrapper">
            <GamificationStats
              xpPercent={xpPercent}
              healthPercent={healthPercent}
              coins={coins}
            />
          </div>

          <div className="dashboards-wrapper">
            <Dashboards />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AreaAdministrador;





