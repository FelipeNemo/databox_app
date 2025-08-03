 import React, { useState } from 'react';
import ModalBase from '../modal/modalBase';   // caminho correto para o modal
import Inventario from '../inventario/Inventario';  // inventário simples
import Menu from '../Menu/Menu';  // menu com perfil, config e sair
import './topbarAdm.css'; // CSS da topbar
import { FiBox, FiAlertCircle } from 'react-icons/fi';
import Logo from "../../assets/images/logo.png";

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
    <div
      className="topbar-adm"
      style={{
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
      }}
    >
      {/* Lado esquerdo: logo apenas */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src={Logo} alt="Logo da DataBox" className="logo-img" />
      </div>

      {/* Lado direito: botões + menu */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Botão de Inventário com ícone */}
        <button onClick={() => setInventarioOpen(true)} className="topbar-btn" title="Inventário">
          <FiBox size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="topbar-btn"
            title="Notificações"
          >
            <FiAlertCircle size={20} style={{ marginRight: '5px' }} />
            ({notifications.length})
          </button>

          {dropdownOpen && (
            <div
              style={{
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
              }}
            >
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

        {/* Menu agora está à direita das notificações */}
        <Menu />
      </div>

      {/* Modal de Inventário - com título customizado, sem ícone e botão OK */}
      <ModalBase
        isOpen={inventarioOpen}
        onClose={() => setInventarioOpen(false)}
        title="INVENTÁRIO"
        icon={<FiBox size={25} style={{ marginRight: '8px', verticalAlign: 'middle' }} />} // ícone inventário
        buttons={[]}
        showHeader={true}
      >
        <Inventario />
      </ModalBase>

      {/* Modal de Notificação - com título, ícone e botões dinâmicos */}
      <ModalBase
        isOpen={modalNotificacaoOpen}
        onClose={fecharModalNotificacao}
        title="NOTIFICAÇÃO"
        icon={<FiAlertCircle size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />}
        buttons={notificacaoSelecionada?.tipo === 'confirm' ? ['Sim', 'Não'] : ['Ok']}
        showHeader={true}
      >
        {notificacaoSelecionada && (
          <div>
            <h3>{notificacaoSelecionada.titulo}</h3>
            <p>{notificacaoSelecionada.descricao}</p>
            <p><small>{notificacaoSelecionada.data}</small></p>
          </div>
        )}
      </ModalBase>
    </div>
  );
};

export default TopbarAdm;
