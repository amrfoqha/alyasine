import React from "react";

const ButtonComponent = ({ label, className, onClick }) => {
  return (
    <button
      className={`bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 cursor-pointer ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ButtonComponent;
