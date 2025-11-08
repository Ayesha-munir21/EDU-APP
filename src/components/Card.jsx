import React from "react";

const Card = ({ title, children }) => {
  return (
    <div className="custom-card">
      <div className="card-title">{title}</div>
      <div className="card-body">{children}</div>
    </div>
  );
};

export default Card;
