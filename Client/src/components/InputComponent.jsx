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
}) => {
  return (
    <div className="flex items-center justify-end gap-2" dir="rtl">
      <label
        className="text-xl font-bold text-gray-900"
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
