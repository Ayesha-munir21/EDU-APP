import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // Added Sidebar for Admin consistency

// ✅ Use your Render Backend URL
const API_BASE_URL = "https://ceretification-app.onrender.com";

const ConceptList = () => {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Real Tracks from Backend
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        // Using the public tracks endpoint to list all available courses
        const response = await fetch(`${API_BASE_URL}/api/tracks?status=active`);
        if (response.ok) {
          const data = await response.json();
          setTracks(data);
        } else {
          console.error("Failed to fetch tracks");
        }
      } catch (error) {
        console.error("Error loading tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Default image in case one is missing
  const FALLBACK_IMAGE = "https://cdn-icons-png.flaticon.com/512/2436/2436874.png";

  return (
    <div style={{ display: "flex" }}>
      {/* Added Sidebar to keep Admin layout consistent */}
      <Sidebar />
      
      <div style={{ flex: 1, padding: "2rem", backgroundColor: "#f9fafb" }}>
        <h1 className="page-title" style={{ fontSize: "2rem", color: "#1f2937", marginBottom: "2rem" }}>
            Available Courses
        </h1>

        {loading ? (
            <p style={{ textAlign: "center", marginTop: "50px" }}>Loading Courses...</p>
        ) : tracks.length === 0 ? (
            <p style={{ textAlign: "center", marginTop: "50px" }}>No courses found.</p>
        ) : (
            <div className="course-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "2rem" }}>
            {tracks.map((track) => (
                <div className="course-card" key={track.id || track._id} style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)", textAlign: "center" }}>
                <img
                    src={track.cover_image || FALLBACK_IMAGE}
                    alt={`${track.title} icon`}
                    className="course-icon"
                    style={{ width: "64px", height: "64px", objectFit: "contain", marginBottom: "1rem" }}
                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
                <h2 className="course-name" style={{ fontSize: "1.25rem", color: "#111827", marginBottom: "0.5rem" }}>
                    {track.title}
                </h2>
                <p className="course-desc" style={{ fontSize: "0.9rem", color: "#6b7280", marginBottom: "1.5rem", height: "40px", overflow: "hidden" }}>
                    {track.description || "No description available."}
                </p>
                
                <button
                    className="details-btn"
                    onClick={() => navigate(`/track-details?id=${track.id || track._id}`)}
                    style={{
                        backgroundColor: "#34D399",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        border: "none",
                        fontWeight: "600",
                        cursor: "pointer",
                        width: "100%",
                        transition: "background 0.2s"
                    }}
                >
                    View Details
                </button>
                </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ConceptList;