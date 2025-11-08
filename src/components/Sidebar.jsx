import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Tracks", path: "/admin/tracks" },
    { name: "Exams", path: "/admin/exams" },
    { name: "Pricing", path: "/admin/pricing" },
    { name: "Coupons", path: "/admin/coupons" },
    { name: "Bundles", path: "/admin/bundles" },
    { name: "Orders", path: "/admin/orders" },
    { name: "Users", path: "/admin/users" },
  ];

  return (
    <div
      style={{
        width: "250px",
        backgroundColor: "#f0f8f1",
        minHeight: "100vh",
        padding: "1rem",
      }}
    >
      <h2
        style={{
          color: "#3eb489",
          marginBottom: "2rem",
          cursor: "pointer",
        }}
        onClick={() => navigate("/admin/dashboard")}
      >
        Admin Panel
      </h2>

      <nav>
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
    </div>
  );
};

export default Sidebar;
