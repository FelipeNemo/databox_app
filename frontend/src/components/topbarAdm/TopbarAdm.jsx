import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ModalBase from '../modal/modalBase';
import Inventario from '../inventario/Inventario';
import Menu from '../Menu/Menu';
import './topbarAdm.css';
import { FiBox, FiAlertCircle } from 'react-icons/fi';
import Logo from "../../assets/images/logo.png";

const playClickSound = () => {
  const clickSound = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
  clickSound.play().catch((err) => console.warn('Erro ao tocar som de clique:', err));
};

const TopbarAdm = () => {
  const [notifications, setNotifications] = useState([]);
  const [inventarioOpen, setInventarioOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalNotificacaoOpen, setModalNotificacaoOpen] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // 🔹 1) Buscar notificações iniciais via REST e abrir a mais recente
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;

        const response = await axios.get("http://127.0.0.1:8000/api/notifications/user/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setNotifications(response.data);

        // 🔹 Abrir modal automaticamente com a notificação mais recente
        if (response.data.length > 0) {
          setNotificacaoSelecionada(response.data[0]);
          setModalNotificacaoOpen(true);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };

    fetchNotifications();
  }, []);

  // 🔹 2) WebSocket para notificações em tempo real
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const connectWS = () => {
      const scheme = window.location.protocol === "https:" ? "wss" : "ws";
      const host = window.location.host;
      const ws = new WebSocket(`${scheme}://${host}/ws/notifications/?token=${encodeURIComponent(token)}`);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
        if (reconnectTimerRef.current) {
          clearTimeout(reconnectTimerRef.current);
          reconnectTimerRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setNotifications(prev => [data, ...prev].slice(0, 20)); // limita a 20 notificações
          setNotificacaoSelecionada(data);
          setModalNotificacaoOpen(true); // abre modal para notificações novas
        } catch (err) {
          console.warn("Mensagem WS inválida:", err);
        }
      };

      ws.onerror = (err) => console.warn("WebSocket erro:", err);

      ws.onclose = () => {
        const attempt = Math.min(reconnectAttemptsRef.current + 1, 6);
        reconnectAttemptsRef.current = attempt;
        const delay = Math.min(1000 * 2 ** attempt, 30000);
        reconnectTimerRef.current = setTimeout(connectWS, delay);
      };
    };

    connectWS();

    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Abre modal ao clicar na notificação
  const abrirModalNotificacao = (notif) => {
    setNotificacaoSelecionada(notif);
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
      {/* Lado esquerdo: logo */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src={Logo} alt="Logo da DataBox" className="logo-img" />
      </div>

      {/* Lado direito */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {/* Inventário */}
        <button onClick={() => setInventarioOpen(true)} className="topbar-btn" title="Inventário">
          <FiBox size={20} />
        </button>

        {/* Notificações */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => { playClickSound(); setDropdownOpen(prev => !prev); }}
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

        {/* Menu */}
        <Menu />
      </div>

      {/* Modal de Inventário */}
      <ModalBase
        isOpen={inventarioOpen}
        onClose={() => setInventarioOpen(false)}
        title="INVENTÁRIO"
        icon={<FiBox size={25} style={{ marginRight: '8px', verticalAlign: 'middle' }} />}
        buttons={[]}
        showHeader={true}
      >
        <Inventario />
      </ModalBase>

      {/* Modal de Notificação */}
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
