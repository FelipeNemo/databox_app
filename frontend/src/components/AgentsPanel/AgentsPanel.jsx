import React, { useState } from "react";
import { IoMdMic, IoIosArrowForward, IoIosArrowBack, IoIosArrowUp } from "react-icons/io";
import "./agentsPanel.css";
import agent1 from "../../assets/images/agent1.jpg";
import agent2 from "../../assets/images/agent2.jpg";
import agent3 from "../../assets/images/agent3.jpg";

const agents = [
  { name: "Computador", image: agent1 },
  { name: "Tony", image: agent2 },
  { name: "Diana", image: agent3 },
];

const triggers = ["Ajuda", "Informações"];

const AgentsPanel = () => {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // controle do modal de agendamento
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    title: "",
    message: "",
    rewards: { xp: 0, coin: 0, vitality: 0 },
    scheduled_for: "",
  });

  const handleSend = (msgText = input) => {
    if (!msgText.trim()) return;
    setMessages(prev => [...prev, { from: "user", text: msgText, agent: selectedAgent.name }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { from: "agent", text: `Resposta automática: ${msgText}`, agent: selectedAgent.name }]);
    }, 1000);
  };

  const handleTriggerClick = (word) => handleSend(word);
  const handleMicClick = () => alert("Microfone ativado!");


const handleSubmitSchedule = async () => {
  try {
    let payload = { ...scheduleData };

    if (payload.scheduled_for) {
      payload.scheduled_for = new Date(payload.scheduled_for).toISOString();
    }

    payload.rewards = {
      xp: Number(payload.rewards.xp) || 0,
      coin: Number(payload.rewards.coin) || 0,
      vitality: Number(payload.rewards.vitality) || 0,
    };

    const response = await fetch(
      `/notifications/user/criar_notificacao_personalizada/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      }
    );

    // usamos await sem declarar uma variável se não vamos usar os dados
    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || "Erro ao criar notificação");
    }

    alert("Notificação criada com sucesso!");
    setShowScheduleForm(false);
    setScheduleData({
      title: "",
      message: "",
      rewards: { xp: 0, coin: 0, vitality: 0 },
      scheduled_for: "",
    });
  } catch (err) {
    alert(err.message);
  }
};


  return (
    <div className="chat-floating-container">
      <div className="chat-panel">
        <div className="chat-header">
          <img src={selectedAgent.image} alt={selectedAgent.name} />
          <span>{selectedAgent.name}</span>
          <button className="toggle-chat-btn" onClick={() => setIsOpen(!isOpen)}>
            <IoIosArrowUp size={20} />
          </button>
        </div>

        {isOpen && (
          <div className="chat-body">
            {/* Side Bar de Agentes */}
            <div className={`agents-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
              <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
              </button>
              {isSidebarOpen &&
                agents.map((agent, idx) => (
                  <button
                    key={idx}
                    className={`trigger-btn ${selectedAgent.name === agent.name ? "active" : ""}`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <img src={agent.image} alt={agent.name} className="agent-avatar" />
                    {agent.name}
                  </button>
                ))}
            </div>

            {/* Área de mensagens */}
            <div className="chat-content">
              <div className="chat-messages">
                {messages.filter(m => m.agent === selectedAgent.name).length === 0 &&
                selectedAgent.name === "Computador" ? (
                  <div className="presets-container">
                    <button className="preset-btn" onClick={() => setShowScheduleForm(true)}>
                      <strong>Agendamento de tarefa</strong>
                      <p>Crie e organize seus compromissos</p>
                    </button>

                    <button className="preset-btn" onClick={() => handleSend("Inbox")}>
                      <strong>Inbox</strong>
                      <p>Acesse suas mensagens e notificações</p>
                    </button>

                    <button className="preset-btn" onClick={() => handleSend("Informações")}>
                      <strong>Informações</strong>
                      <p>Obtenha detalhes úteis rapidamente</p>
                    </button>
                  </div>
                ) : (
                  messages
                    .filter(m => m.agent === selectedAgent.name)
                    .map((msg, idx) => (
                      <div key={idx} className={`message ${msg.from}`}>
                        <strong>{msg.from === "agent" ? msg.agent : "Você"}: </strong>
                        {msg.text}
                      </div>
                    ))
                )}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={() => handleSend()}>Enviar</button>
                <button className="mic-btn" onClick={handleMicClick}>
                  <IoMdMic size={20} />
                </button>
              </div>

              <div className="triggers">
                {triggers.map((word, idx) => (
                  <button key={idx} className="trigger-btn" onClick={() => handleTriggerClick(word)}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Agendamento */}
      {showScheduleForm && (
        <div className="agent-modal-overlay">
          <div className="agent-modal-content">
            <h3>Agendar Nova Tarefa</h3>
            <input
              type="text"
              placeholder="Título"
              value={scheduleData.title}
              onChange={(e) => setScheduleData({ ...scheduleData, title: e.target.value })}
            />
            <textarea
              placeholder="Mensagem"
              value={scheduleData.message}
              onChange={(e) => setScheduleData({ ...scheduleData, message: e.target.value })}
            />
            <input
              type="datetime-local"
              value={scheduleData.scheduled_for}
              onChange={(e) => setScheduleData({ ...scheduleData, scheduled_for: e.target.value })}
            />
            <div className="rewards">
              <input
                type="number"
                placeholder="XP"
                value={scheduleData.rewards.xp}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, rewards: { ...scheduleData.rewards, xp: e.target.value } })
                }
              />
              <input
                type="number"
                placeholder="Coins"
                value={scheduleData.rewards.coin}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, rewards: { ...scheduleData.rewards, coin: e.target.value } })
                }
              />
              <input
                type="number"
                placeholder="Vitality"
                value={scheduleData.rewards.vitality}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, rewards: { ...scheduleData.rewards, vitality: e.target.value } })
                }
              />
            </div>
            <div className="agent-modal-actions">
              <button onClick={handleSubmitSchedule}>OK</button>
              <button onClick={() => setShowScheduleForm(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AgentsPanel;



