import React from 'react';
import './topbarAdm.css';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaSignOutAlt, FaCog, FaUserCircle, FaHome } from 'react-icons/fa';

const TopbarAdm = () => {
  const navigate = useNavigate();

  const goToHome = () => navigate('/');
  const handleLogout = () => navigate('/login');

  return (
    <div className="topbar-adm">
      <div className="topbar-left">
        <button className="topbar-button" onClick={goToHome}>
          <FaHome className="topbar-icon" />
          <span>Home</span>
        </button>
      </div>
      <div className="topbar-right">
        <FaUserCircle className="topbar-icon" title="Perfil" />
        <FaCog className="topbar-icon" title="Configurações" />
        <FaBell className="topbar-icon" title="Notificações" />
        <FaSignOutAlt className="topbar-icon" title="Sair" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default TopbarAdm;
