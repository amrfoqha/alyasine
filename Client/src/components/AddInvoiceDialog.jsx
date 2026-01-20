import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import Typography from "@mui/material/Typography";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import SelectComponent from "./SelectComponent";
import { createInvoice } from "../API/InvoiceAPI";
import { getProductsName } from "../API/ProductAPI";
import toast from "react-hot-toast";

const AddInvoiceDialog = ({ open, setOpen, setInvoices, customers }) => {
  const [customer, setCustomer] = useState("");
  const [total, setTotal] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [errors, setErrors] = useState({
    customer: "",
    items: { name: "", price: "", quantity: "" },
    total: "",
    paymentType: "",
  });

  const validateCustomer = (value) => {
    setErrors((prev) => ({
      ...prev,
      customer: value.length < 1 ? "العميل مطلوب" : "",
    }));
  };

  const validateItemName = (value) => {
    setErrors((prev) => ({
      ...prev,
      items: { ...prev.items, name: value.length < 1 ? "الصنف مطلوب" : "" },
    }));
  };

  const validateItemPrice = (value) => {
    setErrors((prev) => ({
      ...prev,
      items: { ...prev.items, price: value.length < 1 ? "السعر مطلوب" : "" },
    }));
  };

  const validateItemQuantity = (value) => {
    setErrors((prev) => ({
      ...prev,
      items: {
        ...prev.items,
        quantity: value.length < 1 ? "الكمية مطلوبة" : "",
      },
    }));
  };

  const validateTotal = (value) => {
    setErrors((prev) => ({
      ...prev,
      total: value.length < 1 ? "الإجمالي مطلوب" : "",
    }));
  };
  const validatePaymentType = (value) => {
    setErrors((prev) => ({
      ...prev,
      paymentType: value.length < 1 ? "طريقة الدفع مطلوبة" : "",
    }));
  };
  const removeItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
    setErrors((prev) => ({
      ...prev,
      items: { ...prev.items, name: "", price: "", quantity: "" },
    }));
  };

  const addItem = () => {
    const newItem = { name: "", price: "", quantity: "" };
    setItems([...items, newItem]);
    setErrors((prev) => ({
      ...prev,
      items: { ...prev.items, name: "", price: "", quantity: "" },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      errors.customer === "" &&
      errors.items.name === "" &&
      errors.items.price === "" &&
      errors.items.quantity === "" &&
      errors.total === "" &&
      errors.paymentType === ""
    ) {
      try {
        const invoice = createInvoice({ customer, items, total, paymentType });
        setInvoices((prev) => [...prev, invoice]);
        toast.success("تم إضافة الفاتورة");
        setOpen(false);
      } catch (error) {
        toast.error("حدث خطأ");
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsName();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, [customer, items, total, paymentType]);
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
                label="إسم الزبون"
                type="text"
                name={"customer"}
                value={customer}
                onChange={(e) => {
                  setCustomer(e.target.value);
                  validateCustomer(e.target.value);
                }}
              />
              {errors.customer && (
                <p className="text-red-500 text-sm">{errors.customer}</p>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="السعر الاجمالي"
                type="number"
                name={"total"}
                value={total}
                onChange={(e) => {
                  setTotal(e.target.value);
                  validateTotal(e.target.value);
                }}
              />
              {errors.total && (
                <p className="text-red-500 text-sm">{errors.total}</p>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="طريقة الدفع"
                type="text"
                name={"paymentType"}
                value={paymentType}
                onChange={(e) => {
                  setPaymentType(e.target.value);
                  validatePaymentType(e.target.value);
                }}
              />
              {errors.paymentType && (
                <p className="text-red-500 text-sm">{errors.paymentType}</p>
              )}
            </div>
          </div>

          <Box mt={4}>
            <h3 className="font-bold text-xl mb-2">إضافة الصنف</h3>

            <Box display="flex" gap={2}>
              <Box className="grid grid-rows-2 gap-1">
                <InputComponent
                  label="إسم المنتج"
                  value={items.name}
                  onChange={(e) => {
                    setItems({ ...items, name: e.target.value });
                    validateItemName(e.target.value);
                  }}
                />
                {errors.items.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.items.name}
                  </p>
                )}
              </Box>

              <Box className="grid grid-rows-2 gap-1">
                <InputComponent
                  label="القيمة"
                  value={items.price}
                  onChange={(e) => {
                    setItems({ ...items, price: e.target.value });
                    validateItemPrice(e.target.value);
                  }}
                />
                {errors.items.price && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.items.price}
                  </p>
                )}
              </Box>
              <Box className="grid grid-rows-2 gap-1">
                <InputComponent
                  label="الكمية"
                  value={items.quantity}
                  onChange={(e) => {
                    setItems({ ...items, quantity: e.target.value });
                    validateItemQuantity(e.target.value);
                  }}
                />
                {errors.items.quantity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.items.quantity}
                  </p>
                )}
              </Box>
              <Box className="grid grid-rows-2 gap-1">
                <ButtonComponent
                  label="إضافة"
                  type="button"
                  onClick={addItem}
                  disabled={
                    !!errors.items.name ||
                    !!errors.items.price ||
                    !!errors.items.quantity
                  }
                  className="bg-green-500"
                />
              </Box>
            </Box>
            <div className="overflow-y-scroll h-52">
              {items.map((item, i) => (
                <Box key={i} display="flex" gap={2} mt={2}>
                  {" "}
                  <InputComponent value={item.name} disabled />{" "}
                  <InputComponent value={item.price} disabled />{" "}
                  <InputComponent value={item.quantity} disabled />{" "}
                  <button type="button" onClick={() => removeItem(i)}>
                    ❌
                  </button>{" "}
                </Box>
              ))}
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
              Object.values(errors).some(Boolean) ||
              !customer ||
              !total ||
              !paymentType
            }
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddInvoiceDialog;
