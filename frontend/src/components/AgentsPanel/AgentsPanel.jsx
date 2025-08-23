
import React, { useState } from "react";
import "./agentsPanel.css";
import { IoIosClose } from "react-icons/io";
import agent1 from "../../assets/images/agent1.jpg";
import agent2 from "../../assets/images/agent2.jpg";
import agent3 from "../../assets/images/agent3.jpg";

// Lista de agentes com imagens
const agents = [
  {
    name: "Computador",
    image: agent1,
  },
  {
    name: "Tony",
    image: agent2,
  },
  {
    name: "Diana",
    image: agent3,
  },
];

const AgentsPanel = () => {
  const [open, setOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = {
      ...messages,
      [selectedAgent.name]: [
        ...(messages[selectedAgent.name] || []),
        { from: "user", text: input },
      ],
    };

    setMessages(newMessages);
    setInput("");

    // Resposta automática (exemplo)
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.name]: [
          ...prev[selectedAgent.name],
          { from: "agent", text: "Recebido!" },
        ],
      }));
    }, 1000);
  };

  return (
    <div className="agents-panel-container">
      <button
        className="open-button"
        onClick={() => {
          setOpen(!open);
          setSelectedAgent(null);
        }}
      >
        {open ? (
          <IoIosClose size={26} />
        ) : (
          <div className="chat-launcher">
            <div className="avatar-wrapper">
              {agents.slice(0, 3).map((agent, index) => (
                <img
                  key={index}
                  src={agent.image}
                  alt={agent.name}
                  className="avatar-img"
                  style={{ left: `${index * 15}px`, zIndex: 3 - index }}
                />
              ))}
            </div>
            <span className="launcher-label">Agentes</span>
          </div>
        )}
      </button>

      {open && !selectedAgent && (
        <div className="agents-panel">
          <h3>Agentes</h3>
          <ul>
            {agents.map((agent, index) => (
              <li key={index} onClick={() => setSelectedAgent(agent)}>
                <img
                  src={agent.image}
                  alt={agent.name}
                  className="agent-avatar"
                />
                <div className="agent-info">
                  <span className="name">{agent.name}</span>
                  <span className="message">Clique para conversar</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedAgent && (
        <div className="chat-panel">
          <div className="chat-header">
            <img src={selectedAgent.image} alt={selectedAgent.name} />
            <span>{selectedAgent.name}</span>
            <IoIosClose size={20} onClick={() => setSelectedAgent(null)} />
          </div>

          <div className="chat-messages">
            {(messages[selectedAgent.name] || []).map((msg, idx) => (
              <div key={idx} className={`message ${msg.from}`}>
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
            <button onClick={handleSend}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentsPanel;
