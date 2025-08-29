import React, { useState, useEffect } from 'react';
import { FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import './gamificationStats.css';
import api from "../../api/axios"; // 🔹 importa a instância axios

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

  // 🔹 Busca status no backend
  useEffect(() => {
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
    fetchStatus();
  }, []);

  // 🔹 animações XP e Vitalidade mantêm iguais...
  useEffect(() => {
    let animationFrame;
    const animateXp = () => {
      if (displayXp < xpCurrent) {
        setDisplayXp(prev => Math.min(prev + 1, xpCurrent));
        animationFrame = requestAnimationFrame(animateXp);
      }
    };
    animateXp();
    return () => cancelAnimationFrame(animationFrame);
  }, [displayXp, xpCurrent]);

  useEffect(() => {
    let animationFrame;
    const animateHealth = () => {
      if (displayHealth < health) {
        setDisplayHealth(prev => Math.min(prev + 1, health));
        animationFrame = requestAnimationFrame(animateHealth);
      }
    };
    animateHealth();
    return () => cancelAnimationFrame(animationFrame);
  }, [displayHealth, health]);

  useEffect(() => {
    if (displayXp >= displayXpNeeded) {
      setDisplayXp(displayXp - displayXpNeeded);
      setDisplayLevel(prev => prev + 1);
      setDisplayXpNeeded(Math.floor(100 * ((displayLevel + 1) ** 1.5)));
    }
  }, [displayXp, displayLevel, displayXpNeeded]);

  const xpPercentDynamic = (displayXp / displayXpNeeded) * 100;
  const healthPercent = Math.min((displayHealth / 560) * 100, 100);

  const completeMission = async (missionId) => {
    try {
      const resp = await api.post("/rewards/mark_with_reward/", {
        id: missionId
      });

      const data = resp.data;
      setMissions(prev => prev.map(m => m.id === missionId ? { ...m, progress: 100 } : m));

      if (data.reward) {
        if (data.reward.type === "xp") setXpCurrent(prev => prev + data.reward.amount);
        if (data.reward.type === "vitality") setHealth(prev => prev + data.reward.amount);
        if (data.reward.type === "coin") setCoins(prev => prev + data.reward.amount);
      }
    } catch (err) {
      console.error("Erro ao concluir missão:", err);
    }
  };

  return (
    <div className="gamification-wrapper">
      <div className="gamification-panel-container">
        {/* Painel de Status */}
        <div className="gamification-panel">
          <h2>Status</h2>

          {/* Barra XP */}
          <div className="progress-section">
            <label>Level {displayLevel}</label>
            <div className="progress-bar-container">
              <div
                className="progress-bar xp"
                style={{ width: `${xpPercentDynamic}%` }}
              >&nbsp;</div>
            </div>
            <small>{displayXp} / {displayXpNeeded} XP</small>
          </div>

          {/* Barra Vitalidade */}
          <div className="progress-section">
            <label>Vitalidade</label>
            <div className="progress-bar-container">
              <div
                className="progress-bar health"
                style={{ width: `${healthPercent}%` }}
              >&nbsp;</div>
            </div>
            <small>{displayHealth} / 560 (Últimos 7 dias)</small>
          </div>

          {/* Coins */}
          <div className="coin-display">
            <label>Moedas:</label> <span>{coins} 🪙</span>
          </div>
        </div>

        {/* Painel de Missões */}
        <div className="mission-panel">
          <h2>Missões</h2>
          {missions.length > 0 ? (
            missions.map(mission => (
              <div className="mission-item" key={mission.id}>
                <div className="mission-inline">
                  <div
                    className="mission-progress-circle"
                    style={{
                      background: `conic-gradient(#4caf50 ${mission.progress}%, #ddd ${mission.progress}%)`
                    }}
                  >
                    <span className="progress-text">{mission.progress}%</span>
                  </div>
                  <span className="mission-title">{mission.title}</span>
                </div>

                <div className="mission-actions">
                  <button onClick={() => completeMission(mission.id)}><FaPlus /></button>
                  <button><FaPause /></button>
                  <button><FaTrash /></button>
                </div>
              </div>
            ))
          ) : (
            <p>Nenhuma missão disponível.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamificationStats;
