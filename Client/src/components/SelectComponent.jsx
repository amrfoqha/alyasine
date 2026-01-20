import React from "react";

const SelectComponent = ({ label, name, value, onChange, options }) => {
  return (
    <div className="flex flex-col gap-1 justify-items-end">
      <label htmlFor={name}>{label}</label>
      <select name={name} onChange={onChange} value={value}>
        <option value="">اختر</option>
        {options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
