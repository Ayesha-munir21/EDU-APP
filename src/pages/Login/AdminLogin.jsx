import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@gmail.com" && password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      success("Login successful! Redirecting to dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } else {
      error("Invalid email or password! Please try again.");
    }
  };

  return (
    <div className="admin-login-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="admin-login-container">
        <div className="admin-login-left">
          <div className="admin-login-left-content">
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-subtitle">
              Manage your platform with ease and efficiency
            </p>
            <div className="admin-login-features">
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Dashboard Analytics</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">👥</span>
                <span>User Management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <span>Content Control</span>
              </div>
            </div>
          </div>
        </div>
        <div className="admin-login-right">
          <div className="admin-login-card">
            <div className="admin-login-card-header">
              <div className="admin-login-icon">🔐</div>
              <h2 className="admin-login-welcome">Welcome to AdminLogin</h2>
              <p className="admin-login-description">
                Please sign in to access your admin dashboard
              </p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  className="admin-login-input"
                  placeholder="admin@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="admin-input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  className="admin-login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="admin-login-button">
                <span>Login</span>
                <span className="button-arrow">→</span>
              </button>
            </form>
            <div className="admin-login-footer">
              <p className="admin-login-help">
                Need help? Contact support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
