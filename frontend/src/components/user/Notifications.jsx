import React from "react";

const Notifications = () => {
  // Exemplo estático, depois pode buscar da API
  return (
    <div>
      <button onClick={() => alert("Notificações aqui!")}>
        🔔 (3)
      </button>
    </div>
  );
};

export default Notifications;
