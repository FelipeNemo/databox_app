import React, { useState, useEffect, useRef } from "react";
import TopbarAdm from "../../topbarAdm/TopbarAdm";
import SidebarAdm from "../../sidebarAdm/SidebarAdm";
import GamificationStats from "../../GamificationStats/GamificationStats";
import Dashboards from "../../analytics/Dashboards";
import AgentsPanel from "../../AgentsPanel/AgentsPanel";
import "./AreaAdm.css";

const AreaAdministrador = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const ws = useRef(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Fetch inicial de notificações
  useEffect(() => {
    fetch("http://127.0.0.1:8000/notifications/user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setNotifications(data))
      .catch((err) => console.error("Erro ao buscar notificações:", err));
  }, []);

  // Conexão WebSocket para notificações instantâneas
  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    ws.current = new WebSocket(`${protocol}://127.0.0.1:8000/ws/notifications/`);

    ws.current.onopen = () => console.log("Conectado ao WebSocket de notificações");

    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);

      // Garantir estrutura que Topbar espera
      const notif = {
        titulo: data.titulo || "INFO",
        descricao: data.descricao || data.message || "",
        tipo: data.tipo || (data.notification_type === "task" ? "confirm" : "info"),
        data: data.data || new Date().toLocaleString(),
      };

      setNotifications((prev) => [notif, ...prev]);
    };

    ws.current.onclose = () => console.log("WebSocket desconectado");

    return () => ws.current.close();
  }, []);

  // Dados gamificação de exemplo
  const xpPercent = 75;
  const healthPercent = 60;
  const coins = 120;

  return (
    <div className="area-adm-layout">
      <SidebarAdm isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="area-adm-main">
        <TopbarAdm notifications={notifications} toggleSidebar={toggleSidebar} />
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
      <AgentsPanel />
    </div>
  );
};

export default AreaAdministrador;