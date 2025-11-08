import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const BundleBuilder = () => {
  // Available tracks to choose from
  const [availableTracks] = useState([
    { id: 1, title: "AWS Cloud Practitioner", price: 49 },
    { id: 2, title: "PMP Certification", price: 99 },
    { id: 3, title: "Python Developer", price: 59 },
    { id: 4, title: "React Mastery", price: 69 },
    { id: 5, title: "Docker Fundamentals", price: 39 },
    { id: 6, title: "Kubernetes Advanced", price: 89 },
  ]);

  const [bundles, setBundles] = useState([
    {
      id: 1,
      title: "Cloud Pack",
      tracks: [1, 2],
      price: 149,
      discount: 25,
    },
    {
      id: 2,
      title: "Developer Bundle",
      tracks: [3, 4],
      price: 99,
      discount: 30,
    },
  ]);

  const [showBundleModal, setShowBundleModal] = useState(false);
  const [currentBundle, setCurrentBundle] = useState(null);
  const [newBundle, setNewBundle] = useState({
    title: "",
    selectedTracks: [],
    price: 0,
    discount: 0,
  });

  const calculateTotalPrice = (trackIds) => {
    return trackIds.reduce((sum, trackId) => {
      const track = availableTracks.find((t) => t.id === trackId);
      return sum + (track ? track.price : 0);
    }, 0);
  };

  const handleAddBundle = () => {
    setCurrentBundle(null);
    setNewBundle({ title: "", selectedTracks: [], price: 0, discount: 0 });
    setShowBundleModal(true);
  };

  const handleEditBundle = (bundle) => {
    setCurrentBundle(bundle);
    setNewBundle({
      title: bundle.title,
      selectedTracks: bundle.tracks,
      price: bundle.price,
      discount: bundle.discount,
    });
    setShowBundleModal(true);
  };

  const handleSaveBundle = () => {
    if (!newBundle.title || newBundle.selectedTracks.length === 0) {
      alert("Please provide a title and select at least one track");
      return;
    }

    const totalPrice = calculateTotalPrice(newBundle.selectedTracks);
    const bundlePrice = newBundle.price || totalPrice * (1 - newBundle.discount / 100);

    const bundle = {
      id: currentBundle?.id || Date.now(),
      title: newBundle.title,
      tracks: newBundle.selectedTracks,
      price: bundlePrice,
      discount: newBundle.discount,
    };

    if (currentBundle) {
      setBundles(bundles.map((b) => (b.id === currentBundle.id ? bundle : b)));
    } else {
      setBundles([...bundles, bundle]);
    }

    setShowBundleModal(false);
    setCurrentBundle(null);
    setNewBundle({ title: "", selectedTracks: [], price: 0, discount: 0 });
  };

  const handleDeleteBundle = (id) => {
    if (window.confirm("Are you sure you want to delete this bundle?")) {
      setBundles(bundles.filter((b) => b.id !== id));
    }
  };

  const toggleTrackSelection = (trackId) => {
    const isSelected = newBundle.selectedTracks.includes(trackId);
    if (isSelected) {
      setNewBundle({
        ...newBundle,
        selectedTracks: newBundle.selectedTracks.filter((id) => id !== trackId),
      });
    } else {
      setNewBundle({
        ...newBundle,
        selectedTracks: [...newBundle.selectedTracks, trackId],
      });
    }
  };

  const getTrackNames = (trackIds) => {
    return trackIds
      .map((id) => {
        const track = availableTracks.find((t) => t.id === id);
        return track ? track.title : `Track ${id}`;
      })
      .join(", ");
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Bundle Builder</h1>
          <button className="custom-btn" onClick={handleAddBundle}>
            ➕ Create Bundle
          </button>
        </div>

        {/* Existing Bundles */}
        <div className="custom-card">
          <h2>Existing Bundles</h2>
          {bundles.length === 0 ? (
            <p style={{ color: "#666" }}>No bundles created yet. Click "Create Bundle" to get started.</p>
          ) : (
            <Table
              headers={["Bundle Title", "Tracks", "Individual Price", "Bundle Price", "Discount", "Savings", "Actions"]}
              rows={bundles.map((bundle) => {
                const individualTotal = calculateTotalPrice(bundle.tracks);
                const savings = individualTotal - bundle.price;
                return [
                  bundle.title,
                  getTrackNames(bundle.tracks),
                  `$${individualTotal.toFixed(2)}`,
                  `$${bundle.price.toFixed(2)}`,
                  `${bundle.discount}%`,
                  `$${savings.toFixed(2)}`,
                  <div className="action-buttons-group">
                    <button className="edit-btn" onClick={() => handleEditBundle(bundle)}>
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteBundle(bundle.id)}
                    >
                      Delete
                    </button>
                  </div>,
                ];
              })}
            />
          )}
        </div>

        {/* Bundle Summary */}
        <div className="custom-card" style={{ marginTop: "2rem" }}>
          <h2>Bundle Summary</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Total Bundles</p>
              <h2 style={{ color: "#047857" }}>{bundles.length}</h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Total Tracks in Bundles</p>
              <h2 style={{ color: "#047857" }}>
                {bundles.reduce((sum, b) => sum + b.tracks.length, 0)}
              </h2>
            </div>
            <div>
              <p style={{ color: "#666", marginBottom: "0.5rem" }}>Average Discount</p>
              <h2 style={{ color: "#047857" }}>
                {bundles.length > 0
                  ? `${(bundles.reduce((sum, b) => sum + b.discount, 0) / bundles.length).toFixed(1)}%`
                  : "0%"}
              </h2>
            </div>
          </div>
        </div>

        {/* Create/Edit Bundle Modal */}
        {showBundleModal && (
          <Modal onClose={() => setShowBundleModal(false)}>
            <div className="modal-header">
              <h2>{currentBundle ? "Edit Bundle" : "Create Bundle"}</h2>
              <button className="modal-close" onClick={() => setShowBundleModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Bundle Title</label>
                <input
                  type="text"
                  placeholder="e.g., Cloud Pack"
                  value={newBundle.title}
                  onChange={(e) => setNewBundle({ ...newBundle, title: e.target.value })}
                />
              </div>

              <div className="form-input">
                <label>Select Tracks</label>
                <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #ddd", borderRadius: "8px", padding: "0.5rem" }}>
                  {availableTracks.map((track) => (
                    <label
                      key={track.id}
                      style={{
                        display: "block",
                        padding: "0.5rem",
                        marginBottom: "0.5rem",
                        background: newBundle.selectedTracks.includes(track.id) ? "#d9f0e6" : "#f9fafb",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={newBundle.selectedTracks.includes(track.id)}
                        onChange={() => toggleTrackSelection(track.id)}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {track.title} - ${track.price}
                    </label>
                  ))}
                </div>
                {newBundle.selectedTracks.length > 0 && (
                  <p style={{ marginTop: "0.5rem", color: "#047857", fontWeight: "500" }}>
                    Selected: {newBundle.selectedTracks.length} track(s)
                  </p>
                )}
              </div>

              {newBundle.selectedTracks.length > 0 && (
                <>
                  <div style={{ padding: "1rem", background: "#f0f8f1", borderRadius: "8px", marginBottom: "1rem" }}>
                    <p style={{ margin: 0, color: "#047857" }}>
                      <strong>Individual Total:</strong> ${calculateTotalPrice(newBundle.selectedTracks).toFixed(2)}
                    </p>
                  </div>

                  <div className="form-input">
                    <label>Discount (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="0"
                      value={newBundle.discount}
                      onChange={(e) => {
                        const discount = parseFloat(e.target.value) || 0;
                        const total = calculateTotalPrice(newBundle.selectedTracks);
                        setNewBundle({
                          ...newBundle,
                          discount,
                          price: total * (1 - discount / 100),
                        });
                      }}
                    />
                  </div>

                  <div className="form-input">
                    <label>Bundle Price ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="Auto-calculated"
                      value={newBundle.price}
                      onChange={(e) => {
                        const price = parseFloat(e.target.value) || 0;
                        const total = calculateTotalPrice(newBundle.selectedTracks);
                        const discount = total > 0 ? ((total - price) / total) * 100 : 0;
                        setNewBundle({ ...newBundle, price, discount });
                      }}
                    />
                  </div>

                  {newBundle.price > 0 && (
                    <div style={{ padding: "1rem", background: "#fef3c7", borderRadius: "8px", marginTop: "0.5rem" }}>
                      <p style={{ margin: 0, color: "#92400e" }}>
                        <strong>Savings:</strong> $
                        {(calculateTotalPrice(newBundle.selectedTracks) - newBundle.price).toFixed(2)} (
                        {newBundle.discount.toFixed(1)}% off)
                      </p>
                    </div>
                  )}
                </>
              )}

              <button className="custom-btn" onClick={handleSaveBundle} style={{ marginTop: "1rem", width: "100%" }}>
                {currentBundle ? "Update Bundle" : "Create Bundle"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default BundleBuilder;
