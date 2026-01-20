import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import { toast } from "react-hot-toast";

// Components & API
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { updateCustomer } from "../API/CustomerAPI";

const EditCustomerDialog = ({
  open,
  setOpen,
  setCustomer,
  customer,
  setCustomers,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Sync state when dialog opens or customer changes
  useEffect(() => {
    if (open && customer) {
      setName(customer.name || "");
      setPhone(customer.phone || "");
      setAddress(customer.address || "");
      setErrors({ name: "", phone: "", address: "" });
    }
  }, [open, customer]);

  const validate = (fieldName, value) => {
    let error = "";
    if (value.trim().length < 3) {
      error = "هذا الحقل يجب أن يكون 3 أحرف على الأقل";
    }
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Final check before submission
    if (
      Object.values(errors).some((err) => err !== "") ||
      !name ||
      !phone ||
      !address
    ) {
      return;
    }

    try {
      const response = await updateCustomer(customer._id, {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      console.log(response);

      setCustomer(response);

      // Update the customer in the main list
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === response._id ? response : cust)),
      );

      setOpen(false);
      toast.success("تم تعديل العميل بنجاح");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ أثناء تعديل العميل");
    }
  };

  const isFormInvalid =
    errors.name ||
    errors.phone ||
    errors.address ||
    !name.trim() ||
    !phone.trim() ||
    !address.trim();

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
          تعديل بيانات العميل
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers dir="rtl">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            dir="rtl"
          >
            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <InputComponent
                label="اسم العميل"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validate("name", e.target.value);
                }}
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">{errors.name}</span>
              )}
            </div>

            {/* Phone Input */}
            <div className="flex flex-col gap-1">
              <InputComponent
                label="رقم الهاتف"
                type="text"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.trim());
                  validate("phone", e.target.value);
                }}
              />
              {errors.phone && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* Address Input */}
            <div className="flex flex-col gap-1">
              <InputComponent
                label="العنوان"
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validate("address", e.target.value);
                }}
              />
              {errors.address && (
                <span className="text-red-500 text-xs mt-1">
                  {errors.address}
                </span>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <ButtonComponent
            variant="outlined"
            onClick={() => setOpen(false)}
            // Note: If ButtonComponent handles its own colors, ensure this class doesn't conflict
            className="border-gray-300 text-gray-700"
            label="إلغاء"
          />
          <ButtonComponent
            variant="contained"
            type="submit"
            label="حفظ التعديلات"
            color="primary"
            disabled={isFormInvalid}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditCustomerDialog;
