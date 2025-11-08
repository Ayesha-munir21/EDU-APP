import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const PricingManager = () => {
  const [tracks, setTracks] = useState([
    { id: 1, title: "AWS Cloud Practitioner", level: "Beginner", currentPrice: 49, status: "published" },
    { id: 2, title: "PMP Certification", level: "Advanced", currentPrice: 99, status: "published" },
    { id: 3, title: "Python Developer", level: "Intermediate", currentPrice: 59, status: "published" },
    { id: 4, title: "React Mastery", level: "Intermediate", currentPrice: 69, status: "published" },
    { id: 5, title: "Docker Fundamentals", level: "Beginner", currentPrice: 39, status: "draft" },
  ]);

  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [newPrice, setNewPrice] = useState("");

  const handleSetPrice = (track) => {
    setSelectedTrack(track);
    setNewPrice(track.currentPrice.toString());
    setShowPriceModal(true);
  };

  const handleSavePrice = () => {
    if (!selectedTrack || !newPrice) return;
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
      alert("Please enter a valid price");
      return;
    }
    setTracks(
      tracks.map((t) =>
        t.id === selectedTrack.id ? { ...t, currentPrice: price } : t
      )
    );
    alert(`Price updated for ${selectedTrack.title} to $${price}`);
    setShowPriceModal(false);
    setSelectedTrack(null);
    setNewPrice("");
  };

  const handleBulkUpdate = (percentage) => {
    if (window.confirm(`Apply ${percentage > 0 ? "+" : ""}${percentage}% to all track prices?`)) {
      setTracks(
        tracks.map((t) => ({
          ...t,
          currentPrice: Math.round(t.currentPrice * (1 + percentage / 100) * 100) / 100,
        }))
      );
      alert("Bulk price update applied!");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Pricing Management</h1>
          <div>
            <button
              className="custom-btn"
              onClick={() => handleBulkUpdate(10)}
              style={{ marginRight: "0.5rem" }}
            >
              📈 +10% All
            </button>
            <button
              className="custom-btn"
              onClick={() => handleBulkUpdate(-10)}
            >
              📉 -10% All
            </button>
          </div>
        </div>

        <div className="custom-card">
          <h2>Track Pricing</h2>
          <Table
            headers={["Track Title", "Level", "Current Price", "Status", "Actions"]}
            rows={tracks.map((track) => [
              track.title,
              track.level,
              `$${track.currentPrice.toFixed(2)}`,
              <span
                style={{
                  padding: "0.25rem 0.5rem",
                  borderRadius: "4px",
                  background: track.status === "published" ? "#d9f0e6" : "#fef3c7",
                  color: track.status === "published" ? "#059669" : "#92400e",
                  fontWeight: "500",
                }}
              >
                {track.status}
              </span>,
              <>
                <button
                  className="edit-btn"
                  onClick={() => handleSetPrice(track)}
                >
                  Set Price
                </button>
              </>,
            ])}
          />
        </div>

        {/* Price Summary */}
        <div className="custom-card" style={{ marginTop: "2rem" }}>
          <h2>Pricing Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Total Tracks</p>
              <h2 style={{ color: "#047857" }}>{tracks.length}</h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Average Price</p>
              <h2 style={{ color: "#047857" }}>
                ${(tracks.reduce((sum, t) => sum + t.currentPrice, 0) / tracks.length).toFixed(2)}
              </h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Lowest Price</p>
              <h2 style={{ color: "#047857" }}>
                ${Math.min(...tracks.map((t) => t.currentPrice)).toFixed(2)}
              </h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Highest Price</p>
              <h2 style={{ color: "#047857" }}>
                ${Math.max(...tracks.map((t) => t.currentPrice)).toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        {/* Set Price Modal */}
        {showPriceModal && selectedTrack && (
          <Modal onClose={() => setShowPriceModal(false)}>
            <div className="modal-header">
              <h2>Set Price: {selectedTrack.title}</h2>
              <button className="modal-close" onClick={() => setShowPriceModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Current Price</label>
                <input
                  type="text"
                  value={`$${selectedTrack.currentPrice.toFixed(2)}`}
                  disabled
                  style={{ background: "#f3f4f6" }}
                />
              </div>
              <div className="form-input">
                <label>New Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter new price"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                />
              </div>
              <div style={{ marginTop: "1rem", padding: "1rem", background: "#f0f8f1", borderRadius: "8px" }}>
                <p style={{ margin: 0, color: "#047857" }}>
                  <strong>Level:</strong> {selectedTrack.level}
                </p>
                <p style={{ margin: "0.5rem 0 0 0", color: "#047857" }}>
                  <strong>Status:</strong> {selectedTrack.status}
                </p>
              </div>
              <button className="custom-btn" onClick={handleSavePrice} style={{ marginTop: "1rem", width: "100%" }}>
                Update Price
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default PricingManager;

