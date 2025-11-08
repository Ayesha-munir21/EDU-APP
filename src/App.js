// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/styles.css";

// Pages
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import TrackEditor from "./pages/Tracks/TrackEditor";
import ExamBuilder from "./pages/Exams/ExamBuilder";
import BundleBuilder from "./pages/Bundles/BundleBuilder";
import CouponManager from "./pages/Coupons/CouponManager";
import OrdersTable from "./pages/Orders/OrdersTable";
import UserEntitlements from "./pages/Users/UserEntitlements";
import PricingManager from "./pages/Pricing/PricingManager";
import ReportsPage from "./pages/Reports/ReportsPage";

function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <Router>
      <Routes>
        {/* ✅ Login page */}
        <Route path="/" element={<AdminLogin />} />

        {/* ✅ Dashboard pages – visible only when logged in */}
        {isAdmin && (
          <>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/tracks" element={<TrackEditor />} />
            <Route path="/exams" element={<ExamBuilder />} />
            <Route path="/pricing" element={<PricingManager />} />
            <Route path="/bundles" element={<BundleBuilder />} />
            <Route path="/coupons" element={<CouponManager />} />
            <Route path="/users" element={<UserEntitlements />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/orders" element={<OrdersTable />} />
          </>
        )}

       
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
