import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Fade,
  Stack,
} from "@mui/material";
import { toast } from "react-hot-toast";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

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
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" });

  // مزامنة الحالة عند فتح النافذة
  useEffect(() => {
    if (open && customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        address: customer.address || "",
      });
      setErrors({ name: "", phone: "", address: "" });
    }
  }, [open, customer]);

  const validate = (field, value) => {
    let error = "";
    if (value.trim().length < 3) {
      error = "هذا الحقل يتطلب 3 أحرف على الأقل";
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      Object.values(errors).some(Boolean) ||
      !formData.name ||
      !formData.phone
    ) {
      return;
    }

    try {
      const response = await updateCustomer(customer._id, {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });

      setCustomer(response);

      // تحديث القائمة الرئيسية
      setCustomers((prev) =>
        prev.map((cust) => (cust._id === response._id ? response : cust)),
      );

      setOpen(false);
      toast.success("تم تحديث بيانات العميل");
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل التحديث");
    }
  };

  const isFormInvalid =
    Object.values(errors).some(Boolean) ||
    !formData.name.trim() ||
    !formData.phone.trim();

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      TransitionComponent={Fade}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "2.5rem", overflow: "hidden" },
      }}
      dir="rtl"
    >
      {/* Header بتصميم مميز للتعديل */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #4338ca 0%, #312e81 100%)",
          p: 4,
          color: "white",
          position: "relative",
        }}
      >
        <Stack direction="row" alignItems="center" className="gap-4">
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.15)",
              p: 1.5,
              borderRadius: "1.2rem",
            }}
          >
            <EditNoteRoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1.2 }}>
              تعديل بيانات العميل
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              تعديل معلومات {customer?.name || "العميل"} بدقة
            </Typography>
          </Box>
        </Stack>
        <button
          onClick={() => setOpen(false)}
          className="absolute top-6 left-6 text-white/50 hover:text-white transition-colors"
        >
          <CloseRoundedIcon />
        </button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ bgcolor: "white" }}
        dir="rtl"
      >
        <DialogContent sx={{ p: 4 }} className="flex flex-col items-start">
          <div className="space-y-7">
            <div className="relative">
              <InputComponent
                label="الاسم المحدث"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 font-black absolute -bottom-5 right-2 tracking-tight">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="relative pt-2">
              <InputComponent
                label="رقم الهاتف الجديد"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="text-[10px] text-red-500 font-black absolute -bottom-5 right-2 tracking-tight">
                  {errors.phone}
                </span>
              )}
            </div>

            <div className="relative pt-2">
              <InputComponent
                label="تحديث العنوان"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              {errors.address && (
                <span className="text-[10px] text-red-500 font-black absolute -bottom-5 right-2 tracking-tight">
                  {errors.address}
                </span>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 2, bgcolor: "#fcfcfc" }}>
          <ButtonComponent
            onClick={() => setOpen(false)}
            label="إلغاء التعديل"
            className="bg-slate-100 text-slate-500 shadow-none hover:bg-slate-200"
          />
          <ButtonComponent
            type="submit"
            label="حفظ التغييرات"
            disabled={isFormInvalid}
            className="flex-1 !bg-indigo-600 hover:!bg-indigo-700"
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditCustomerDialog;
