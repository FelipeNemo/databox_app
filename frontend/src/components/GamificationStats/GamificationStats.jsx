

import React from 'react';
import { FaPause, FaTrash, FaPlus } from 'react-icons/fa';
import './gamificationStats.css';

const GamificationStats = ({ xpPercent, healthPercent, coins }) => {
  const missions = [
    { title: "Postar vídeo agora", progress: 45 },
    { title: "Finalizar protótipo UI", progress: 70 },
    { title: "Revisar código", progress: 20 },
  ];

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

          {missions.map((mission, index) => (
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
          ))}
        </div>

      </div>
    </div>
  );
};

export default GamificationStats;
