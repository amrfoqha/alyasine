import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Divider,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { MoneyRounded, AccountBalanceRounded } from "@mui/icons-material";
import { updateCheckStatus } from "../API/ChecksAPI";
import toast from "react-hot-toast";

const EditCheckDialog = ({ open, setOpen, check, fetchChecks }) => {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (check) {
      setStatus(check.checkDetails?.status || "pending");
    }
  }, [check]);

  const handleSubmit = async () => {
    if (!status) {
      toast.error("يرجى اختيار الحالة");
      return;
    }
    setLoading(true);
    try {
      await updateCheckStatus(check._id, status);
      toast.success("تم تحديث حالة الشيك بنجاح");
      fetchChecks();
      setOpen(false);
    } catch (error) {
      console.error("Update status error:", error);
      toast.error(error.message || "حدث خطأ أثناء تحديث الحالة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      fullWidth
      maxWidth="xs"
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
        <MoneyRounded color="primary" />
        <Typography component="span" variant="h6" fontWeight="bold" dir="rtl">
          تعديل حالة الشيك
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 2 }} dir="rtl">
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: "12px",
            bgcolor: "#f1f5f9",
            border: "1px solid #e2e8f0",
          }}
        >
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                رقم الشيك:
              </Typography>
              <Typography variant="body2" fontWeight="900" fontStyle="mono">
                {check?.checkDetails?.checkNumber || "---"}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                البنك:
              </Typography>
              <Typography variant="body2" fontWeight="900">
                {check?.checkDetails?.bankName || "---"}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ mt: 1 }}>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight="bold"
              >
                المبلغ:
              </Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {check?.amount} ₪
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel id="status-label">حالة الشيك</InputLabel>
          <Select
            labelId="status-label"
            value={status}
            label="حالة الشيك"
            onChange={(e) => setStatus(e.target.value)}
            sx={{ borderRadius: "12px" }}
          >
            <MenuItem value="pending">قيد الانتظار</MenuItem>
            <MenuItem value="cleared">تم الصرف</MenuItem>
            <MenuItem value="returned">مرتجع</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, bgcolor: "#f8faff", gap: 1 }}>
        <Button
          onClick={() => setOpen(false)}
          variant="outlined"
          color="inherit"
          sx={{ borderRadius: "10px", px: 3, fontWeight: "bold" }}
        >
          إلغاء
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: "10px",
            px: 4,
            fontWeight: "bold",
            background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
          }}
        >
          {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCheckDialog;
