import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";
import Modal from "../../components/Modal";
import { useToast } from "../../hooks/useToast";
import ToastContainer from "../../components/ToastContainer";

// ✅ Use your Render Backend URL
const API_BASE_URL = "https://ceretification-app.onrender.com";

const TrackEditor = () => {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [loading, setLoading] = useState(false);

  const [track, setTrack] = useState({
    title: "",
    description: "",
    level: "Beginner",
    coverImage: "",
    status: "draft",
  });

  const [modules, setModules] = useState([]);
  const [slides, setSlides] = useState({}); 
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [newModule, setNewModule] = useState({ title: "", order: 1, colorTag: "" });
  const [newSlide, setNewSlide] = useState({ title: "", text: "", example: "" });

  const handleTrackChange = (e) => {
    const { name, value } = e.target;
    setTrack({ ...track, [name]: value });
  };

  // ✅ INTEGRATED SAVE FUNCTION
  const handleSaveTrack = async () => {
    setLoading(true);
    const token = localStorage.getItem("accessToken");

    // Prepare Payload for Backend
    const payload = {
        title: track.title,
        description: track.description,
        level: track.level.toLowerCase(), // Convert to lowercase for backend Enum
        cover_image: track.coverImage,    // Map frontend 'coverImage' to backend 'cover_image'
        status: track.status
    };

    try {
      // Send POST Request
      const response = await fetch(`${API_BASE_URL}/api/admin/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        // Success handling
        success(`Track created successfully! AI generated ${data.tutorial_slides_imported} slides.`);
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        // Error handling
        throw new Error(data.detail || "Failed to create track");
      }
    } catch (err) {
      console.error("Save Error:", err);
      error(err.message || "Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // ... (Keep existing UI handlers for Modules/Slides as is) ...

  const handleAddModule = () => {
    const moduleId = Date.now();
    const module = { id: moduleId, ...newModule, order: modules.length + 1 };
    setModules([...modules, module]);
    setSlides({ ...slides, [moduleId]: [] });
    setNewModule({ title: "", order: 1, colorTag: "" });
    setShowModuleModal(false);
  };

  const handleAddSlide = () => {
    if (!currentModuleId) return;
    const slide = { id: Date.now(), ...newSlide };
    setSlides({ ...slides, [currentModuleId]: [...(slides[currentModuleId] || []), slide] });
    setNewSlide({ title: "", text: "", example: "" });
    setShowSlideModal(false);
    setCurrentModuleId(null);
  };

  const handleDeleteModule = (moduleId) => {
    if (window.confirm("Are you sure you want to delete this module?")) {
      setModules(modules.filter((m) => m.id !== moduleId));
      const newSlides = { ...slides };
      delete newSlides[moduleId];
      setSlides(newSlides);
    }
  };

  const handleDeleteSlide = (moduleId, slideId) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      setSlides({
        ...slides,
        [moduleId]: slides[moduleId].filter((s) => s.id !== slideId),
      });
    }
  };

  const openSlideModal = (moduleId) => {
    setCurrentModuleId(moduleId);
    setShowSlideModal(true);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      
      <div style={{ flex: 1, padding: "2rem" }}>
        <h1>Create / Edit Track</h1>

        {/* Track Basic Info */}
        <div className="custom-card" style={{ marginBottom: "2rem" }}>
          <h2>Track Information</h2>
          <div style={{ display: "grid", gap: "1rem", maxWidth: "600px" }}>
            <div className="form-input">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="Track Title"
                value={track.title}
                onChange={handleTrackChange}
              />
            </div>
            <div className="form-input">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Track Description"
                value={track.description}
                onChange={handleTrackChange}
                rows="4"
              />
            </div>
            <div className="form-input">
              <label>Level</label>
              <select name="level" value={track.level} onChange={handleTrackChange}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <div className="form-input">
              <label>Cover Image URL</label>
              <input
                type="text"
                name="coverImage"
                placeholder="https://example.com/image.jpg"
                value={track.coverImage}
                onChange={handleTrackChange}
              />
            </div>
            <div className="form-input">
              <label>Status</label>
              <select name="status" value={track.status} onChange={handleTrackChange}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
            
            {/* Updated Button with Loading State */}
            <button 
                className="custom-btn" 
                onClick={handleSaveTrack}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Creating & Generating AI Content..." : "Save Track"}
            </button>
          </div>
        </div>

        {/* Modules Section (Kept exactly as provided) */}
        <div className="custom-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Modules</h2>
            <button className="custom-btn" onClick={() => setShowModuleModal(true)}>
              ➕ Add Module
            </button>
          </div>

          {modules.length === 0 ? (
            <p style={{ color: "#666" }}>No modules added yet. Click "Add Module" to get started.</p>
          ) : (
            modules
              .sort((a, b) => a.order - b.order)
              .map((module) => (
                <div key={module.id} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #ddd", borderRadius: "8px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div>
                      <h3>{module.title}</h3>
                      <p style={{ color: "#666", fontSize: "0.9rem" }}>
                        Order: {module.order} | Color Tag: {module.colorTag || "None"}
                      </p>
                    </div>
                    <div>
                      <button
                        className="edit-btn"
                        onClick={() => openSlideModal(module.id)}
                        style={{ marginRight: "0.5rem" }}
                      >
                        ➕ Add Slide
                      </button>
                      <button className="delete-btn" onClick={() => handleDeleteModule(module.id)}>
                        🗑️ Delete Module
                      </button>
                    </div>
                  </div>

                  {/* Slides for this module */}
                  {slides[module.id] && slides[module.id].length > 0 ? (
                    <div>
                      <h4>Slides ({slides[module.id].length})</h4>
                      <Table
                        headers={["Title", "Text Preview", "Example", "Actions"]}
                        rows={slides[module.id].map((slide) => [
                          slide.title,
                          slide.text.substring(0, 50) + "...",
                          slide.example.substring(0, 30) + "...",
                          <>
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setNewSlide(slide);
                                setCurrentModuleId(module.id);
                                setShowSlideModal(true);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteSlide(module.id, slide.id)}
                              style={{ marginLeft: "0.5rem" }}
                            >
                              Delete
                            </button>
                          </>,
                        ])}
                      />
                    </div>
                  ) : (
                    <p style={{ color: "#999", fontStyle: "italic" }}>No slides in this module yet.</p>
                  )}
                </div>
              ))
          )}
        </div>

        {/* Add Module Modal */}
        {showModuleModal && (
          <Modal onClose={() => setShowModuleModal(false)}>
            <div className="modal-header">
              <h2>Add Module</h2>
              <button className="modal-close" onClick={() => setShowModuleModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Module Title</label>
                <input
                  type="text"
                  placeholder="e.g., VPC Basics"
                  value={newModule.title}
                  onChange={(e) => setNewModule({ ...newModule, title: e.target.value })}
                />
              </div>
              <div className="form-input">
                <label>Order</label>
                <input
                  type="number"
                  placeholder="1"
                  value={newModule.order}
                  onChange={(e) => setNewModule({ ...newModule, order: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-input">
                <label>Color Tag</label>
                <input
                  type="text"
                  placeholder="e.g., Networking"
                  value={newModule.colorTag}
                  onChange={(e) => setNewModule({ ...newModule, colorTag: e.target.value })}
                />
              </div>
              <button className="custom-btn" onClick={handleAddModule}>
                Add Module
              </button>
            </div>
          </Modal>
        )}

        {/* Add Slide Modal */}
        {showSlideModal && (
          <Modal onClose={() => setShowSlideModal(false)}>
            <div className="modal-header">
              <h2>Add Slide</h2>
              <button className="modal-close" onClick={() => setShowSlideModal(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-input">
                <label>Slide Title</label>
                <input
                  type="text"
                  placeholder="Slide Title"
                  value={newSlide.title}
                  onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
                />
              </div>
              <div className="form-input">
                <label>Text Content</label>
                <textarea
                  placeholder="Slide text content..."
                  value={newSlide.text}
                  onChange={(e) => setNewSlide({ ...newSlide, text: e.target.value })}
                  rows="5"
                />
              </div>
              <div className="form-input">
                <label>Example</label>
                <textarea
                  placeholder="Code example or explanation..."
                  value={newSlide.example}
                  onChange={(e) => setNewSlide({ ...newSlide, example: e.target.value })}
                  rows="4"
                />
              </div>
              <button className="custom-btn" onClick={handleAddSlide}>
                {newSlide.id ? "Update Slide" : "Add Slide"}
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default TrackEditor;