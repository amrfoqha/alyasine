import React from "react";

const InputComponent = ({ label, type, name, value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <label className="text-xl font-bold text-gray-900" htmlFor={name}>
        {label}
      </label>
    </div>
  );
};

export default InputComponent;
