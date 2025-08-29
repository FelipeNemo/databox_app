import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";
import "./modal.css";

const ModalBase = ({ isOpen, onClose, title, icon, children, showHeader = true }) => {
  
  // Fecha o modal ao apertar ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Fecha modal ao clicar fora do conteúdo
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose?.();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        {showHeader && (
          <div className="modal-header">
            <div className="modal-title">
              {icon} <span>{title}</span>
            </div>
            <button className="modal-close" onClick={onClose}>
              <FiX size={20} />
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default ModalBase;
