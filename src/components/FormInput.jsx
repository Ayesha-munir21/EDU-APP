import React from "react";

const FormInput = ({ label, type = "text", value, onChange, placeholder, required = false }) => {
  return (
    <div className="form-input">
      {label && <label>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
};

export default FormInput;
