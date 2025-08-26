import React, { useState, useEffect } from 'react';
import { FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import './gamificationStats.css';

const GamificationStats = () => {
  // Estados internos (iniciam zerados)
  const [xpPercent, setXpPercent] = useState(0);
  const [healthPercent, setHealthPercent] = useState(0);
  const [coins, setCoins] = useState(0);
  const [missions, setMissions] = useState([]);

  // 🔹 Função para aplicar recompensas vindas do backend
  const applyReward = (reward) => {
    switch (reward.reward_type) {
      case 'xp':
        setXpPercent((prev) => Math.min(prev + reward.amount, 100));
        break;
      case 'coin':
        setCoins((prev) => prev + reward.amount);
        break;
      case 'health':
        setHealthPercent((prev) => Math.min(prev + reward.amount, 100));
        break;
      default:
        console.log("Recompensa desconhecida:", reward);
    }
  };

  // 🔹 Exemplo: simulando recebimento de recompensa (teste)
  useEffect(() => {
    const timer = setTimeout(() => {
      applyReward({ reward_type: 'xp', amount: 20 });
      applyReward({ reward_type: 'coin', amount: 5 });
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="gamification-wrapper">
      <div className="gamification-panel-container">

        {/* Painel de Status */}
        <div className="gamification-panel">
          <h2>Status</h2>
          <div className="progress-section">
            <label>Nível</label>
            <div className="progress-bar-container">
              <div className="progress-bar xp" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>

          <div className="progress-section">
            <label>Vitalidade</label>
            <div className="progress-bar-container">
              <div className="progress-bar health" style={{ width: `${healthPercent}%` }} />
            </div>
          </div>

          <div className="coin-display">
            <label>Moedas: </label>
            <span>{coins} 🪙</span>
          </div>
        </div>

        {/* Painel de Missão */}
        <div className="mission-panel">
          <h2>Missões</h2>

          {missions.length > 0 ? (
            missions.map((mission, index) => (
              <div className="mission-item" key={index}>
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
                  <button><FaPause /></button>
                  <button><FaTrash /></button>
                  <button><FaPlus /></button>
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
