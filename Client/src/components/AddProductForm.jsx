import React, { useState } from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { createProduct } from "../API/ProductAPI";

const AddProductForm = ({ productCategory, setProducts }) => {
  const [name, setName] = useState("");
  const [sellPrice, setSellPrice] = useState("");

  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attribute, setAttribute] = useState({
    name: "",
    value: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    sellPrice: "",
    unit: "",
    description: "",
    category: "",
    attributeName: "",
    attributeValue: "",
  });

  const validateName = (e) => {
    const name = e.target.value;
    setName(name);
    if (name.length < 3) {
      setErrors({
        ...errors,
        name: "اسم المنتج يجب أن يكون على الأقل 3 أحرف",
      });
    } else {
      setErrors({
        ...errors,
        name: "",
      });
    }
  };
  const validateSellPrice = (e) => {
    const price = e.target.value.trim();
    setSellPrice(price);
    if (price === "") {
      setErrors({
        ...errors,
        sellPrice: "السعر مطلوب",
      });
      return;
    }
    if (isNaN(price)) {
      setErrors({
        ...errors,
        sellPrice: "السعر يجب أن يكون رقم صحيح",
      });
      return;
    }
    if (price <= 0) {
      setErrors({
        ...errors,
        sellPrice: "السعر يجب أن يكون أكبر من 0",
      });
      return;
    } else {
      setErrors({
        ...errors,
        sellPrice: "",
      });
    }
  };
  const validateUnit = (e) => {
    const unit = e.target.value.trim();
    setUnit(unit);
    if (unit.length < 1) {
      setErrors({
        ...errors,
        unit: "الوحدة مطلوبة",
      });
    } else {
      setErrors({
        ...errors,
        unit: "",
      });
    }
  };
  const validateDescription = (e) => {
    const description = e.target.value;
    setDescription(description);
    if (description.length < 3) {
      setErrors({
        ...errors,
        description: "الوصف يجب أن يكون على الأقل 3 أحرف",
      });
    } else {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };
  const validateAttribute = (e) => {
    const attribute = e.target.value;
    setAttribute((prev) => ({ ...prev, name: attribute }));
    if (attribute.length < 3) {
      setErrors({
        ...errors,
        attributeName: "الخاصية يجب أن تكون على الأقل 3 أحرف",
      });
    } else {
      setErrors({
        ...errors,
        attributeName: "",
      });
    }
  };
  const validateAttributeValue = (e) => {
    const attributeValue = e.target.value;
    setAttribute({ ...attribute, value: attributeValue });
    if (attributeValue.length < 3) {
      setErrors({
        ...errors,
        attributeValue: "القيمة يجب أن تكون على الأقل 3 أحرف",
      });
    } else {
      setErrors({
        ...errors,
        attributeValue: "",
      });
    }
  };

  const handleAddProperty = (e) => {
    e.preventDefault();
    setAttributes([...attributes, attribute]);
    setAttribute({ name: "", value: "" });
  };

  const handleAttrChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      errors.name ||
      errors.sellPrice ||
      errors.unit ||
      errors.description ||
      errors.attributeName ||
      errors.attributeValue
    ) {
      return;
    }
    const attributeObject = {};
    attributes.forEach((attr) => {
      if (attr.name && attr.value) {
        attributeObject[attr.name] = attr.value;
      }
    });
    try {
      const product = {
        name,
        sellPrice,
        unit,
        description,
        attributes: attributeObject,
        category: productCategory._id,
      };

      const res = await createProduct(product);
      console.log(res);
      setProducts((prev) => [...prev, res]);
      setName("");
      setSellPrice("");
      setUnit("");
      setDescription("");
      setAttributes([]);
      setAttribute({ name: "", value: "" });
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-8  mx-auto">
        <div className="grid grid-cols-3  gap-8 w-full " dir="rtl">
          <div className="grid grid-rows-2 gap-2 justify-items-end">
            <InputComponent
              label="اسم المنتج"
              type="text"
              name={"name"}
              value={name}
              onChange={validateName}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>
          <div className="grid grid-rows-2 gap-2 justify-items-end">
            <InputComponent
              label="السعر"
              type="number"
              name={"sellPrice"}
              value={sellPrice}
              onChange={validateSellPrice}
            />
            {errors.sellPrice && (
              <p className="text-red-500 text-sm">{errors.sellPrice}</p>
            )}
          </div>
          <div className="grid grid-rows-2 gap-2 justify-items-end">
            <InputComponent
              label="الوحدة"
              type="text"
              name={"unit"}
              value={unit}
              onChange={validateUnit}
            />
            {errors.unit && (
              <p className="text-red-500 text-sm">{errors.unit}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8 w-full " dir="rtl">
          <div className="grid grid-rows-2 gap-2 justify-items-end">
            <InputComponent
              label="الفئة"
              type="text"
              value={productCategory.name}
              disabled={true}
              className={"cursor-not-allowed"}
              name={"category"}
            />
          </div>
          <div className="grid grid-rows-2 gap-2 justify-items-end">
            <InputComponent
              label="الوصف"
              type="text"
              name={"description"}
              value={description}
              onChange={validateDescription}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4" dir="rtl">
          <label htmlFor="" className="text-2xl font-bold text-gray-900">
            إضافة خصائص
          </label>
          <div className="flex items-center gap-4">
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="الخاصية"
                type="text"
                placeholder="اللون"
                name={"attributeName"}
                onChange={validateAttribute}
                value={attribute.name}
              />
              {errors.attribute && (
                <p className="text-red-500 text-sm">{errors.attribute}</p>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="القيمة"
                type="text"
                placeholder="أحمر"
                name={"attributeValue"}
                onChange={validateAttributeValue}
                value={attribute.value}
              />
              {errors.attributeValue && (
                <p className="text-red-500 text-sm">{errors.attributeValue}</p>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2">
              <ButtonComponent
                label="إضافة"
                type={"button"}
                onClick={handleAddProperty}
                disabled={
                  errors.attribute?.length > 0 ||
                  errors.attributeValue?.length > 0 ||
                  attribute.name?.length < 3 ||
                  attribute.value?.length < 3
                }
                className={"bg-green-500"}
              />
            </div>
          </div>
          <div className="grid grid-rows-2 gap-2">
            {attributes.map((attr, index) => (
              <div key={index} style={{ display: "flex", gap: "10px" }}>
                <InputComponent
                  type="text"
                  placeholder="Attribute name (e.g. color)"
                  value={attr.name}
                  onChange={(e) =>
                    handleAttrChange(index, "name", e.target.value)
                  }
                  disabled={true}
                />

                <InputComponent
                  type="text"
                  placeholder="Value (e.g. white)"
                  value={attr.value}
                  onChange={(e) =>
                    handleAttrChange(index, "value", e.target.value)
                  }
                  disabled={true}
                />
                <button type="button" onClick={() => removeAttribute(index)}>
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="mx-auto">
          <ButtonComponent
            label="إضافة منتجات"
            type={"submit"}
            disabled={
              errors.name?.length > 0 ||
              errors.sellPrice?.length > 0 ||
              errors.unit?.length > 0 ||
              errors.description?.length > 0 ||
              name.length < 3 ||
              sellPrice.length < 1 ||
              unit.length < 1 ||
              description.length < 3
            }
            onClick={handleSubmit}
          />
        </div>
      </div>
    </form>
  );
};

export default AddProductForm;
