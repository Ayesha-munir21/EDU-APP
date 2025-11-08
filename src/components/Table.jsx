import React from "react";
import "../styles/styles.css"; // make sure your main CSS is linked

const Table = ({ columns = [], data = [] }) => {
  return (
    <div className="custom-card">
      <table className="custom-table">
        <thead>
          <tr>
            {columns && columns.length > 0 ? (
              columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))
            ) : (
              <th>No Columns</th>
            )}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>{row[col] || "-"}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length || 1}
                style={{ textAlign: "center", padding: "1rem" }}
              >
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
