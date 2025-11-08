import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const BundleBuilder = () => {
  const [bundle, setBundle] = useState({title:"", tracks:[], price:0});
  const [bundles, setBundles] = useState([
    {Title:"Cloud Pack", Tracks:"Track1,Track2", Price:"$149"}
  ]);

  const handleChange = e => setBundle({...bundle, [e.target.name]: e.target.value});

  const handleSave = () => {
    console.log("Bundle saved:", bundle);
    alert("Bundle saved (mock)!");
  }

  const columns = ["Title","Tracks","Price"];

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1>Bundle Builder</h1>
        <div style={{marginTop:"1rem", marginBottom:"2rem", display:"grid", gap:"1rem", maxWidth:"500px"}}>
          <input type="text" name="title" placeholder="Bundle Title" value={bundle.title} onChange={handleChange} />
          <input type="text" name="tracks" placeholder="Track IDs (comma separated)" value={bundle.tracks} onChange={handleChange} />
          <input type="number" name="price" placeholder="Price" value={bundle.price} onChange={handleChange} />
          <button onClick={handleSave}>Save Bundle</button>
        </div>

        <h2>Existing Bundles</h2>
        <Table columns={columns} data={bundles} />
      </div>
    </div>
  )
}

export default BundleBuilder;
