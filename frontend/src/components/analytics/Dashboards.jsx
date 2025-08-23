
import React, { useState, useEffect } from "react";
import Plot from "react-plotly.js";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import "./dashboards.css";


const Dashboard = () => {
  const [missions, setMissions] = useState([]); // From Google Calendar
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    // Simulando fetch do Google Calendar (você pode substituir por fetch real)
    const exampleData = [
      { date: "2025-08-03", title: "Estudar JavaScript", done: true },
      { date: "2025-08-03", title: "Treinar Calistenia", done: false },
      { date: "2025-08-03", title: "Finalizar Projeto XP", done: true },
    ];

    setMissions(exampleData);

    const doneCount = exampleData.filter((m) => m.done).length;
    setCompletedCount(doneCount);
    setTotalCount(exampleData.length);
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const found = missions.find((m) => m.date === date.toISOString().split("T")[0]);
      return found ? <span title={found.title}>🎯</span> : null;
    }
    return null;
  };

  const percentDone = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

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
                    r: [80, 60, 70, 60, 90, 80, 10, 20, 70, 30],
                    theta: ["Database", "Reports", "Pipeline", "Dataviz", "Storytelling", "BI", "ML Ops", "ML Modeling", "Deployment", "Stats"],
                    fill: "toself",
                    name: "Skills",
                  },
                ]}
                layout={{
                  polar: { radialaxis: { visible: true, range: [0, 100] },
                 },
                  showlegend: false,
                  margin: { t: 30, b: 10 },
                  height: "50px",
                  paper_bgcolor: "transparent",
                  font: { color: "black" },
                }}
                style={{ width: "100%"}}
              />
            </div>

            {/* Calendário Gamificado */}
            <div className="dashboard-gamification-card">
              <h3>Calendário</h3>
              <Calendar  // O calendário deve ocupar todo o espaço disponível
                tileContent={tileContent}
                className="react-calendar-custom full-width-calendar"
              />
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
                  height: "250px",
                  paper_bgcolor: "transparent",
                  plot_bgcolor: "white",

                  font: { color: "black" },
                  xaxis: {
                    gridcolor: "gray",            // cor da grade do eixo X
                    tickfont: { color: "black" },
                  },
                  yaxis: {
                    gridcolor: "gray",            // cor da grade do eixo Y
                    tickfont: { color: "black" },
                  },
                }}
                style={{ width: "100%"}}
              />
            </div>

            {/* Missão Diária - Gráfico de Rosca */}
            <div className="dashboard-gamification-card">
              <h3>Missão Diária</h3>
              <Plot
                data={[
                  {
                    values: [completedCount, totalCount - completedCount],
                    labels: ["Feitas", "Pendentes"],
                    type: "pie",
                    hole: 0.6,
                    marker: {
                      colors: ["#28a1f8ff", "#cbdfe04d"]
                    },
                  },
                ]}
                layout={{
                  showlegend: true,
                  margin: { t: 30 },
                  height: "350px",
                  paper_bgcolor: "transparent",
                  font: { color: "black" },
                }}
                style={{ width: "100%" }}
              />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
