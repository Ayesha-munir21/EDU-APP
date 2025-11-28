import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

// ✅ Use your Render Backend URL
const API_BASE_URL = "https://ceretification-app.onrender.com";

const TrackDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, removeToast, success, error } = useToast();

  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Get Track ID from URL Query (e.g. ?id=AWS-DEA)
  const queryParams = new URLSearchParams(location.search);
  const courseId = queryParams.get("id");

  // 2. Fetch Real Data from Backend
  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    const fetchTrack = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Call the Public API to get track details
        const response = await fetch(`${API_BASE_URL}/api/tracks/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          setTrack(data);
        } else {
          error("Failed to load track details. ID might be wrong.");
        }
      } catch (err) {
        console.error(err);
        error("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrack();
    // ✅ FIX: Added 'error' to the dependency array to solve the warning
  }, [courseId, error]); 

  // 3. Delete Functionality
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this track?")) return;

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/admin/tracks/${courseId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        success("Track deleted successfully.");
        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        const data = await response.json();
        error(data.detail || "Failed to delete track.");
      }
    } catch (err) {
      error("Network error during deletion.");
    }
  };

  // --- Loading State ---
  if (loading) return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem", textAlign: "center" }}>Loading Track Details...</div>
    </div>
  );

  // --- Not Found State ---
  if (!track) return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Track Not Found</h1>
        <p>The system could not find a track with ID: <strong>{courseId}</strong></p>
        <button className="custom-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
      </div>
    </div>
  );

  // --- Main UI (Real Data) ---
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      <div className="dashboard-content" style={{ flex: 1, padding: "2rem" }}>
        <h1>Track Details</h1>

        <div className="custom-card" style={{ maxWidth: "800px" }}>
          
          {/* Header: Image & Title */}
          <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "1rem" }}>
             <img 
                src={track.cover_image} 
                alt={track.title} 
                style={{ width: "80px", height: "80px", objectFit: "contain", border: "1px solid #eee", borderRadius: "8px" }}
                onError={(e) => { e.target.src = "https://cdn-icons-png.flaticon.com/512/2436/2436874.png"; }}
             />
             <div>
                {/* ✅ Displays Real Title from DB */}
                <h2 style={{ margin: 0, fontSize: "1.5rem", color: "#1f2937" }}>{track.title}</h2>
                <span style={{ 
                    background: "#e0f2fe", color: "#0284c7", 
                    padding: "4px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold",
                    textTransform: "uppercase", marginTop: "5px", display: "inline-block"
                }}>
                    {track.level}
                </span>
             </div>
          </div>

          {/* Description */}
          <p style={{ fontSize: "16px", color: "#555", marginBottom: "2rem", lineHeight: "1.6" }}>
            {track.description || "No description provided."}
          </p>

          {/* Stats (Optional) */}
          <div style={{ display: "flex", gap: "20px", marginBottom: "2rem", padding: "15px", background: "#f9fafb", borderRadius: "8px" }}>
             <span><strong>Exams:</strong> {track.exams_count || 0}</span>
             <span><strong>Slides:</strong> {track.concepts_count || 0}</span>
             <span><strong>Status:</strong> {track.status}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
            
            <button
              className="custom-btn"
              style={{ background: "#34d399", color: "white" }}
              onClick={() => navigate(`/slides/view/${courseId}`)}
            >
              📖 View Slides
            </button>

            <button
              className="custom-btn"
              style={{ background: "#3b82f6", color: "white" }}
              onClick={() => navigate(`/questions/view/${courseId}`)}
            >
              ❓ View Questions
            </button>

            <button
              className="custom-btn"
              style={{ background: "#ef4444", color: "white" }}
              onClick={handleDelete}
            >
              🗑️ Delete Track
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrackDetails;