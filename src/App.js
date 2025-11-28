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

// Detailed Views
import TrackDetails from "./pages/TrackDetails/TrackDetails";
import ConceptList from "./pages/ConceptList/ConceptList";
import Settings from "./pages/Settings/Settings";
import SlideShow from "./pages/Slides/SlideShow";
import QuestionsView from "./pages/Questions/QuestionsView";

function App() {
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  return (
    <Router>
      <Routes>
        {/* 1. Login Route */}
        <Route path="/" element={isAdmin ? <Navigate to="/dashboard" replace /> : <AdminLogin />} />

        {/* 2. Protected Admin Routes */}
        {isAdmin && (
          <>
            {/* Main Dashboard */}
            <Route path="/dashboard" element={<AdminDashboard />} />
            
            {/* Management Pages */}
            <Route path="/tracks" element={<TrackEditor />} />
            <Route path="/exams" element={<ExamBuilder />} />
            <Route path="/users" element={<UserEntitlements />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<Settings />} />
            
            {/* Content Browsing */}
            <Route path="/conceptlist" element={<ConceptList />} />
            
            {/* Track Details & Viewers */}
            <Route path="/track-details" element={<TrackDetails />} />
            <Route path="/slides/view/:courseId" element={<SlideShow />} />
            
            {/* ✅ FIX: Parameter name must be :trackId to match QuestionsView code */}
            <Route path="/questions/view/:trackId" element={<QuestionsView />} />

            {/* Placeholder Routes (Uncomment when ready) */}
            <Route path="/pricing" element={<PricingManager />} />
            <Route path="/bundles" element={<BundleBuilder />} />
            <Route path="/coupons" element={<CouponManager />} />
            <Route path="/orders" element={<OrdersTable />} />
          </>
        )}

        {/* 3. Catch-All */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;