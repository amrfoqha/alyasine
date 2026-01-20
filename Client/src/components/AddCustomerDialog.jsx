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
import { createCustomer } from "../API/CustomerAPI";
import InventoryIcon from "@mui/icons-material/Inventory";
import Typography from "@mui/material/Typography";
import { toast } from "react-hot-toast";

const AddCustomerDialog = ({ open, setOpen, setCustomers }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const validateName = (value) => {
    setErrors((prev) => ({
      ...prev,
      name: value.length < 3 ? "اسم العميل يجب أن يكون 3 أحرف على الأقل" : "",
    }));
  };

  const validatePhone = (value) => {
    setErrors((prev) => ({
      ...prev,
      phone: value.length < 3 ? "رقم الهاتف يجب أن يكون 3 أحرف على الأقل" : "",
    }));
  };

  const validateAddress = (value) => {
    setErrors((prev) => ({
      ...prev,
      address: value.length < 3 ? "العنوان يجب أن يكون 3 أحرف على الأقل" : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some(Boolean)) return;

    try {
      const customer = {
        name,
        phone,
        address,
      };

      const res = await createCustomer(customer);
      setCustomers((prev) => [...prev, res.customers]);
      setOpen(false);
      toast.success("تم إضافة العميل بنجاح");
    } catch (err) {
      toast.error("حدث خطأ أثناء إضافة العميل");
      toast.error(err.message);
    }
  };

  useEffect(() => {
    setName("");
    setPhone("");
    setAddress("");
    setErrors({
      name: "",
      phone: "",
      address: "",
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
          إضافة عميل جديد
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent dividers dir="rtl">
          <div className="grid grid-cols-3 gap-8 w-full " dir="rtl">
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="اسم العميل"
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
                label="رقم الهاتف"
                type="text"
                name={"phone"}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  validatePhone(e.target.value);
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
            <div className="grid grid-rows-2 gap-2 justify-items-end">
              <InputComponent
                label="العنوان"
                type="text"
                name={"address"}
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  validateAddress(e.target.value);
                }}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}
            </div>
          </div>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <ButtonComponent
            variant="outlined"
            onClick={() => setOpen(false)}
            className={"bg-red-500 hover:bg-red-600"}
            label="إلغاء"
            type="button"
          />
          <ButtonComponent
            variant="contained"
            type="submit"
            label="إضافة"
            color="primary"
            disabled={
              errors.name ||
              errors.phone ||
              errors.address ||
              !name ||
              !phone ||
              !address
            }
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddCustomerDialog;
