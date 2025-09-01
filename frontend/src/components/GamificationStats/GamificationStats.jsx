import React, { useState, useEffect } from 'react';
import { FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import './gamificationStats.css';
import api from "../../api/axios";

const GamificationStats = () => {
  const [level, setLevel] = useState(1);
  const [xpCurrent, setXpCurrent] = useState(0);
  const [xpNeeded, setXpNeeded] = useState(100);
  const [health, setHealth] = useState(0);
  const [coins, setCoins] = useState(0);
  const [missions, setMissions] = useState([]);

  const [displayLevel, setDisplayLevel] = useState(level);
  const [displayXp, setDisplayXp] = useState(xpCurrent);
  const [displayXpNeeded, setDisplayXpNeeded] = useState(xpNeeded);
  const [displayHealth, setDisplayHealth] = useState(health);

  // 🔹 Fetch inicial
  const fetchStatus = async () => {
    try {
      const resp = await api.get("/rewards/my_status/");
      const data = resp.data;

      setLevel(data.level);
      setXpCurrent(data.xp_current);
      setXpNeeded(data.xp_needed);
      setHealth(data.vitalidade);
      setCoins(data.coins);
      setMissions(data.missions || []);
    } catch (err) {
      console.error("Erro ao carregar status:", err);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  // 🔹 WebSocket para notificações incrementais
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8000/ws/notifications/");

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.tipo === "reward") {
          const { reward_type, amount } = msg.reward;

          if (reward_type === "xp") setXpCurrent(prev => prev + amount);
          if (reward_type === "vitalidade") setHealth(prev => prev + amount);
          if (reward_type === "coin") setCoins(prev => prev + amount);
        }
      } catch (err) {
        console.error("Erro processando WS:", err);
      }
    };

    return () => socket.close();
  }, []);

  // 🔹 Animações
  useEffect(() => {
    let frame;
    const animateXp = () => {
      if (displayXp < xpCurrent) {
        setDisplayXp(prev => Math.min(prev + 1, xpCurrent));
        frame = requestAnimationFrame(animateXp);
      }
    };
    animateXp();
    return () => cancelAnimationFrame(frame);
  }, [displayXp, xpCurrent]);

  useEffect(() => {
    let frame;
    const animateHealth = () => {
      if (displayHealth < health) {
        setDisplayHealth(prev => Math.min(prev + 1, health));
        frame = requestAnimationFrame(animateHealth);
      }
    };
    animateHealth();
    return () => cancelAnimationFrame(frame);
  }, [displayHealth, health]);

  // 🔹 Nível
  useEffect(() => {
    if (displayXp >= displayXpNeeded) {
      setDisplayXp(displayXp - displayXpNeeded);
      setDisplayLevel(prev => prev + 1);
      setDisplayXpNeeded(Math.floor(100 * ((displayLevel + 1) ** 1.5)));
    }
  }, [displayXp, displayLevel, displayXpNeeded]);

  const xpPercent = (displayXp / displayXpNeeded) * 100;
  const healthPercent = Math.min((displayHealth / 560) * 100, 100);

  return (
    <div className="gamification-wrapper">
      <div className="gamification-panel-container">
        <div className="gamification-panel">
          <h2>Status</h2>
          <div className="progress-section">
            <label>Level {displayLevel}</label>
            <div className="progress-bar-container">
              <div className="progress-bar xp" style={{ width: `${xpPercent}%` }}></div>
            </div>
            <small>{displayXp} / {displayXpNeeded} XP</small>
          </div>

          <div className="progress-section">
            <label>Vitalidade</label>
            <div className="progress-bar-container">
              <div className="progress-bar health" style={{ width: `${healthPercent}%` }}></div>
            </div>
            <small>{displayHealth} / 560 (Últimos 7 dias)</small>
          </div>

          <div className="coin-display">
            <label>Moedas:</label> <span>{coins} 🪙</span>
          </div>
        </div>

        <div className="mission-panel">
          <h2>Missões</h2>
          {missions.length > 0 ? missions.map(m => (
            <div className="mission-item" key={m.id}>
              <div className="mission-inline">
                <div className="mission-progress-circle"
                     style={{ background: `conic-gradient(#4caf50 ${m.progress}%, #ddd ${m.progress}%)` }}>
                  <span className="progress-text">{m.progress}%</span>
                </div>
                <span className="mission-title">{m.title}</span>
              </div>
            </div>
          )) : <p>Nenhuma missão disponível.</p>}
        </div>
      </div>
    </div>
  );
};

export default GamificationStats;
