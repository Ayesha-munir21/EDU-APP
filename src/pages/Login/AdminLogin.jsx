import React, { useState } from "react";
// Removed unused useNavigate import
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Removed unused navigate variable
  
  const { toasts, removeToast, success, error } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Invalid email or password");
      }

      const token = data.access_token;
      const meResponse = await fetch(`${API_BASE_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = await meResponse.json();

      if (!userData.roles || !userData.roles.includes("admin")) {
        throw new Error("Access Denied: Admin privileges required.");
      }

      localStorage.setItem("accessToken", token);
      localStorage.setItem("isAdmin", "true");
      
      success("Login successful! Redirecting...");
      
      // Using window.location.href to ensure App.js refreshes the admin state
      setTimeout(() => {
        window.location.href = "/dashboard"; 
      }, 500);

    } catch (err) {
      console.error(err);
      error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="admin-login-container">
        <div className="admin-login-left">
          <div className="admin-login-left-content">
            <h1 className="admin-login-title">Admin Login</h1>
            <p className="admin-login-subtitle">Manage your platform</p>
            <div className="admin-login-features">
              <div className="feature-item"><span className="feature-icon">📊</span><span>Dashboard Analytics</span></div>
              <div className="feature-item"><span className="feature-icon">👥</span><span>User Management</span></div>
              <div className="feature-item"><span className="feature-icon">📚</span><span>Content Control</span></div>
            </div>
          </div>
        </div>
        <div className="admin-login-right">
          <div className="admin-login-card">
            <div className="admin-login-card-header">
              <div className="admin-login-icon">🔐</div>
              <h2 className="admin-login-welcome">Welcome Admin</h2>
              <p className="admin-login-description">Sign in to access dashboard</p>
            </div>
            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  className="admin-login-input"
                  placeholder="admin@edora.com"
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
              <button type="submit" className="admin-login-button" disabled={loading}>
                <span>{loading ? "Verifying..." : "Login"}</span>
                <span className="button-arrow">→</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;