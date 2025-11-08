import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import ToastContainer from "./ToastContainer";

const Sidebar = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success } = useToast();

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Tracks", path: "/tracks" },
    { name: "Exams", path: "/exams" },
    { name: "Pricing", path: "/pricing" },
    { name: "Bundles", path: "/bundles" },
    { name: "Coupons", path: "/coupons" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    success("Logged out successfully!");
    setTimeout(() => {
      navigate("/");
      // window.location.reload(); // Reload to update App.js authentication check
    }, 1000);
  };

  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div
        style={{
          width: "250px",
          backgroundColor: "#f0f8f1",
          minHeight: "100vh",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2
          style={{
            color: "#3eb489",
            marginBottom: "2rem",
            cursor: "pointer",
          }}
          onClick={() => navigate("/dashboard")}
        >
          Admin Panel
        </h2>

        <nav style={{ flex: 1 }}>
          {links.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                display: "block",
                marginBottom: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "0.25rem",
                backgroundColor: isActive ? "#3eb489" : "transparent",
                color: isActive ? "#fff" : "#1f2937",
                textDecoration: "none",
                transition: "0.2s ease",
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div style={{ paddingTop: "1rem", borderTop: "1px solid #d1d5db" }}>
          <button
            onClick={handleLogout}
            className="logout-btn"
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
