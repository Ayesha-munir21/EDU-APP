import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const TrackEditor = () => {
  const [track, setTrack] = useState({
    title: "",
    description: "",
    level: "Beginner",
    estimatedHours: "",
    status: "draft"
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setTrack({...track, [name]: value});
  };

  const handleSave = () => {
    console.log("Track saved:", track);
    alert("Track saved (mock)!");
  };

  const columns = ["Module", "Order", "Color Tag"];
  const data = [
    { Module:"VPC Basics", Order:1, "Color Tag":"Networking" },
    { Module:"Subnetting", Order:2, "Color Tag":"Networking" }
  ];

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1>Create / Edit Track</h1>
        <div style={{marginTop:"1rem", marginBottom:"2rem", display:"grid", gap:"1rem", maxWidth:"600px"}}>
          <input type="text" name="title" placeholder="Title" value={track.title} onChange={handleChange} />
          <textarea name="description" placeholder="Description" value={track.description} onChange={handleChange} />
          <select name="level" value={track.level} onChange={handleChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
          <input type="number" name="estimatedHours" placeholder="Estimated Hours" value={track.estimatedHours} onChange={handleChange} />
          <select name="status" value={track.status} onChange={handleChange}>
            <option>draft</option>
            <option>published</option>
          </select>
          <button onClick={handleSave}>Save Track</button>
        </div>

        <h2>Modules</h2>
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
};

export default TrackEditor;
