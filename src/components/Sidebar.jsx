import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast"; 
import ToastContainer from "./ToastContainer"; 

const Sidebar = () => {
  const navigate = useNavigate();
  
  // ✅ FIX: Call the hook directly (unconditionally)
  const { toasts, removeToast, success } = useToast();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tracks", path: "/tracks" },
    { name: "Exams", path: "/exams" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
    { name: "Concept List", path: "/conceptlist" },
    { name: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    // 1. Clear Credentials
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("accessToken");
    
    // 2. Show Success Message
    success("Logged out successfully!");

    // 3. FORCE REDIRECT to Login Page ("/")
    setTimeout(() => {
      window.location.href = "/"; 
    }, 500);
  };

  return (
    <>
      {/* Toast Container for notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div
        style={{
          width: "250px",
          backgroundColor: "#f0f8f1", // Light green background
          minHeight: "100vh",
          padding: "1.5rem",
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid #d1fae5",
          position: "sticky",
          top: 0,
          height: "100vh" 
        }}
      >
        {/* Admin Logo / Title */}
        <h2
          style={{
            color: "#10B981", // Emerald Green
            marginBottom: "2.5rem",
            cursor: "pointer",
            textAlign: "center",
            fontSize: "1.5rem",
            fontWeight: "bold",
            letterSpacing: "1px"
          }}
          onClick={() => navigate("/dashboard")}
        >
          Admin Panel
        </h2>

        {/* Navigation Links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                backgroundColor: isActive ? "#34D399" : "transparent", // Active: Bright Green
                color: isActive ? "#ffffff" : "#4b5563", // Active: White, Inactive: Gray
                textDecoration: "none",
                transition: "all 0.2s ease",
                fontWeight: isActive ? "600" : "500",
                fontSize: "0.95rem"
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button Area */}
        <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #a7f3d0" }}>
          <button
            onClick={handleLogout}
            style={{
                width: "100%",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                border: "1px solid #fecaca",
                borderRadius: "8px",
                backgroundColor: "#fff",
                color: "#0c0c0cff", // Red Text
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = "#fee2e2";
                e.target.style.borderColor = "#dc2626";
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = "#dc2626";
                e.target.style.borderColor = "#fecaca";
            }}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;