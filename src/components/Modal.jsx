import React, { useEffect } from "react";

const Modal = ({ show, onClose, title, children }) => {
  // Prevent body scroll when modal is open - only modal should scroll
  useEffect(() => {
    if (show !== false) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [show]);

  // If show prop is not provided, always show (for conditional rendering)
  if (show === false) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>×</button>
          </div>
        )}
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
