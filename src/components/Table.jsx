import React from "react";
import "../styles/styles.css"; // make sure your main CSS is linked

const Table = ({ columns = [], data = [], headers = [], rows = [] }) => {
  // Support both formats: columns/data (object array) and headers/rows (array array)
  const tableHeaders = headers.length > 0 ? headers : columns;
  const tableRows = rows.length > 0 ? rows : data;

  return (
    <div className="custom-card">
      <table className="custom-table">
        <thead>
          <tr>
            {tableHeaders && tableHeaders.length > 0 ? (
              tableHeaders.map((col, index) => (
                <th key={index}>{col}</th>
              ))
            ) : (
              <th>No Columns</th>
            )}
          </tr>
        </thead>

        <tbody>
          {tableRows && tableRows.length > 0 ? (
            tableRows.map((row, i) => (
              <tr key={i}>
                {Array.isArray(row) ? (
                  // If row is an array (headers/rows format)
                  row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))
                ) : (
                  // If row is an object (columns/data format)
                  tableHeaders.map((col, j) => (
                    <td key={j}>{row[col] || "-"}</td>
                  ))
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={tableHeaders.length || 1}
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
