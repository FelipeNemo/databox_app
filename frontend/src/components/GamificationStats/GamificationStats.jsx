
import './gamificationStats.css'; 
import { useStatusGame } from '../hook/useStatusGame'; 

const GamificationStats = () => { 
    const { 
        level, 
        displayXp, 
        xpNeeded, 
        displayHealth, 
        coins, 
        missions 
    } = useStatusGame(true, 10000);

    const xpPercent = (displayXp / xpNeeded) * 100; 
    const healthPercent = Math.min((displayHealth / 560) * 100, 100); 

    return ( 
        <div className="gamification-wrapper"> 
            <div className="gamification-panel-container"> 
               <div className="gamification-panel">
                <h2>Status</h2>
                
                <div className="progress-container">
                    {/* XP */}
                    <div className="progress-section">
                    <label>Level {level}</label>
                    <div className="progress-bar-container">
                        <div className="progress-bar xp" style={{ width: `${xpPercent}%` }}></div>
                    </div>
                    <small>{displayXp} / {xpNeeded} XP</small>
                    </div>

                    {/* Vitalidade */}
                    <div className="progress-section">
                    <label>Vitalidade</label>
                    <div className="progress-bar-container">
                        <div className="progress-bar health" style={{ width: `${healthPercent}%` }}></div>
                    </div>
                    <small>{displayHealth} / 560 (Últimos 7 dias)</small>
                    </div>

                    {/* Moedas */}
                    <div className="progress-section coin-display">
                    <label>Moedas:</label>
                    <span>{coins} 🪙</span>
                    </div>

            </div>
            </div>
 
                <div className="mission-panel"> 
                    <h2>Missões</h2> 
                    {missions.length > 0 ? missions.map(m => ( 
                        <div className="mission-item" key={m.id}> 
                            <div className="mission-inline"> 
                                <div className="mission-progress-circle" style={{ background: `conic-gradient(#4caf50 ${m.progress}%, #ddd ${m.progress}%)` }}> 
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
