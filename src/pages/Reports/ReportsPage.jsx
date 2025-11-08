import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Card from "../../components/Card";

const ReportsPage = () => {
  // Mock data for reports
  const [salesData] = useState({
    totalSales: 45230,
    totalOrders: 1258,
    averageOrderValue: 35.98,
    monthlySales: [
      { month: "January", sales: 3200, orders: 89 },
      { month: "February", sales: 4100, orders: 114 },
      { month: "March", sales: 3800, orders: 105 },
      { month: "April", sales: 4500, orders: 125 },
      { month: "May", sales: 5200, orders: 145 },
      { month: "June", sales: 4800, orders: 133 },
    ],
  });

  const [topLearners] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", tracksCompleted: 8, examsPassed: 12, totalScore: 94 },
    { id: 2, name: "Jane Smith", email: "jane@example.com", tracksCompleted: 7, examsPassed: 10, totalScore: 91 },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", tracksCompleted: 6, examsPassed: 9, totalScore: 88 },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", tracksCompleted: 5, examsPassed: 8, totalScore: 87 },
    { id: 5, name: "David Brown", email: "david@example.com", tracksCompleted: 5, examsPassed: 7, totalScore: 85 },
  ]);

  const [mostAttemptedExams] = useState([
    { id: 1, title: "AWS Cloud Practitioner Exam", attempts: 456, passRate: 72, averageScore: 78 },
    { id: 2, title: "PMP Certification Exam", attempts: 389, passRate: 68, averageScore: 75 },
    { id: 3, title: "Python Developer Exam", attempts: 342, passRate: 75, averageScore: 81 },
    { id: 4, title: "React Mastery Exam", attempts: 298, passRate: 70, averageScore: 76 },
    { id: 5, title: "Docker Fundamentals Exam", attempts: 267, passRate: 80, averageScore: 83 },
  ]);

  const [topSellingTracks] = useState([
    { id: 1, title: "AWS Cloud Practitioner", sales: 234, revenue: 11466, learners: 198 },
    { id: 2, title: "PMP Certification", sales: 189, revenue: 18711, learners: 156 },
    { id: 3, title: "Python Developer", sales: 156, revenue: 9204, learners: 142 },
    { id: 4, title: "React Mastery", sales: 142, revenue: 9798, learners: 128 },
    { id: 5, title: "Docker Fundamentals", sales: 128, revenue: 4992, learners: 115 },
  ]);

  const [selectedPeriod, setSelectedPeriod] = useState("all");

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
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Sales Overview Cards */}
        <div className="stats-grid" style={{ marginBottom: "2rem" }}>
          <Card title="Total Sales">
            <div className="stat-content">
              <span className="stat-icon">💰</span>
              <h2 className="stat-value">${salesData.totalSales.toLocaleString()}</h2>
            </div>
          </Card>
          <Card title="Total Orders">
            <div className="stat-content">
              <span className="stat-icon">📦</span>
              <h2 className="stat-value">{salesData.totalOrders.toLocaleString()}</h2>
            </div>
          </Card>
          <Card title="Average Order Value">
            <div className="stat-content">
              <span className="stat-icon">📊</span>
              <h2 className="stat-value">${salesData.averageOrderValue.toFixed(2)}</h2>
            </div>
          </Card>
          <Card title="Active Learners">
            <div className="stat-content">
              <span className="stat-icon">👥</span>
              <h2 className="stat-value">{topLearners.length * 200}</h2>
            </div>
          </Card>
        </div>

        {/* Monthly Sales Chart */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Monthly Sales Trend</h2>
          <Table
            headers={["Month", "Sales ($)", "Orders", "Avg Order Value"]}
            rows={salesData.monthlySales.map((month) => [
              month.month,
              `$${month.sales.toLocaleString()}`,
              month.orders,
              `$${(month.sales / month.orders).toFixed(2)}`,
            ])}
          />
        </div>

        {/* Top-Selling Tracks */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Top-Selling Tracks</h2>
          <Table
            headers={["Rank", "Track Title", "Sales", "Revenue", "Active Learners"]}
            rows={topSellingTracks.map((track, index) => [
              `#${index + 1}`,
              track.title,
              track.sales,
              `$${track.revenue.toLocaleString()}`,
              track.learners,
            ])}
          />
        </div>

        {/* Top Learners */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Top Learners</h2>
          <Table
            headers={["Rank", "Name", "Email", "Tracks Completed", "Exams Passed", "Average Score"]}
            rows={topLearners.map((learner, index) => [
              `#${index + 1}`,
              learner.name,
              learner.email,
              learner.tracksCompleted,
              learner.examsPassed,
              `${learner.totalScore}%`,
            ])}
          />
        </div>

        {/* Most Attempted Exams */}
        <div className="custom-card">
          <h2>Most Attempted Exams</h2>
          <Table
            headers={["Rank", "Exam Title", "Total Attempts", "Pass Rate", "Average Score"]}
            rows={mostAttemptedExams.map((exam, index) => [
              `#${index + 1}`,
              exam.title,
              exam.attempts,
              `${exam.passRate}%`,
              `${exam.averageScore}%`,
            ])}
          />
        </div>

        {/* Export Options */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button className="custom-btn" style={{ marginRight: "0.5rem" }}>
            📥 Export Sales Report
          </button>
          <button className="custom-btn" style={{ marginRight: "0.5rem" }}>
            📥 Export Learner Report
          </button>
          <button className="custom-btn">
            📥 Export Exam Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

