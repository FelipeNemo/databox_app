
import React, { useState, useEffect, useRef } from 'react';
import api from "../../api/axios"; // instância do axios com interceptors

import ModalBase from '../modal/modalBase';
import Inventario from '../inventario/Inventario';
import Menu from '../Menu/Menu';
import './topbarAdm.css';
import { FiBox, FiAlertCircle } from 'react-icons/fi';
import Logo from "../../assets/images/logo.png";
import RewardModal from '../rewards/RewardModal'; // caminho correto do seu RewardModal

// 🔹 Função para som de clique
const playClickSound = () => {
  const clickSound = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
  clickSound.play().catch((err) => console.warn('Erro ao tocar som de clique:', err));
};

// 🔹 Função para som de recompensa
const playRewardSound = () => {
  const rewardSound = new Audio('/sounds/mixkit-quick-positive-video-game-notification-interface-265.wav');
  rewardSound.play().catch((err) => console.warn('Erro ao tocar som de recompensa:', err));
};

// 🔧 Normaliza qualquer payload (REST ou WS) para o formato usado pela UI
const normalizeNotification = (n) => {
  const rawMessage = n?.message || n?.descricao || n?.body || "";
  const linhas = rawMessage.split("\n");

  const titulo =
    n?.titulo ||
    n?.title ||
    n?.message_title ||
    (linhas.length > 0 && linhas[0].trim() !== "" ? linhas[0] : "Notificação");

  const descricao =
    n?.descricao ||
    (linhas.length > 1 ? linhas.slice(1).join("\n") : rawMessage) ||
    "—";

  const isoDate =
    n?.created_at || n?.data || n?.timestamp || new Date().toISOString();
  const dt = new Date(isoDate);
  const data = isNaN(dt.getTime())
    ? new Date().toLocaleString("pt-BR")
    : dt.toLocaleString("pt-BR");

  const tipo = n?.tipo || n?.notification_type || "info";

  return {
    ...n,
    titulo,
    descricao,
    data,
    tipo,
  };
};

const TopbarAdm = () => {
  const [notifications, setNotifications] = useState([]);
  const [inventarioOpen, setInventarioOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalNotificacaoOpen, setModalNotificacaoOpen] = useState(false);
  const [notificacaoSelecionada, setNotificacaoSelecionada] = useState(null);

  // 🔹 Estado para modal de recompensa
  const [modalRecompensaOpen, setModalRecompensaOpen] = useState(false);
  const [recompensaSelecionada, setRecompensaSelecionada] = useState(null);

  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  // 🔹 Buscar notificações iniciais via REST
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/notifications/user/");
        const lista = Array.isArray(response.data) ? response.data : [];
        const normalizadas = lista.map(normalizeNotification);
        setNotifications(normalizadas);

        if (normalizadas.length > 0) {
          setNotificacaoSelecionada(normalizadas[0]);
          setModalNotificacaoOpen(true);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    };
    fetchNotifications();
  }, []);

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
          setNotificacaoSelecionada(data);
          setModalNotificacaoOpen(true);
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

  // 🔹 Abre modal de notificação
  const abrirModalNotificacao = (notif) => {
    setNotificacaoSelecionada(notif);
    setModalNotificacaoOpen(true);
    setDropdownOpen(false);
  };

  // 🔹 Fecha modal simples
  const fecharModalSimples = () => {
    setModalNotificacaoOpen(false);
    setNotificacaoSelecionada(null);
  };

  // 🔹 Marca como lida e abre recompensa se necessário
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

    fecharModalSimples();

    if (notificacaoSelecionada?.tipo === "reward") {
      setRecompensaSelecionada(notificacaoSelecionada);
      setModalRecompensaOpen(true);
    }
  };

  // 🔹 Toca som ao abrir modal de recompensa
  useEffect(() => {
    if (modalRecompensaOpen) {
      playRewardSound();
    }
  }, [modalRecompensaOpen]);

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
            onClick={() => { playClickSound(); setDropdownOpen(prev => !prev); }}
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
        onClose={fecharModalSimples}
        title="NOTIFICAÇÃO"
        icon={<FiAlertCircle size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />}
        buttons={[]}
        showHeader={true}
      >
        {notificacaoSelecionada && (
          <div className="modal-notificacao-content">
            <h3>{notificacaoSelecionada.titulo}</h3>
            <p>{notificacaoSelecionada.descricao}</p>
            <p><small>{notificacaoSelecionada.data}</small></p>
            <div className="modal-actions">
              <button onClick={marcarComoLida}>Ok</button>
            </div>
          </div>
        )}
      </ModalBase>

      {/* Modal de Recompensa */}
      <ModalBase
        isOpen={modalRecompensaOpen}
        onClose={() => { setModalRecompensaOpen(false); setRecompensaSelecionada(null); }}
        title="RECOMPENSA" 
        icon={<FiBox size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />}
        buttons={[]}
        showHeader={true}
      >
        {recompensaSelecionada && (
          <div className="modal-recompensa-content">
            <h3>{recompensaSelecionada.titulo}</h3>
            <p>{recompensaSelecionada.descricao}</p>
            <p><small>{recompensaSelecionada.data}</small></p>
            <div className="modal-actions">
              <button onClick={() => setModalRecompensaOpen(false)}>Fechar</button>
            </div>
          </div>
        )}
      </ModalBase>
    </div>
  );
};

export default TopbarAdm;
