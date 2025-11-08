import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Table from "../../components/Table";
import Modal from "../../components/Modal";

const AdminDashboard = () => {
  // Mock stats
  const stats = [
    { title: "Tracks", value: 12 },
    { title: "Exams", value: 25 },
    { title: "Users", value: 102 },
    { title: "Orders", value: 58 },
  ];

  // Mock table data
  const [tracks, setTracks] = useState([
    { id: 1, name: "AWS Cloud Practitioner", level: "Beginner", price: "$49" },
    { id: 2, name: "PMP Certification", level: "Advanced", price: "$99" },
    { id: 3, name: "Python Developer", level: "Intermediate", price: "$59" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTrack, setEditTrack] = useState(null);

  const handleEdit = (track) => {
    setEditTrack(track);
    setModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this track?")) {
      setTracks(tracks.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="admin-dashboard">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Welcome, Admin!</h1>

        {/* Stats Cards */}
        <div className="stats-grid">
          {stats.map((s, i) => (
            <Card key={i} title={s.title}>
              <h2>{s.value}</h2>
            </Card>
          ))}
        </div>

        {/* Tracks Table */}
        <div className="custom-card">
          <div className="card-title">All Tracks</div>
          <Table
            headers={["ID", "Track Name", "Level", "Price", "Actions"]}
            rows={tracks.map((track) => [
              track.id,
              track.name,
              track.level,
              track.price,
              <>
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(track)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(track.id)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Delete
                </button>
              </>,
            ])}
          />
        </div>

        {/* Modal for Add/Edit Track */}
        {modalOpen && (
          <Modal onClose={() => setModalOpen(false)}>
            <div className="modal-header">
              <h2>{editTrack ? "Edit Track" : "Add Track"}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-input">
                  <label>Track Name</label>
                  <input
                    type="text"
                    defaultValue={editTrack?.name || ""}
                  />
                </div>
                <div className="form-input">
                  <label>Level</label>
                  <select defaultValue={editTrack?.level || ""}>
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
                <div className="form-input">
                  <label>Price</label>
                  <input
                    type="text"
                    defaultValue={editTrack?.price || ""}
                  />
                </div>
                <button type="submit" className="custom-btn">
                  {editTrack ? "Update Track" : "Add Track"}
                </button>
              </form>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
