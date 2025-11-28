import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Table from "../../components/Table";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // 1. Stats State (Initially Empty/Zero)
  const [dashboardStats, setDashboardStats] = useState([
    { title: "Total Tracks", value: 0, icon: "📚" },
    { title: "Active Learners", value: 0, icon: "👥" },
    { title: "Total Sales", value: "$0", icon: "💰" },
    { title: "System Status", value: "Online 🟢", icon: "⚙️" },
  ]);

  // 2. State for Top Tracks
  const [topTracks, setTopTracks] = useState([]);

  // 3. Fetch Real Data from Backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/admin/reports/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();

          // Update Stats Cards
          setDashboardStats([
            { title: "Total Tracks", value: data.totalTracks, icon: "📚" },
            { title: "Active Learners", value: data.activeLearners, icon: "👥" },
            { title: "Total Sales (Est.)", value: `$${data.totalSales.toLocaleString()}`, icon: "💰" },
            { title: "System Status", value: "Online 🟢", icon: "⚙️" },
          ]);

          // Update Top Tracks Table
          setTopTracks(data.topTracks || []);
        }
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Top Navigation Links (Added "Concept List")
  const topNavLinks = [
    { name: "Tracks", path: "/tracks" },
    { name: "Exams", path: "/exams" },
    { name: "Pricing", path: "/pricing" },
    { name: "Bundles", path: "/bundles" },
    { name: "Coupons", path: "/coupons" },
    { name: "Users", path: "/users" },
    { name: "Reports", path: "/reports" },
    { name: "Concept List", path: "/conceptlist" }, // ✅ Added Here
  ];

  if (loading) return <div style={{ padding: "50px", textAlign: "center" }}>Loading Dashboard...</div>;

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

        {/* Stats Cards (Dynamic) */}
        <div className="stats-grid">
          {dashboardStats.map((stat, i) => (
            <Card key={i} title={stat.title}>
              <div className="stat-content">
                <span className="stat-icon">{stat.icon}</span>
                <h2 className="stat-value">{stat.value}</h2>
              </div>
            </Card>
          ))}
        </div>

        {/* Top-Selling Tracks Table (Dynamic) */}
        <div className="custom-card">
          <div className="card-title">Top-Selling Tracks</div>
          {topTracks.length === 0 ? (
            <p style={{ padding: "1rem", color: "#666" }}>No sales data available yet.</p>
          ) : (
            <Table
              headers={["Track Name", "Enrollments", "Revenue", "Actions"]}
              rows={topTracks.map((track) => [
                track.title,
                track.sales,
                `$${track.revenue.toLocaleString()}`,
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

                  {/* View Details Button */}
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/track-details?id=${track.id}`)} 
                    style={{ 
                        marginLeft: "0.5rem", 
                        background: "rgba(163, 173, 163, 1)", 
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                  >
                    View Details
                  </button>
                </>,
              ])}
            />
          )}
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