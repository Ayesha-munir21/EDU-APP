import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const CouponManager = () => {
  const [coupon, setCoupon] = useState({code:"", type:"percent", value:0, active:true});
  const [coupons, setCoupons] = useState([
    {Code:"NEW20", Type:"percent", Value:20, Active:"Yes"}
  ]);

  const handleChange = e => {
    const {name,value} = e.target;
    setCoupon({...coupon, [name]: value});
  }

  const handleSave = () => {
    console.log("Coupon saved:", coupon);
    alert("Coupon saved (mock)!");
  }

  const columns = ["Code","Type","Value","Active"];

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1>Coupon Manager</h1>
        <div style={{marginTop:"1rem", marginBottom:"2rem", display:"grid", gap:"1rem", maxWidth:"400px"}}>
          <input type="text" name="code" placeholder="Code" value={coupon.code} onChange={handleChange} />
          <select name="type" value={coupon.type} onChange={handleChange}>
            <option>percent</option>
            <option>fixed</option>
          </select>
          <input type="number" name="value" placeholder="Value" value={coupon.value} onChange={handleChange} />
          <select name="active" value={coupon.active} onChange={handleChange}>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </select>
          <button onClick={handleSave}>Save Coupon</button>
        </div>

        <h2>Existing Coupons</h2>
        <Table columns={columns} data={coupons} />
      </div>
    </div>
  )
}

export default CouponManager;
