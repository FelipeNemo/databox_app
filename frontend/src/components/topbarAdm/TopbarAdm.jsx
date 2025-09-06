import React, { useState, useEffect, useRef } from 'react';
import api from "../../api/axios";
import ModalBase from '../modal/modalBase';
import Inventario from '../inventario/Inventario';
import Menu from '../Menu/Menu';
import './topbarAdm.css';
import { FiBox, FiAlertCircle } from 'react-icons/fi';
import Logo from "../../assets/images/logo.png";
import { useTopbarAdm } from '../hook/useTopbarAdm';

const TopbarAdm = () => {
  // 🔹 Hooks personalizados e sons
  const { playClickSound, playRewardSound, normalizeNotification } = useTopbarAdm();

  // 🔹 Estados principais
  const [notifications, setNotifications] = useState([]);
  const [inventarioOpen, setInventarioOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [modalNotificacaoOpen, setModalNotificacaoOpen] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);

  const [modalRecompensaOpen, setModalRecompensaOpen] = useState(false);
  const [recompensaSelecionada, setRecompensaSelecionada] = useState(null);

  const [modalNotificacaoAutoOpen, setModalNotificacaoAutoOpen] = useState(true);

  // 🔹 Refs
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const modalNotificacaoOpenRef = useRef(modalNotificacaoOpen);

  useEffect(() => {
    modalNotificacaoOpenRef.current = modalNotificacaoOpen;
  }, [modalNotificacaoOpen]);

  // 🔹 Fetch inicial de notificações
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/user/");
        const lista = Array.isArray(response.data) ? response.data : [];
        const normalizadas = lista.map(normalizeNotification);
        setNotifications(normalizadas);

        if (normalizadas.length > 0 && modalNotificacaoAutoOpen) {
          setNotificacaoSelecionada(normalizadas[0]);
          setModalNotificacaoOpen(true);
          playClickSound();
          setModalNotificacaoAutoOpen(false);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };
    fetchNotifications();
  }, [normalizeNotification, modalNotificacaoAutoOpen, playClickSound]);

  // 🔹 Funções de fechamento de modais
  const fecharModalNotificacao = () => {
    setModalNotificacaoOpen(false);
    setNotificacaoSelecionada(null);
    setModalNotificacaoAutoOpen(false);
  };

  const fecharRecompensa = () => {
    setModalRecompensaOpen(false);
    setRecompensaSelecionada(null);
  };

  // 🔹 Abrir modal de notificação
  const abrirModalNotificacao = (notif) => {
    setNotificacaoSelecionada(notif);
    setModalNotificacaoOpen(true);
    setDropdownOpen(false);
    playClickSound();
  };

  // 🔹 Marcar notificação como lida e abrir recompensa se houver
  const marcarComoLida = async () => {
    if (notificacaoSelecionada?.id) {
      try {
        await api.post("/notifications/mark_as_read/", { id: notificacaoSelecionada.id });
        setNotifications(prev =>
          prev.map(n => n.id === notificacaoSelecionada.id ? { ...n, is_read: true } : n)
        );
      } catch (err) {
        console.error("Erro ao marcar notificação como lida:", err);
      }
    }

    setModalNotificacaoOpen(false);

    if (
      notificacaoSelecionada?.tipo === "reward" ||
      notificacaoSelecionada?.reward_text ||
      notificacaoSelecionada?.rewards > 0
    ) {
      setRecompensaSelecionada(notificacaoSelecionada);
      setModalRecompensaOpen(true);
      playRewardSound();
    } else {
      setNotificacaoSelecionada(null);
    }
  };


// 🔹 Confirmar recompensa
const confirmarReward = async () => {
  if (!recompensaSelecionada) return;
  try {
    await api.post("/rewards/confirm_notification/", {
      notification_id: recompensaSelecionada.id,
    });
    setNotifications(prev =>
      prev.map(n =>
        n.id === recompensaSelecionada.id
          ? { ...n, is_read: true }
          : n
      )
    );
    setModalRecompensaOpen(false);
    setRecompensaSelecionada(null);
  } catch (err) {
    console.error("Erro ao conceder recompensa:", err);
  }
};

  // 🔹 WebSocket para notificações em tempo real
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
          const raw = JSON.parse(event.data);
          const data = normalizeNotification(raw);
          setNotifications(prev => [data, ...prev]);

          if (!modalNotificacaoOpenRef.current) {
            setNotificacaoSelecionada(data);
            setModalNotificacaoOpen(true);
            playClickSound();
          }
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
  }, [normalizeNotification, playClickSound]);

  // 🔹 Render
  return (
    <div className="topbar-adm" style={{ position: 'fixed', top: 0, width: '100%', height: '60px', backgroundColor: '#00000078', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', zIndex: 1000 }}>
      
      {/* Lado esquerdo: logo */}
      <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <img src={Logo} alt="Logo da DataBox" className="logo-img" />
      </div>

      {/* Lado direito */}
      <div className="topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <button onClick={() => setInventarioOpen(true)} className="topbar-btn" title="Inventário">
          <FiBox size={20} />
        </button>

        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(prev => !prev)}
            className="topbar-btn"
            title="Notificações"
          >
            <FiAlertCircle size={20} style={{ marginRight: '5px' }} />
            ({notifications.filter(n => !n.is_read).length})
          </button>

          {dropdownOpen && (
            <div style={{ position: 'absolute', top: '100%', right: 0, backgroundColor: '#222', color: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', minWidth: '250px', maxHeight: '300px', overflowY: 'auto', zIndex: 1100 }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '10px' }}>Nenhuma notificação</div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={notif.id || index}
                    style={{ padding: '10px', borderBottom: '1px solid #444', cursor: 'pointer', backgroundColor: !notif.is_read ? '#333' : 'transparent' }}
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

        <Menu />
      </div>

      {/* Modais */}
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

      <ModalBase
        isOpen={modalNotificacaoOpen}
        onClose={fecharModalNotificacao} 
        title="NOTIFICAÇÃO"
        icon={<FiAlertCircle size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />}
        buttons={[]}
        showHeader={true}
      >
        {notificacaoSelecionada && (
          <div className="modal-notificacao-content">
            <h3>{notificacaoSelecionada.titulo}</h3>
            <p>{notificacaoSelecionada.descricao}</p>
            <div className="modal-actions">
              <button onClick={marcarComoLida}>Ok</button>
            </div>
          </div>
        )}
      </ModalBase>

      <ModalBase
        isOpen={modalRecompensaOpen}
        onClose={fecharRecompensa}
        title="RECOMPENSA" 
        icon={<FiAlertCircle size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />}
        buttons={[]}
        showHeader={true}
      >
        {recompensaSelecionada && (
          <div className="modal-recompensa-content">
            <h3>{recompensaSelecionada.titulo}</h3>
            <p>{recompensaSelecionada.reward_text}</p>
            <div className="modal-actions">
               <button className="recompensa-btn" onClick={async () => { 
                 playRewardSound();
                 await confirmarReward(); // espera a requisição
                }}>
                 Ok
                </button>

            </div>
          </div>
        )}
      </ModalBase>
    </div>
  );
};

export default TopbarAdm;
