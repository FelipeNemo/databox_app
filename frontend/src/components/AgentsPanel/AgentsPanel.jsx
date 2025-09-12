
import React, { useState } from "react";
import { IoMdMic, IoIosArrowForward, IoIosArrowBack,  IoIosArrowUp } from "react-icons/io";
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

  return (
    <div className="chat-floating-container">
      <div className="chat-panel">
        <div className="chat-header">
          <img src={selectedAgent.image} alt={selectedAgent.name} />
          <span>{selectedAgent.name}</span>
          <button className="toggle-chat-btn" onClick={() => setIsOpen(!isOpen)}>
            < IoIosArrowUp size={20} />
          </button>
        </div>

        {isOpen && (
          <div className="chat-body">
            {/* Side Bar de Agentes */}
            <div className={`agents-sidebar ${isSidebarOpen ? "open" : "closed"}`}>
              <button className="toggle-sidebar-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                {isSidebarOpen ? <IoIosArrowBack /> : <IoIosArrowForward />}
              </button>
              {isSidebarOpen && agents.map((agent, idx) => (
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
                {messages.map((msg, idx) => (
                  <div key={idx} className={`message ${msg.from}`}>
                    <strong>{msg.from === "agent" ? msg.agent : "Você"}: </strong>
                    {msg.text}
                  </div>
                ))}
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
    </div>
  );
};

export default AgentsPanel;
