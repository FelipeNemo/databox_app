import React from "react";
import Plot from "react-plotly.js";
import "./dashboards.css";

const Dashboard = () => {
  return (
    <div className="dashboard-area-adm-main">
      <div className="dashboard-area-adm-content">
        <div className="dashboard-gamification-wrapper">
          <div className="dashboard-cards-container">
            {/* Radar Skills */}
            <div className="dashboard-gamification-card">
              <h3>Radar Skills</h3>
              <Plot
                data={[
                  {
                    type: "scatterpolar",
                    r: [80, 60, 70, 50, 90],
                    theta: ["Comunicação", "Lógica", "Criatividade", "Resiliência", "Disciplina"],
                    fill: "toself",
                    name: "Skills",
                  },
                ]}
                layout={{
                  polar: { radialaxis: { visible: true, range: [0, 100] } },
                  showlegend: false,
                  margin: { t: 30, b: 10 },
                  paper_bgcolor: "#4c4c72ff",
                  font: { color: "#fff" },
                }}
                style={{ width:"100%", height: "350px" }}
              />
            </div>

            {/* Calendário Gamificado */}
            <div className="dashboard-gamification-card">
              <h3>Calendário Gamificado</h3>
              <p>[Conteúdo interativo com datas e objetivos]</p>
            </div>

            {/* Evolução XP */}
            <div className="dashboard-gamification-card">
              <h3>Evolução XP</h3>
              <Plot
                data={[
                  {
                    x: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
                    y: [10, 25, 35, 45, 60, 80],
                    type: "scatter",
                    mode: "lines+markers",
                    marker: { color: "#00cc96" },
                    name: "XP",
                  },
                ]}
                layout={{
                  title: "Progresso XP",
                  margin: { t: 30 },
                  paper_bgcolor: "#3b3b54ff",
                  plot_bgcolor: "#1e1e2f12",
                  font: { color: "#fff" },
                }}
                style={{ width: "100%px", height: "350px" }}
              />
            </div>

            {/* Painel de Missões Ativas */}
            <div className="dashboard-gamification-card">
              <h3>Missão Diária</h3>
              <ul>
                <li>🏆 Finalizar Projeto XP</li>
                <li>📚 Estudar 3h de JavaScript</li>
                <li>💪 Treinar Calistenia - Push Day</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


