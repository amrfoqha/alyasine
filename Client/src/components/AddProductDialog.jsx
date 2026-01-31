import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { createProduct } from "../API/ProductAPI";
import InventoryIcon from "@mui/icons-material/Inventory";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";

const AddProductDialog = ({ open, setOpen, productCategory, setProducts }) => {
  const [name, setName] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [attribute, setAttribute] = useState({ name: "", value: "" });

  const [errors, setErrors] = useState({
    name: "",
    sellPrice: "",
    unit: "",
    description: "",
    attributeName: "",
    attributeValue: "",
  });

  const validateName = (value) => {
    setErrors((prev) => ({
      ...prev,
      name: value.length < 3 ? "اسم المنتج يجب أن يكون 3 أحرف على الأقل" : "",
    }));
  };

  const validatePrice = (value) => {
    let error = "";
    if (!value) error = "السعر مطلوب";
    else if (isNaN(value)) error = "السعر يجب أن يكون رقم";
    else if (Number(value) <= 0) error = "السعر يجب أن يكون أكبر من 0";

    setErrors((prev) => ({ ...prev, sellPrice: error }));
  };

  const validateUnit = (value) => {
    setErrors((prev) => ({
      ...prev,
      unit: value.length < 1 ? "الوحدة مطلوبة" : "",
    }));
  };

  const validateDescription = (value) => {
    setErrors((prev) => ({
      ...prev,
      description: value.length < 3 ? "الوصف يجب أن يكون 3 أحرف على الأقل" : "",
    }));
  };

  const validateAttributeName = (value) => {
    setErrors((prev) => ({
      ...prev,
      attributeName:
        value.length < 3 ? "الخاصية يجب أن تكون 3 أحرف على الأقل" : "",
    }));
  };

  const validateAttributeValue = (value) => {
    setErrors((prev) => ({
      ...prev,
      attributeValue:
        value.length < 3 ? "القيمة يجب أن تكون 3 أحرف على الأقل" : "",
    }));
  };

  const addAttribute = () => {
    setAttributes((prev) => [...prev, attribute]);
    setAttribute({ name: "", value: "" });
  };

  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(Boolean)) return;

    const attrObj = {};
    attributes.forEach((a) => {
      attrObj[a.name] = a.value;
    });

    try {
      const product = {
        name,
        sellPrice: Number(sellPrice),
        unit,
        description,
        attributes: attrObj,
        category: productCategory._id,
      };

      console.log(product);

      const res = await createProduct(product);
      setProducts((prev) => [...prev, res]);
      setOpen(false);
      toast.success("تم إضافة المنتج بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء إضافة المنتج");
    }
  };

  useEffect(() => {
    setName("");
    setSellPrice("");
    setUnit("");
    setDescription("");
    setAttribute({ name: "", value: "" });
    setAttributes([]);
    setErrors({
      name: "",
      sellPrice: "",
      unit: "",
      description: "",
      attributeName: "",
      attributeValue: "",
    });
  }, [open]);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "#f8faff",
          py: 2.5,
        }}
      >
        <InventoryIcon color="primary" />
        <Typography variant="h6" fontWeight="bold" color="text.primary">
          إضافة بضاعة للمخزون
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers dir="rtl">
          <div className="grid grid-cols-3  gap-8 w-full " dir="rtl">
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="اسم المنتج"
                type="text"
                name={"name"}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
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
                onChange={(e) => {
                  setSellPrice(e.target.value);
                  validatePrice(e.target.value);
                }}
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
                onChange={(e) => {
                  setUnit(e.target.value);
                  validateUnit(e.target.value);
                }}
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
                value={productCategory?.name}
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
                onChange={(e) => {
                  setDescription(e.target.value);
                  validateDescription(e.target.value);
                }}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>
          </div>

          {/* ATTRIBUTES */}
          <Box mt={4}>
            <h3 className="font-bold text-xl mb-2">إضافة خصائص</h3>

            <Box display="flex" gap={2}>
              <Box className="grid grid-rows-2 gap-1">
                <InputComponent
                  label="الخاصية"
                  value={attribute.name}
                  onChange={(e) => {
                    setAttribute({ ...attribute, name: e.target.value });
                    validateAttributeName(e.target.value);
                  }}
                />
                {errors.attributeName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.attributeName}
                  </p>
                )}
              </Box>

              <Box className="grid grid-rows-2 gap-1">
                <InputComponent
                  label="القيمة"
                  value={attribute.value}
                  onChange={(e) => {
                    setAttribute({ ...attribute, value: e.target.value });
                    validateAttributeValue(e.target.value);
                  }}
                />
                {errors.attributeValue && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.attributeValue}
                  </p>
                )}
              </Box>
              <Box className="grid grid-rows-2 gap-1">
                <ButtonComponent
                  label="إضافة"
                  type="button"
                  onClick={addAttribute}
                  disabled={
                    !!errors.attributeName ||
                    !!errors.attributeValue ||
                    attribute.name.length < 3 ||
                    attribute.value.length < 3
                  }
                />
              </Box>
            </Box>
            {/* change this method of display into table . now improve it UI/UX*/}
            <div className="overflow-y-auto w-full h-52">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100 ">
                  <tr>
                    <th className="p-4 text-gray-600 font-bold">الخاصية</th>
                    <th className="p-4 text-gray-600 font-bold">القيمة</th>
                    <th className="p-4 text-gray-600 font-bold">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {attributes.map((attr, i) => (
                    <tr
                      key={i}
                      className="hover:bg-blue-50/30 transition-colors duration-200 text-center"
                    >
                      <td className="  font-medium text-gray-800 p-4">
                        {attr.name}
                      </td>
                      <td className=" font-medium text-gray-800 p-4">
                        {attr.value}
                      </td>
                      <td className=" font-medium text-gray-800 p-4">
                        <button
                          type="button"
                          onClick={() => removeAttribute(i)}
                          className="cursor-pointer"
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "flex-start", p: 2 }}>
          <ButtonComponent
            label="إلغاء"
            type="button"
            onClick={() => setOpen(false)}
            className="bg-red-500"
          />

          <ButtonComponent
            label="إضافة المنتج"
            type="submit"
            disabled={
              errors.name ||
              errors.sellPrice ||
              errors.unit ||
              errors.description ||
              !name ||
              !sellPrice ||
              !unit ||
              !description
            }
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddProductDialog;
