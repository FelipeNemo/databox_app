import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserHeader = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="user-header">
      <h2>Minha Área</h2>
      <nav>
        {/* aqui pode ter botões ou ícones de notificações, perfil, etc */}
        <button onClick={logout}>Logout</button>
      </nav>
    </header>
  );
};

export default UserHeader;
