import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment,
  Divider,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import NumbersIcon from "@mui/icons-material/Numbers";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import EventIcon from "@mui/icons-material/Event";
import NoteIcon from "@mui/icons-material/Note";
import { stockIn } from "../API/StockAPI";
import { toast } from "react-hot-toast";

const AddStockDialog = ({ open, setOpen, product, setProducts }) => {
  const getTodayDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    quantity: "",
    costPrice: "",
    date: getTodayDate(),
    note: "",
  });

  const [errors, setErrors] = useState({});

  // تصفير الأخطاء والبيانات عند فتح/إغلاق المكون
  useEffect(() => {
    if (open) {
      setFormData({
        quantity: "",
        costPrice: "",
        date: getTodayDate(),
        note: "",
      });
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    let tempErrors = {};
    const today = getTodayDate();

    if (!formData.quantity || Number(formData.quantity) <= 0) {
      tempErrors.quantity = "يرجى إدخال كمية صالحة (أكبر من 0)";
    }
    if (!formData.costPrice || Number(formData.costPrice) <= 0) {
      tempErrors.costPrice = "يرجى إدخال سعر تكلفة صحيح";
    }
    if (!formData.date) {
      tempErrors.date = "التاريخ مطلوب";
    } else if (formData.date > today) {
      tempErrors.date = "لا يمكن اختيار تاريخ مستقبلي";
    }
    if (!formData.note || formData.note.trim().length < 3) {
      tempErrors.note = "يرجى كتابة ملاحظة توضيحية (3 أحرف على الأقل)";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInternalSubmit = async () => {
    if (validate()) {
      try {
        await stockIn({
          productId: product?._id,
          quantity: Number(formData.quantity),
          costPrice: Number(formData.costPrice),
          date: formData.date,
          note: formData.note,
        });
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === product._id
              ? {
                  ...p,
                  quantity: Number(p.quantity) + Number(formData.quantity),
                }
              : p,
          ),
        );
        toast.success("تم إضافة البضاعة بنجاح");
        setOpen(false);
      } catch (error) {
        console.log(error);
        toast.error("حدث خطأ أثناء إضافة البضاعة");
      }
    } else {
      toast.error("يرجى إدخال جميع الحقول بشكل صحيح");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: "20px", overflow: "hidden" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          bgcolor: "#f8faff",
          py: 2.5,
        }}
      >
        <InventoryIcon color="primary" />
        <Typography
          component="span"
          variant="h6"
          fontWeight="bold"
          color="text.primary"
        >
          إضافة بضاعة للمخزون
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }}>
        <Box
          sx={{
            mb: 4,
            p: 2,
            borderRadius: "12px",
            bgcolor: "#e3f2fd", // لون أزرق فاتح مريح
            color: "#1976d2",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" fontWeight="600">
            المنتج الحالي:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            {product?.name || "تحميل..."}
          </Typography>
        </Box>

        <Grid container spacing={3} dir="rtl">
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="الكمية الواردة"
              type="number"
              value={formData.quantity}
              error={!!errors.quantity}
              helperText={errors.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <NumbersIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="سعر التكلفة للوحدة"
              type="number"
              value={formData.costPrice}
              error={!!errors.costPrice}
              helperText={errors.costPrice}
              onChange={(e) =>
                setFormData({ ...formData, costPrice: e.target.value })
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoneyIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="تاريخ الدخول للمخزن"
              type="date"
              value={formData.date}
              error={!!errors.date}
              helperText={errors.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EventIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              inputProps={{ max: getTodayDate() }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="ملاحظات الشحنة"
              multiline
              rows={3}
              value={formData.note}
              error={!!errors.note}
              helperText={errors.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              placeholder="مثال: توريد من شركة الأمل..."
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    sx={{ mt: 1, alignSelf: "flex-start" }}
                  >
                    <NoteIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, bgcolor: "#f8faff", gap: 1 }}>
        <Button
          type="button"
          onClick={() => setOpen(false)}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: "10px", px: 3 }}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleInternalSubmit}
          variant="contained"
          sx={{
            borderRadius: "10px",
            px: 4,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
          }}
        >
          حفظ البيانات
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockDialog;
