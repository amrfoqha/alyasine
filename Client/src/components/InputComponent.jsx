import React from "react";

const InputComponent = ({
  label,
  type,
  name,
  value,
  onChange,
  disabled,
  className,
  placeholder,
  minWidth,
}) => {
  return (
    <div className={`flex items-center justify-end gap-2 w-full ${minWidth}`} dir="rtl">
      <label
        className="text-lg font-bold text-gray-900 w-auto"
        htmlFor={name}
        dir="rtl"
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className} `}
        disabled={disabled || false}
        placeholder={placeholder}
      />
    </div>
  );
};

export default InputComponent;
