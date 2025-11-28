import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown"; // ✅ Renders Markdown text nicely

// ✅ Use your Render Backend URL
const API_BASE_URL = "https://ceretification-app.onrender.com";

const SlideShow = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ INTEGRATION: Fetch Real Concepts from Backend
  useEffect(() => {
    const fetchConcepts = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          alert("Please log in to view slides.");
          navigate("/auth");
          return;
        }

        // Fetching concepts with full=true to get the slide content
        const response = await fetch(`${API_BASE_URL}/api/tracks/${courseId}/concepts?full=true`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.length === 0) {
             setError("No slides found for this track.");
          } else {
             // Map backend data to the format this component expects
             const mappedSlides = data.map((concept) => ({
                id: concept.id || concept._id,
                title: concept.title,
                // Fallback if explanation is missing
                content: concept.slide?.explanation || "No detailed content available for this slide."
             }));
             setSlides(mappedSlides);
          }
        } else if (response.status === 403) {
             setError("Access Denied: You must be enrolled in this track.");
        } else {
             setError("Failed to load slides.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error loading slides.");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchConcepts();
    }
  }, [courseId, navigate]);

  const nextSlide = () => {
    if (current < slides.length - 1) setCurrent(current + 1);
  };
  
  const prevSlide = () => {
    if (current > 0) setCurrent(current - 1);
  };

  // --- Loading & Error States ---
  if (loading) return <div style={{textAlign:"center", padding:"50px"}}>Loading Slides...</div>;
  
  if (error) return (
    <div style={{textAlign:"center", padding:"50px"}}>
        <h3 style={{color:"red"}}>{error}</h3>
        <button 
            style={{
                padding: "10px 20px", 
                backgroundColor: "#34d399", 
                color: "white", 
                border: "none", 
                borderRadius: "5px", 
                cursor: "pointer",
                marginTop: "10px"
            }}
            onClick={() => navigate("/dashboard")}
        >
            Go to Dashboard
        </button>
    </div>
  );

  const slide = slides[current];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f8f1",
        flexDirection: "column",
      }}
    >
      {slide && (
        <div
          style={{
            width: "800px",
            maxWidth: "90%",
            height: "500px",
            backgroundColor: "#fff",
            border: "2px solid #3eb489",
            borderRadius: "8px",
            padding: "2.5rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          {/* Slide Content Area */}
          <div style={{flex: 1, overflowY: "auto"}}>
            <h2 style={{ textAlign: "center", color: "#1f2937", marginBottom: "1.5rem", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>
                {slide.title} 
                <span style={{fontSize: "0.9rem", color: "#888", marginLeft: "10px", fontWeight: "normal"}}>
                    ({current + 1} / {slides.length})
                </span>
            </h2>
            
            {/* ✅ Render Markdown Content */}
            <div style={{ fontSize: "1.15rem", lineHeight: "1.8", color: "#4b5563" }}>
                <ReactMarkdown>{slide.content}</ReactMarkdown>
            </div>
          </div>
          
          {/* Navigation Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px", paddingTop: "20px", borderTop: "1px solid #eee" }}>
            <button
              onClick={prevSlide}
              disabled={current === 0}
              style={{
                  opacity: current === 0 ? 0.5 : 1, 
                  backgroundColor: "#6B7280", 
                  color: "white", 
                  padding: "8px 16px", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer"
              }}
            >
              ← Previous
            </button>
            
            <button
              style={{
                  backgroundColor: "#EF4444", 
                  color: "white", 
                  padding: "8px 16px", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer"
              }}
              onClick={() => navigate(-1)} 
            >
              Exit
            </button>
            
            <button
              onClick={nextSlide}
              disabled={current === slides.length - 1}
              style={{
                  opacity: current === slides.length - 1 ? 0.5 : 1, 
                  backgroundColor: "#34d399", 
                  color: "white", 
                  padding: "8px 16px", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer"
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideShow;