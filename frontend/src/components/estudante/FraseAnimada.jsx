
import React, { useEffect, useState, useRef } from "react";
import chapeu from "../../assets/images/chapeu_formatura.png";
import trofeu from "../../assets/images/trofeu_estudante.png";
import cerebro from "../../assets/images/cerebro_ia.png";
import grafico from "../../assets/images/grafico.png";
import chat from "../../assets/images/chat.png";
import "./FraseAnimada.css";

const frases = [
  {
    texto: "Inteligência Artificial",
    imagem: cerebro,
  },
  {
    texto: "Chatbots",
    imagem: chat,
  },
  {
    texto: "Gameficação",
    imagem: trofeu,
  },
  {
    texto: "Visualização de dados",
    imagem: grafico,
  },
  {
    texto: "Formação tech",
    imagem: chapeu,
  }
];

const FraseAnimada = () => {
  const [indexFrase, setIndexFrase] = useState(0);
  const [texto, setTexto] = useState("");
  const [digitando, setDigitando] = useState(true);
  const indexLetra = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fraseAtual = frases[indexFrase].texto;

    setTexto("");
    setDigitando(true);
    indexLetra.current = 0;

    clearInterval(intervalRef.current); // limpa antes de iniciar nova

    intervalRef.current = setInterval(() => {
      const letra = fraseAtual[indexLetra.current];
      if (letra) {
        setTexto((prev) => prev + letra);
        indexLetra.current++;
      } else {
        clearInterval(intervalRef.current);
        setDigitando(false);

        setTimeout(() => {
          setIndexFrase((prev) => (prev + 1) % frases.length);
        }, 900);
      }
    }, 50);


    return () => clearInterval(intervalRef.current);
  }, [indexFrase]);

  return (
    <div className="typing-container">
      <h1 className="titulo-fixo">DATARANK</h1>
      <div className="typing-wrapper">
        <p>{texto}</p>
        {!digitando && (
          <img
            src={frases[indexFrase].imagem}
            alt="Ícone"
            className="inline-typing-img"
          />
        )}

      </div>
        <p className="texto-fixo-abaixo">
            O curso tem o objetivo de formar profissionais aptos a resolver problemas complexos por meio da Inteligência Artificial,
            incluindo sistemas embarcados.
            </p>

    </div>
  );
};

export default FraseAnimada;
