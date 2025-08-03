import React, { useState, useRef, useEffect } from 'react';
import ModalBase from '../modal/modalBase';


const playClickSound = () => {
  const clickSound = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
  clickSound.play().catch((err) => console.warn('Erro ao tocar som de clique:', err));
};

const TopbarAdm = ({ notifications }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const dropdownRef = useRef();

  // Fecha dropdown clicando fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Clicar na notificação: abre modal e fecha dropdown
  const handleNotificationClick = (notif) => {
    setSelectedNotification(notif);
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotification(null);
  };

  return (
    <div className="topbar-adm" style={{ position: 'relative' }}>
      {/* Logo */}
      <div className="topbar-left">
        <h1 className="logo">DataBox</h1>
      </div>

      {/* Botões da Topbar */}
      <div className="topbar-right" style={{ position: 'relative' }}>
        <button onClick={() => { playClickSound(); setDropdownOpen(prev => !prev); }}>
          🔔 Notificações ({notifications.length})
        </button>

        {/* Dropdown aparece abaixo do botão */}
        {dropdownOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              width: 300,
              maxHeight: 300,
              overflowY: 'auto',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: 4,
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
          >
            {notifications.length === 0 ? (
              <div style={{ padding: 12, color: '#666' }}>Nenhuma notificação</div>
            ) : (
              notifications.map((notif, index) => (
                <div
                  key={index}
                  onClick={() => handleNotificationClick(notif)}
                  style={{
                    padding: '10px 15px',
                    borderBottom: '1px solid #eee',
                    cursor: 'pointer',
                  }}
                >
                  <strong>{notif.titulo}</strong>
                  <br />
                  <small style={{ color: '#888' }}>{notif.data}</small>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Modal só aparece ao clicar na notificação */}
      {selectedNotification && (
        <ModalBase isOpen={modalOpen} onClose={closeModal}>
          <h3>{selectedNotification.titulo}</h3>
          <p>{selectedNotification.descricao}</p>
          <p><small>{selectedNotification.data}</small></p>

          {selectedNotification.tipo === 'confirm' ? (
            <div>
              <button onClick={() => { /* ação sim */ closeModal(); }}>Sim</button>
              <button onClick={closeModal}>Não</button>
            </div>
          ) : (
            <button onClick={closeModal}>Ok</button>
          )}
        </ModalBase>
      )}
    </div>
  );
};

export default TopbarAdm;
