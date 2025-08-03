import React, { useState, useRef, useEffect } from 'react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import './menu.css';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const playMenuSound = () => {
    const audio = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
    audio.play();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="menu-container" ref={menuRef}>
      <button onClick={() => {
        playMenuSound();
        setOpen(prev => !prev);
      }} className="menu-btn">
        ☰
      </button>

      {open && (
        <div className="menu-dropdown">
          <div className="menu-item" onClick={() => alert('Perfil')}>
            <FiUser style={{ marginRight: '8px' }} />
            Perfil
          </div>
          <div className="menu-item" onClick={() => alert('Configurações')}>
            <FiSettings style={{ marginRight: '8px' }} />
            Configurações
          </div>
          <div className="menu-item" onClick={() => alert('Sair')}>
            <FiLogOut style={{ marginRight: '8px' }} />
            Sair
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
