import React, { useState } from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { createProductCategory } from "../API/ProductCategoryAPI";
import { toast } from "react-hot-toast";

const AddCategoryForm = ({ setProducts, products }) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const value = e.target.value;
    setName(value);
    if (value.trim().length > 0) {
      setNameError("");
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    // فحص بسيط قبل الإرسال
    if (!name.trim()) {
      setNameError("يرجى إدخال اسم الفئة أولاً");
      return;
    }

    setIsSubmitting(true);
    try {
      const product = await createProductCategory(name);
      setProducts((prev) => [product, ...prev]);
      toast.success("تم إضافة الفئة بنجاح");
      setName("");
      setNameError("");
    } catch (error) {
      setNameError(error.message);
      toast.error("حدث خطأ أثناء الإضافة");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleAddProduct}
      className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-2xl mx-auto p-4 transition-all"
      dir="rtl"
    >
      <div className="grow w-full relative">
        <InputComponent
          label="اسم الفئة الجديدة"
          type="text"
          onChange={handleChange}
          name="name"
          value={name}
          className={`w-full transition-all ${nameError ? "border-red-400 focus:border-red-500" : "focus:border-blue-500"}`}
        />

        {nameError && (
          <p className="text-red-500 mt-2 text-xs font-bold absolute -bottom-6 right-2 animate-pulse">
            ⚠️ {nameError}
          </p>
        )}
      </div>

      <div className="w-full md:w-auto">
        <ButtonComponent
          label={isSubmitting ? "جاري الحفظ..." : "إضافة الفئة"}
          onClick={handleAddProduct}
          className={`w-full md:w-40 h-[50px] rounded-xl font-bold shadow-lg transition-all active:scale-95 
            ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};

export default AddCategoryForm;
