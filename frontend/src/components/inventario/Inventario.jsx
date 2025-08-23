import React, { useState } from 'react';
import './inventario.css'; // Para estilos opcionais
const Inventario = () => {
  const [abaAtiva, setAbaAtiva] = useState('Itens');

  const conteudo = {
    Itens: ['Poção de Cura', 'Chave de Ouro', 'Mapa Antigo', 'Elixir de Mana', 'Lanterna', 'Moedas de Ouro'],
    Habilidades: ['Furtividade', 'Carisma', 'Força', 'Inteligência', 'Velocidade', 'Resistência'],
    Armas: ['Espada Longa', 'Arco Curvo', 'Adaga Venenosa', 'Machado Pesado', 'Cajado Místico', 'Besta Leve']
  };

  return (
    <div className="modal-inventario">
      <div className="botoes-abas">
        {['Itens', 'Habilidades', 'Armas'].map((aba) => (
          <button
            key={aba}
            className={abaAtiva === aba ? 'ativo' : ''}
            onClick={() => setAbaAtiva(aba)}
          >
            {aba}
          </button>
        ))}
      </div>

      <div className="painel-grid">
        {conteudo[abaAtiva].map((item, index) => (
          <div className="item-grid" key={index}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventario;