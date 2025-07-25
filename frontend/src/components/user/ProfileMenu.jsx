import React from "react";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    // talvez limpar outros dados de usuário salvos
    navigate("/login");
  };

  return (
    <div>
      <button onClick={() => alert("Ir para perfil (implemente depois)")}>
        Perfil
      </button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfileMenu;
