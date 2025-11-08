import React from "react";
import Sidebar from "../../components/Sidebar";
import Table from "../../components/Table";

const UserEntitlements = () => {
  const columns = ["User", "Entitlement Type", "Ref ID", "Action"];
  const data = [
    {User:"Hassan", "Entitlement Type":"Track", "Ref ID":"t001", Action:"Revoke"},
    {User:"Ayesha", "Entitlement Type":"Bundle", "Ref ID":"b001", Action:"Grant"}
  ];

  return (
    <div style={{display:"flex"}}>
      <Sidebar />
      <div style={{flex:1, padding:"2rem"}}>
        <h1>User Entitlements</h1>
        <Table columns={columns} data={data} />
      </div>
    </div>
  )
}

export default UserEntitlements;
