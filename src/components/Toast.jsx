import React, { useState, useEffect } from "react";

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const colors = {
    success: {
      bg: "#d9f0e6",
      border: "#34d399",
      text: "#047857",
      icon: "#059669",
    },
    error: {
      bg: "#fee2e2",
      border: "#ef4444",
      text: "#991b1b",
      icon: "#dc2626",
    },
    warning: {
      bg: "#fef3c7",
      border: "#f59e0b",
      text: "#92400e",
      icon: "#d97706",
    },
    info: {
      bg: "#dbeafe",
      border: "#3b82f6",
      text: "#1e40af",
      icon: "#2563eb",
    },
  };

  const colorScheme = colors[type] || colors.success;

  return (
    <div
      className={`toast ${isVisible ? "toast-visible" : "toast-hidden"}`}
      style={{
        backgroundColor: colorScheme.bg,
        borderLeft: `4px solid ${colorScheme.border}`,
        color: colorScheme.text,
      }}
    >
      <div className="toast-content">
        <span
          className="toast-icon"
          style={{ color: colorScheme.icon }}
        >
          {icons[type]}
        </span>
        <span className="toast-message">{message}</span>
        <button
          className="toast-close"
          onClick={handleClose}
          style={{ color: colorScheme.text }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;

