import React from "react";
import Table from "../../components/Table";
import Sidebar from "../../components/Sidebar";

const OrdersTablePage = () => {
  const columns = ["Order ID", "User", "Status", "Total", "Date"];
  const data = [
    { "Order ID":"ord001", "User":"Hassan", "Status":"Paid", "Total":"$99", "Date":"2025-11-07" },
    { "Order ID":"ord002", "User":"Ayesha", "Status":"Pending", "Total":"$49", "Date":"2025-11-06" }
  ];
  
  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1 style={{marginBottom:"1rem"}}>Orders</h1>
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
}

export default OrdersTablePage;
