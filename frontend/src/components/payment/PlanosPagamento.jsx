import React, { useState } from 'react';
import ModalBase from '../modal/modalBase';   // caminho correto pra seu modal
import Inventario from '../inventario/Inventario';  // inventário simples
import Menu from '../Menu/Menu';
import './topbarAdm.css'; // Certifique-se que existe esse CSS

const TopbarAdm = ({ notifications = [] }) => {
  const [inventarioOpen, setInventarioOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalNotificacaoOpen, setModalNotificacaoOpen] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);

  const abrirModalNotificacao = (notificacao) => {
    setNotificacaoSelecionada(notificacao);
    setModalNotificacaoOpen(true);
    setDropdownOpen(false);
  };

  const fecharModalNotificacao = () => {
    setModalNotificacaoOpen(false);
    setNotificacaoSelecionada(null);
  };

  return (
    <div className="topbar-adm" style={{
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '60px',
      backgroundColor: '#00000078',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 20px',
      zIndex: 1000
    }}>
      <div className="topbar-left">
        <h1 className="logo">DataBox</h1>
      </div>

      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => setInventarioOpen(true)} className="topbar-btn">
          🎒 Inventário
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="topbar-btn"
            title="Notificações"
          >
            🔔 Notificações ({notifications.length})
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#222',
              color: 'white',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              minWidth: '250px',
              maxHeight: '300px',
              overflowY: 'auto',
              zIndex: 1100,
            }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '10px' }}>Nenhuma notificação</div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '10px',
                      borderBottom: '1px solid #444',
                      cursor: 'pointer',
                      backgroundColor: index === 0 ? '#333' : 'transparent'
                    }}
                    onClick={() => abrirModalNotificacao(notif)}
                  >
                    <strong>{notif.titulo}</strong>
                    <br />
                    <small>{notif.data}</small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal Inventário */}
      <ModalBase isOpen={inventarioOpen} onClose={() => setInventarioOpen(false)}>
        <Inventario />
      </ModalBase>

      {/* Modal Notificação */}
      <ModalBase isOpen={modalNotificacaoOpen} onClose={fecharModalNotificacao}>
        {notificacaoSelecionada && (
          <div>
            <h3>{notificacaoSelecionada.titulo}</h3>
            <p>{notificacaoSelecionada.descricao}</p>
            <p><small>{notificacaoSelecionada.data}</small></p>

            {notificacaoSelecionada.tipo === 'confirm' ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={fecharModalNotificacao}>Sim</button>
                <button onClick={fecharModalNotificacao}>Não</button>
              </div>
            ) : (
              <button onClick={fecharModalNotificacao}>Ok</button>
            )}
          </div>
        )}
      </ModalBase>
    </div>
  );
};

export default TopbarAdm;
