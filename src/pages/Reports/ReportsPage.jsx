import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Card from "../../components/Card";

// ✅ Connect to Render Backend
const API_BASE_URL = "https://ceretification-app.onrender.com";

const ReportsPage = () => {
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Initial State
  const [data, setData] = useState({
    salesData: {
        totalSales: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        monthlySales: []
    },
    topLearners: [],
    mostAttemptedExams: [],
    topSellingTracks: [],
    activeLearners: 0,
    totalTracks: 0
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        // ✅ CHANGED: Use the working '/stats' endpoint (Same as Dashboard)
        const response = await fetch(`${API_BASE_URL}/api/admin/reports/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const result = await response.json();
          
          // ✅ MAP backend data to component state
          setData({
            salesData: {
                totalSales: result.totalSales || 0,
                totalOrders: result.totalOrders || 0, // This is Enrollments
                averageOrderValue: result.totalOrders > 0 ? Math.round(result.totalSales / result.totalOrders) : 0,
                monthlySales: [] // Not provided by stats endpoint
            },
            topLearners: [], // Not provided by stats endpoint
            mostAttemptedExams: [], // Not provided by stats endpoint
            topSellingTracks: result.topTracks || [],
            activeLearners: result.activeLearners || 0,
            totalTracks: result.totalTracks || 0
          });
        } else {
            console.error("Failed to load report stats");
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return (
    <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "2rem", textAlign:'center' }}>Loading Reports...</div>
    </div>
  );

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Reports & Analytics</h1>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #ddd" }}
          >
            <option value="all">All Time</option>
            <option value="month">This Month</option>
          </select>
        </div>

        {/* ✅ Stats Cards (Powered by Real Data) */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <Card title="Total Revenue (Est.)">
            <div className="stat-content">
              <span className="stat-icon">💰</span>
              <h2 className="stat-value">${data.salesData.totalSales.toLocaleString()}</h2>
            </div>
          </Card>
          <Card title="Total Enrollments">
            <div className="stat-content">
              <span className="stat-icon">📦</span>
              <h2 className="stat-value">{data.salesData.totalOrders.toLocaleString()}</h2>
            </div>
          </Card>
          <Card title="Active Learners">
            <div className="stat-content">
              <span className="stat-icon">👥</span>
              <h2 className="stat-value">{data.activeLearners}</h2>
            </div>
          </Card>
          <Card title="Total Tracks">
            <div className="stat-content">
              <span className="stat-icon">📚</span>
              <h2 className="stat-value">{data.totalTracks}</h2>
            </div>
          </Card>
        </div>

        {/* Top-Selling Tracks */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Top-Selling Tracks</h2>
          {data.topSellingTracks.length === 0 ? <p style={{padding:'10px', color:'#666'}}>No sales data yet.</p> : (
            <Table
                headers={["Rank", "Track Title", "Sales", "Revenue"]}
                rows={data.topSellingTracks.map((track, index) => [
                `#${index + 1}`,
                track.title,
                track.sales,
                `$${track.revenue.toLocaleString()}`
                ])}
            />
          )}
        </div>

        {/* Top Learners (Placeholder) */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Top Learners</h2>
          <p style={{padding:'10px', color:'#666'}}>
            <i>Data not available in summary stats endpoint.</i>
          </p>
        </div>

        {/* Most Attempted Exams (Placeholder) */}
        <div className="custom-card">
          <h2>Most Attempted Exams</h2>
          <p style={{padding:'10px', color:'#666'}}>
            <i>Data not available in summary stats endpoint.</i>
          </p>
        </div>

        {/* Export Options */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button className="custom-btn" style={{ marginRight: "0.5rem" }} onClick={() => alert("Export feature coming soon!")}>
            📥 Export Sales Report
          </button>
          <button className="custom-btn" style={{ marginRight: "0.5rem" }} onClick={() => alert("Export feature coming soon!")}>
            📥 Export Learner Report
          </button>
          <button className="custom-btn" onClick={() => alert("Export feature coming soon!")}>
            📥 Export Exam Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;