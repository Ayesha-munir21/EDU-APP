import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const API_BASE_URL = "https://ceretification-app.onrender.com";

const QuestionsView = () => {
  const { trackId } = useParams(); // This grabs the ID from the URL
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debugging: Check if ID is being read
    console.log("Current Track ID:", trackId);

    if (!trackId) {
      setError("Invalid Track ID (URL parameter missing)");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${API_BASE_URL}/api/admin/tracks/${trackId}/all-questions`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setQuestions(data);
        } else {
          setError("Failed to load questions.");
        }
      } catch (err) {
        console.error(err);
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [trackId]);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1>Questions Repository</h1>
            <button className="custom-btn" onClick={() => navigate(-1)}>← Back</button>
        </div>

        {loading ? <p>Loading questions...</p> : 
         error ? <p style={{ color: "red" }}>{error}</p> : 
         questions.length === 0 ? (
          <div className="custom-card" style={{ textAlign: "center", padding: "2rem" }}>
            <h3>No Questions Found</h3>
            <p style={{ color: "#666" }}>This track has no questions yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1.5rem" }}>
            {questions.map((q, index) => (
              <div key={index} className="custom-card" style={{padding: '20px'}}>
                <h3>Q{index+1}: {q.question}</h3>
                <div style={{marginTop:'10px'}}>
                    {q.options.map((opt, i) => (
                        <div key={i} style={{
                            padding:'8px', margin:'5px 0', borderRadius:'4px',
                            background: (q.correctAnswer === opt || q.correctAnswer === String(i) || (typeof opt==='string' && q.correctAnswer===opt.charAt(0))) ? '#dcfce7' : '#f3f4f6'
                        }}>
                           {opt}
                        </div>
                    ))}
                </div>
                <p style={{marginTop:'10px', color:'#d97706'}}><strong>Explanation:</strong> {q.explanation}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionsView;