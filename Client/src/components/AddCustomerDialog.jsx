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
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import { createCustomer } from "../API/CustomerAPI";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { toast } from "react-hot-toast";

const AddCustomerDialog = ({ open, setOpen, setCustomers }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({ name: "", phone: "", address: "" });

  // منطق التحقق الموحد
  const validate = (field, value) => {
    let error = "";
    if (value.trim().length < 3) {
      if (field === "name") error = "الاسم قصير جداً";
      if (field === "phone") error = "رقم الهاتف غير مكتمل";
      if (field === "address") error = "العنوان غير دقيق";
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
      toast.error("يرجى ملء البيانات بشكل صحيح");
      return;
    }

    try {
      const res = await createCustomer(formData);
      setCustomers((prev) => [...prev, res.data]);
      setOpen(false);
      toast.success("تم تسجيل العميل بنجاح");
    } catch (err) {
      toast.error(err.response?.data?.message || "حدث خطأ في النظام");
    }
  };

  useEffect(() => {
    if (open) {
      setFormData({ name: "", phone: "", address: "" });
      setErrors({ name: "", phone: "", address: "" });
    }
  }, [open]);

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
      {/* رأس النافذة المتطور */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          p: 4,
          color: "white",
          position: "relative",
        }}
      >
        <Stack direction="row" alignItems="center" gap={2}>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.1)",
              p: 1.5,
              borderRadius: "1rem",
            }}
          >
            <PersonAddAlt1RoundedIcon sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight="900" sx={{ lineHeight: 1.2 }}>
              تسجيل عميل جديد
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              إضافة بيانات العميل لتمكينه من إجراء عمليات الشراء
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

      <Box component="form" onSubmit={handleSubmit} sx={{ bgcolor: "white" }}>
        <DialogContent sx={{ p: 4 }} dir="rtl">
          <div className="space-y-6 flex flex-col items-start ">
            {/* حقل الاسم */}
            <div className="relative">
              <InputComponent
                label="الاسم الكامل للعميل"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-300" : ""}
              />
              {errors.name && (
                <span className="text-[10px] text-red-500 font-bold absolute -bottom-5 right-2">
                  {errors.name}
                </span>
              )}
            </div>

            {/* حقل الهاتف */}
            <div className="relative pt-2">
              <InputComponent
                label="رقم التواصل (واتساب/جوال)"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-300" : ""}
              />
              {errors.phone && (
                <span className="text-[10px] text-red-500 font-bold absolute -bottom-5 right-2">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* حقل العنوان */}
            <div className="relative pt-2">
              <InputComponent
                label="منطقة السكن / العنوان بالتفصيل"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? "border-red-300" : ""}
              />
              {errors.address && (
                <span className="text-[10px] text-red-500 font-bold absolute -bottom-5 right-2">
                  {errors.address}
                </span>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ p: 4, gap: 2, bgcolor: "#fcfcfc" }}>
          <ButtonComponent
            type="submit"
            label="حفظ البيانات"
            disabled={
              Object.values(errors).some(Boolean) ||
              !formData.name ||
              !formData.phone
            }
            className="flex-1 py-4 bg-blue-600 shadow-xl shadow-blue-200 h-full"
          />
          <ButtonComponent
            onClick={() => setOpen(false)}
            label="تجاهل"
            className="bg-slate-100 h-full text-slate-500 shadow-none hover:bg-slate-200 py-4"
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddCustomerDialog;
