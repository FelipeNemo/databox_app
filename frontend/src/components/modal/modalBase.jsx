import React, { useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import './modal.css';

const ModalBase = ({
  isOpen,
  onClose,
  children,
  showHeader = true,
  title = 'NOTIFICAÇÃO',
  icon = <FiAlertCircle size={25} style={{ color: '#f1f1f1ff', marginRight: '5px' }} />,
  sound = '/sounds/mixkit-interface-device-click-2577.wav',
  buttons = ['OK'] // opções: ['OK'], ['Sim', 'Não'], ou [] para nenhum botão
}) => {
  useEffect(() => {
    if (isOpen && sound) {
      const notifySound = new Audio(sound);
      notifySound.play().catch((err) => console.warn('Erro ao tocar som:', err));
    }
  }, [isOpen, sound]);

  const playClickSound = () => {
    const clickSound = new Audio('/sounds/mixkit-interface-device-click-2577.wav');
    clickSound.play().catch((err) => console.warn('Erro ao tocar som de clique:', err));
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      playClickSound();
      onClose?.();
    }
  };

  const handleClick = (callback) => {
    playClickSound();
    callback?.();
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={() => handleClick(onClose)}>✖</button>

        {showHeader && (
          <div className="modal-header">
            {icon}
            <strong>{title}</strong>
          </div>
        )}

        <div className="modal-body">{children}</div>

        {buttons.length > 0 && (
          <div className="modal-actions">
            {buttons.map((btnLabel) => (
              <button key={btnLabel} className="btn" onClick={() => handleClick(onClose)}>
                {btnLabel}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalBase;
