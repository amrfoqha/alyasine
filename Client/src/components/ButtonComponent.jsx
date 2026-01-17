import React from "react";

const ButtonComponent = ({ label, className, onClick, type, disabled }) => {
  const disabledClass = disabled
    ? "bg-red-500 p-2 rounded-md cursor-not-allowed"
    : "bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer";
  return (
    <button
      className={` ${className} ${disabledClass}`}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
