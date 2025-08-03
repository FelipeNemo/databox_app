import React from 'react';
import './gamificationStats.css';

const GamificationStats = ({ xpPercent, healthPercent, coins }) => {
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
          <div className="mission-inline">
            <div className="mission-progress-circle">45%</div>
            <span className="mission-title">Postar Video</span>
            <div className="mission-actions">
              <button>⏸️ Pausar</button>
              <button>🗑️ Abandonar</button>
              <button>➕ Ver Detalhes</button>
            </div>
          </div>
        </div>

      </div> {/* FECHA gamification-panel-container */}
    </div> /* FECHA gamification-wrapper */
  );
};

export default GamificationStats;
