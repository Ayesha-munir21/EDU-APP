import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import { useToast } from "../../hooks/useToast"; // Assuming you have this hook
import ToastContainer from "../../components/ToastContainer"; // Assuming you have this

const API_BASE_URL = "https://ceretification-app.onrender.com";

const Settings = () => {
  const [adminData, setAdminData] = useState({
    email: "",
    role: "",
    id: ""
  });
  
  // Admin List State (Local for now, as backend doesn't have a 'list admins' endpoint yet)
  const [admins, setAdmins] = useState([
    { email: "admin1@edora.com", role: "Super Admin" },
    { email: "support@edora.com", role: "Admin" },
  ]);

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ email: "", password: "", role: "Admin" });
  const { toasts, removeToast, success, error } = useToast();

  // 1. Fetch Current Admin Info
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/api/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setAdminData({
            email: data.email,
            role: data.roles?.includes("admin") ? "Administrator" : "User",
            id: data._id
          });
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle Add Admin (Mock logic - requires backend update to support creating admins)
  const handleAddAdmin = () => {
    if (newAdmin.email && newAdmin.password) {
      setAdmins([...admins, { email: newAdmin.email, role: newAdmin.role }]);
      setNewAdmin({ email: "", password: "", role: "Admin" });
      setShowAddAdmin(false);
      success("New admin added locally!");
    } else {
      error("Please fill all fields!");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Settings</h1>

        {/* Profile Settings Card */}
        <div className="custom-card" style={{ marginBottom: "2rem", maxWidth: "600px" }}>
          <div className="card-title">My Profile</div>
          
          <div style={{ display: "grid", gap: "1rem" }}>
             <div className="form-input">
                <label>Primary Email</label>
                <input type="text" value={adminData.email} disabled style={{ background: "#f3f4f6" }} />
             </div>

             <div className="form-input">
                <label>Role</label>
                <input type="text" value={adminData.role} disabled style={{ background: "#f3f4f6" }} />
             </div>
             
             <div className="form-input">
                <label>Password</label>
                <input type="password" value="********" disabled style={{ background: "#f3f4f6" }} />
                <button style={{ marginTop: "5px", fontSize: "0.8rem", color: "#34D399", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                    Change Password
                </button>
             </div>
          </div>
        </div>

        {/* Manage Admins Card */}
        <div className="custom-card" style={{ maxWidth: "800px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="card-title">Manage Admins</div>
            <button className="custom-btn" onClick={() => setShowAddAdmin(true)}>
              ➕ Add Admin
            </button>
          </div>

          {/* Admin List Table */}
          <table className="custom-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin, index) => (
                <tr key={index}>
                  <td>{admin.email}</td>
                  <td>
                    <span style={{ background: "#e0f2fe", color: "#0369a1", padding: "2px 8px", borderRadius: "10px", fontSize: "0.85rem" }}>
                        {admin.role}
                    </span>
                  </td>
                  <td style={{ color: "green" }}>Active</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add Admin Modal (Inline) */}
        {showAddAdmin && (
          <div className="modal-overlay" onClick={() => setShowAddAdmin(false)}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Admin</h3>
                <button className="modal-close" onClick={() => setShowAddAdmin(false)}>×</button>
              </div>
              <div className="modal-body">
                 <div className="form-input">
                    <label>Email</label>
                    <input 
                        type="email" 
                        value={newAdmin.email} 
                        onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})} 
                        placeholder="admin@example.com"
                    />
                 </div>
                 <div className="form-input">
                    <label>Password</label>
                    <input 
                        type="password" 
                        value={newAdmin.password} 
                        onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})} 
                        placeholder="Secure Password"
                    />
                 </div>
                 <div className="form-input">
                    <label>Role</label>
                    <select value={newAdmin.role} onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}>
                        <option>Admin</option>
                        <option>Super Admin</option>
                    </select>
                 </div>
                 <button className="custom-btn" onClick={handleAddAdmin} style={{ width: "100%" }}>
                    Save Admin
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Settings;