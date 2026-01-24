import React, { useState } from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { createProductCategory } from "../API/ProductCategoryAPI";
import { toast } from "react-hot-toast";
const AddCategoryForm = ({ setProducts, products }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const handleChange = (e) => {
    setName(e.target.value);
    setNameError(e.target.value.length < 1 ? "الاسم يجب ان يحتوي على حرف" : "");
  };
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const product = await createProductCategory(name);
      setProducts((prev) => [product, ...prev]);
      toast.success("تم إضافة المنتج بنجاح");
      setName("");
      setNameError("");
    } catch (error) {
      setNameError(error.message);
      console.log(error.message);
    }
  };
  return (
    <form action="" className="flex flex-row-reverse gap-4 mt-10 mx-auto">
      <div>
        <InputComponent
          label="اسم المنتج"
          type="text"
          onChange={handleChange}
          name="name"
          value={name}
        />
        {nameError && <p className="text-red-500  mb-1 text-sm">{nameError}</p>}
      </div>
      <ButtonComponent
        label="إضافة"
        onClick={handleAddProduct}
        className={"self-start"}
      />
    </form>
  );
};

export default AddCategoryForm;
