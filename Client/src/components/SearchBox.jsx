import React from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";

const SearchBox = ({ onChange }) => {
  return (
    <div className="flex flex-row-reverse items-center gap-2">
      <InputComponent
        label="بحث"
        type="text"
        className={"bg-white p-2"}
        placeholder="إبحث حسب الأسم"
        onChange={onChange}
      />
    </div>
  );
};

export default SearchBox;
