import React from "react";
import Select from "react-select";

const SelectComponent = ({
  label,
  name,
  value,
  onChange,
  options = [],
  optionLabel = "name",
  optionValue = "_id",
  placeholder = "اختر...",
  className = "",
}) => {
  //   const formattedOptions = options.map((option) => ({
  //     _id: option[optionValue],
  //     name: option[optionLabel],
  //   }));

  const selectedOption = options.find((opt) => opt._id === value) || null;

  return (
    <div className={`flex flex-row gap-2 items-center  w-full ${className}`}>
      <label className="text-xl font-bold text-gray-900 w-auto">{label}</label>

      <div className="flex-1 w-full">
        <Select
          name={name}
          options={options}
          value={selectedOption}
          getOptionLabel={(option) => option[optionLabel]}
          getOptionValue={(option) => option[optionValue]}
          onChange={(e) => onChange(e)}
          isClearable
          isSearchable
          placeholder={placeholder}
          className="w-full min-w-48 max-w-48"
        />
      </div>
    </div>
  );
};

export default SelectComponent;
