import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

// ✅ Use your live backend URL
const API_BASE_URL = "https://ceretification-app.onrender.com";

const UserEntitlements = () => {
  const { toasts, removeToast, success, error } = useToast();
  
  // State for form inputs
  const [userId, setUserId] = useState("");
  const [trackId, setTrackId] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle Grant/Revoke Logic
  const handleAction = async (actionType) => {
    // 1. Basic Validation
    if (!userId || !trackId) {
        error("Please enter both User ID and Track ID");
        return;
    }

    setLoading(true);
    const token = localStorage.getItem("accessToken");
    
    // 2. Determine Endpoint (Grant vs Revoke)
    const endpoint = actionType === "grant" 
        ? `${API_BASE_URL}/api/admin/entitlements/grant`
        : `${API_BASE_URL}/api/admin/entitlements/revoke`;

    try {
        // 3. Send Request to Backend
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: userId,
                type: "track",
                refId: trackId,
                reason: "Admin manual action"
            })
        });

        const data = await response.json();

        if (response.ok) {
            success(actionType === "grant" ? "Access Granted Successfully" : "Access Revoked Successfully");
            // Clear inputs on success
            setUserId("");
            setTrackId("");
        } else {
            throw new Error(data.detail || "Operation failed");
        }
    } catch (err) {
        console.error(err);
        error(err.message || "Network error");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div style={{flex:1, padding:"2rem"}}>
        <h1>Manage User Access</h1>
        
        <div className="custom-card" style={{maxWidth: "600px"}}>
            <div className="card-title">Grant / Revoke Course Access</div>
            
            <div className="card-body">
                <p style={{marginBottom: '20px', color: '#666'}}>
                    Manually give or remove course access for a specific user.
                </p>

                {/* User ID Input */}
                <div className="form-input">
                    <label>User ID (Database ID)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. user@gmail.com_2025..." 
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                    />
                    <small style={{color: '#888', display: 'block', marginTop: '5px'}}>
                        Copy the exact `_id` from your MongoDB 'users' collection.
                    </small>
                </div>

                {/* Track ID Input */}
                <div className="form-input" style={{marginTop: '1.5rem'}}>
                    <label>Track ID</label>
                    <input 
                        type="text" 
                        placeholder="e.g. AWS-DEA" 
                        value={trackId}
                        onChange={(e) => setTrackId(e.target.value)}
                        style={{width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc'}}
                    />
                </div>

                {/* Action Buttons */}
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                    <button 
                        className="custom-btn" 
                        style={{backgroundColor: '#10B981', flex: 1, color: 'white'}}
                        onClick={() => handleAction("grant")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "✅ Grant Access"}
                    </button>
                    
                    <button 
                        className="custom-btn" 
                        style={{backgroundColor: '#EF4444', flex: 1, color: 'white'}}
                        onClick={() => handleAction("revoke")}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "❌ Revoke Access"}
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default UserEntitlements;