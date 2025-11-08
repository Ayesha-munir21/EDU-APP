import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Table from "../../components/Table";

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Mock stats - matching requirements
  const stats = [
    { title: "Total Tracks", value: 12, icon: "📚" },
    { title: "Active Learners", value: 1024, icon: "👥" },
    { title: "Total Sales", value: "$45,230", icon: "💰" },
    { title: "Top-Selling Track", value: "AWS Cloud", icon: "⭐" },
  ];

  // Mock top-selling tracks
  const [topTracks] = useState([
    { id: 1, name: "AWS Cloud Practitioner", sales: 234, revenue: "$11,466" },
    { id: 2, name: "PMP Certification", sales: 189, revenue: "$18,711" },
    { id: 3, name: "Python Developer", sales: 156, revenue: "$9,204" },
    { id: 4, name: "React Mastery", sales: 142, revenue: "$8,378" },
  ]);

  // Top Navigation Links
  const topNavLinks = [
    { name: "Tracks", path: "/tracks" },
    { name: "Exams", path: "/exams" },
    { name: "Pricing", path: "/pricing" },
    { name: "Bundles", path: "/bundles" },
    { name: "Coupons", path: "/coupons" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          
          {/* Top Navigation */}
          <div className="top-nav">
            {topNavLinks.map((link) => (
              <button
                key={link.name}
                className="nav-btn"
                onClick={() => navigate(link.path)}
              >
                {link.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((stat, i) => (
            <Card key={i} title={stat.title}>
              <div className="stat-content">
                <span className="stat-icon">{stat.icon}</span>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </Card>
          ))}
        </div>

        {/* Top-Selling Tracks Table */}
        <div className="custom-card">
          <div className="card-title">Top-Selling Tracks</div>
          <Table
            headers={["Track Name", "Sales", "Revenue", "Actions"]}
            rows={topTracks.map((track) => [
              track.name,
              track.sales,
              track.revenue,
              <>
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/tracks?edit=${track.id}`)}
                >
                  Edit
                </button>
                <button
                  className="view-btn"
                  onClick={() => navigate(`/reports?track=${track.id}`)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  View Report
                </button>
              </>,
            ])}
          />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => navigate("/tracks")}>
              ➕ Add New Track
            </button>
            <button className="action-btn" onClick={() => navigate("/exams")}>
              ➕ Create Exam
            </button>
            <button className="action-btn" onClick={() => navigate("/coupons")}>
              ➕ Create Coupon
            </button>
            <button className="action-btn" onClick={() => navigate("/bundles")}>
              ➕ Create Bundle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
