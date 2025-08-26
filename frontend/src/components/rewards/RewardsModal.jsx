import React, { useState, useEffect } from "react";

const RewardModal = ({ show, onClose, reward }) => {
  useEffect(() => {
    if (show) {
      // toca som só quando abrir
      const audio = new Audio("/sounds/reward.mp3"); // coloque seu arquivo na pasta public/sounds
      audio.play();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">Parabéns!</h2>
        <p className="mb-4">Você receu: <b>{reward}</b></p>
        <button
          onClick={onClose}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RewardModal;
