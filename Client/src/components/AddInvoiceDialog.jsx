import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Divider,
  Grid,
  Card,
  Fade,
  Stack,
  Chip,
  Zoom,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Icons
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";
import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

// Components
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import SelectComponent from "./SelectComponent";
import { createInvoice } from "../API/InvoiceAPI";
import { getProducts } from "../API/ProductAPI";

const AddInvoiceDialog = ({
  open,
  setOpen,
  setInvoices,
  customers,
  setInvoicesCount,
}) => {
  const [customer, setCustomer] = useState(null);
  const [paymentType, setPaymentType] = useState({
    _id: "cash",
    name: "نقداً (Cash)",
  });
  const [paidAmount, setPaidAmount] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [checkDetails, setCheckDetails] = useState({
    checkNumber: "",
    bankName: "",
    dueDate: "",
  });

  // حسابات متقدمة
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const remainingAmount = Math.max(0, total - (Number(paidAmount) || 0));
  const isOverPaid = (Number(paidAmount) || 0) > total;

  const addItem = () => {
    if (!selectedProduct || !quantity || quantity <= 0)
      return toast.error("يرجى تحديد المنتج والكمية");
    if (quantity > selectedProduct.quantity)
      return toast.error("الكمية المطلوبة تتجاوز المخزون");

    const newItem = {
      product: selectedProduct,
      price: selectedProduct.sellPrice,
      quantity: Number(quantity),
      tempId: Date.now(),
    };

    setItems([newItem, ...items]);
    setSelectedProduct(null);
    setQuantity("");
  };

  const removeItem = (tempId) =>
    setItems(items.filter((item) => item.tempId !== tempId));

  const handleClose = () => {
    setOpen(false);
    setItems([]);
    setPaidAmount(0);
    setCustomer(null);
    setCheckDetails({
      checkNumber: "",
      bankName: "",
      dueDate: "",
    });
    setSelectedProduct(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customer) return toast.error("يجب اختيار العميل");

    if (items.length === 0) return toast.error("الفاتورة لا تحتوي على أصناف");

    try {
      const payload = {
        customer: customer._id,

        items: items.map((i) => ({
          product: i.product._id,

          quantity: Number(i.quantity),

          price: Number(i.price),
        })),

        paidAmount: Number(paidAmount),

        paymentType: paymentType._id,
      };

      if (paymentType._id === "check") {
        if (
          !checkDetails.checkNumber ||
          !checkDetails.bankName ||
          !checkDetails.dueDate
        ) {
          return toast.error("يرجى إدخال جميع بيانات الشيك");
        }
        payload.checkDetails = checkDetails;
      }

      console.log(payload);
      const res = await createInvoice(payload);
      console.log(res);
      setInvoices((prev) => [res, ...prev]);
      setInvoicesCount((prev) => prev + 1);
      toast.success("تم حفظ الفاتورة بنجاح");
      handleClose();
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message || "خطأ في السيرفر");
    }
  };

  useEffect(() => {
    if (open)
      getProducts()
        .then(setProducts)
        .catch(() => toast.error("خطأ في جلب الأصناف"));
  }, [open]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      {/* Header - Dark Mode Aesthetic */}
      <Box className="flex justify-end items-center text-white p-4 bg-[#0f172a] relative">
        <Stack direction="row" className=" items-center gap-2" dir="rtl">
          <div className="p-3 bg-blue-500/20 rounded-2xl border border-blue-500/30">
            <ReceiptLongRoundedIcon sx={{ fontSize: 35, color: "#3b82f6" }} />
          </div>
          <div>
            <Typography variant="h5" fontWeight="900">
              إنشاء فاتورة بيع
            </Typography>
          </div>
        </Stack>
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            color: "rgba(255,255,255,0.3)",
          }}
          hover={{
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <CloseRoundedIcon
            sx={{ fontSize: 35 }}
            className="hover:text-white ease-in-out duration-300 transition-colors"
          />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: "#fcfcfc" }} dir="rtl">
        <Grid container sx={{ minHeight: "70vh" }}>
          {/* الجانب الأيمن: المدخلات */}
          <Grid sx={{ p: 5, borderLeft: "1px solid #f1f5f9" }}>
            <Stack spacing={4}>
              {/* بيانات العميل */}
              <Box>
                <Typography
                  variant="subtitle2"
                  fontWeight="900"
                  sx={{ mb: 2, color: "#475569" }}
                >
                  البيانات الأساسية
                </Typography>
                <Grid container spacing={2}>
                  <Grid>
                    <SelectComponent
                      label="العميل المشتري"
                      options={customers}
                      value={customer?._id}
                      onChange={setCustomer}
                      optionLabel="name"
                    />
                  </Grid>
                  <Grid>
                    <SelectComponent
                      label="وسيلة الدفع"
                      options={[
                        { _id: "cash", name: "نقداً (Cash)" },
                        { _id: "bank", name: "حوالة بنكية" },
                        { _id: "check", name: "شيك" },
                      ]}
                      value={paymentType?._id}
                      onChange={setPaymentType}
                      optionLabel="name"
                    />
                  </Grid>
                </Grid>

                {/* تفاصيل الشيك */}
                {paymentType?._id === "check" && (
                  <Box
                    className="animate-in fade-in slide-in-from-top-4"
                    sx={{
                      mt: 2,
                      p: 3,
                      bgcolor: "#f0f9ff",
                      borderRadius: "1rem",
                      border: "1px dashed #bae6fd",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#0284c7",
                        fontWeight: "bold",
                        mb: 2,
                        display: "block",
                      }}
                    >
                      بيانات الشيك المستلم
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid>
                        <InputComponent
                          label="رقم الشيك"
                          value={checkDetails.checkNumber}
                          onChange={(e) =>
                            setCheckDetails({
                              ...checkDetails,
                              checkNumber: e.target.value,
                            })
                          }
                          className="bg-white"
                        />
                      </Grid>
                      <Grid>
                        <InputComponent
                          label="اسم البنك"
                          value={checkDetails.bankName}
                          onChange={(e) =>
                            setCheckDetails({
                              ...checkDetails,
                              bankName: e.target.value,
                            })
                          }
                          className="bg-white"
                        />
                      </Grid>
                      <Grid>
                        <InputComponent
                          label="تاريخ الاستحقاق"
                          type="date"
                          value={checkDetails.dueDate}
                          onChange={(e) =>
                            setCheckDetails({
                              ...checkDetails,
                              dueDate: e.target.value,
                            })
                          }
                          className="bg-white"
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* اختيار الأصناف */}
              <Box
                sx={{
                  bgcolor: "#f8fafc",
                  p: 3,
                  borderRadius: "2rem",
                  border: "1px dashed #cbd5e1",
                }}
              >
                <Grid container spacing={2} alignItems="center">
                  <Grid>
                    <SelectComponent
                      label="البحث عن صنف في المخزن"
                      options={products}
                      value={selectedProduct?._id}
                      onChange={setSelectedProduct}
                      optionLabel="name"
                    />
                  </Grid>
                  <Grid>
                    <InputComponent
                      label="الكمية"
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <ButtonComponent
                      label="إضافة"
                      onClick={addItem}
                      icon={<AddShoppingCartRoundedIcon />}
                      className="w-full py-4"
                    />
                  </Grid>
                </Grid>

                {/* تفاصيل سريعة للمنتج المختار */}
                <AnimatePresence>
                  {selectedProduct && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <Stack direction="row" spacing={2} sx={{ mt: 2 }} gap={2}>
                        <Chip
                          icon={<InfoOutlinedIcon />}
                          label={`سعر البيع: ${selectedProduct.sellPrice} ₪`}
                          sx={{ fontWeight: "bold", px: 2 }}
                        />
                        <Chip
                          icon={<ErrorOutlineRoundedIcon />}
                          label={`مخزون متاح: ${selectedProduct.quantity}`}
                          color={
                            selectedProduct.quantity < 5 ? "error" : "default"
                          }
                          sx={{ fontWeight: "bold", px: 2 }}
                        />
                      </Stack>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>

              {/* جدول الأصناف المضافة */}
              <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: "1.5rem", border: "1px solid #e2e8f0" }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ "& th": { bgcolor: "#f1f5f9", fontWeight: "900" } }}
                    >
                      <TableCell>الصنف</TableCell>
                      <TableCell align="center">الكمية</TableCell>
                      <TableCell align="center">السعر</TableCell>
                      <TableCell align="center">الإجمالي</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <TableRow
                          key={item.tempId}
                          component={motion.tr}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0, x: -20 }}
                        >
                          <TableCell sx={{ fontWeight: "bold" }}>
                            {item.product.name}
                          </TableCell>
                          <TableCell align="center">
                            {item.quantity} {item.product.unit}
                          </TableCell>
                          <TableCell align="center">{item.price} ₪</TableCell>
                          <TableCell align="center" sx={{ fontWeight: "900" }}>
                            {item.price * item.quantity} ₪
                          </TableCell>
                          <TableCell align="center">
                            <IconButton
                              onClick={() => removeItem(item.tempId)}
                              size="small"
                              sx={{ color: "#ef4444", bgcolor: "#fef2f2" }}
                            >
                              <DeleteSweepRoundedIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </AnimatePresence>
                    {items.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          align="center"
                          sx={{ py: 10, color: "#94a3b8" }}
                        >
                          <ShoppingBagRoundedIcon
                            sx={{ fontSize: 50, mb: 2, opacity: 0.1 }}
                          />
                          <Typography variant="body2">
                            قائمة الفاتورة فارغة حالياً
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
          </Grid>

          {/* الجانب الأيسر: ملخص الدفع (Checkout Style) */}
          <Grid sx={{ bgcolor: "#f8fafc", p: 5 }}>
            <Box sx={{ position: "sticky", top: 40 }}>
              <Typography variant="h6" fontWeight="900" sx={{ mb: 4 }}>
                ملخص العملية
              </Typography>

              <Stack spacing={3}>
                <div className="flex justify-between items-center text-slate-500">
                  <span>إجمالي السلع</span>
                  <span className="font-bold">{total.toLocaleString()} ₪</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-400">
                    تأكيد المبلغ المستلم
                  </label>
                  <InputComponent
                    placeholder="0.00"
                    type="number"
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    className="bg-white!"
                  />
                </div>

                <Divider />

                <Box
                  sx={{
                    p: 3,
                    borderRadius: "2rem",
                    bgcolor: isOverPaid ? "#fef2f2" : "#1e293b",
                    color: isOverPaid ? "#ef4444" : "white",
                    transition: "all 0.3s ease",
                  }}
                >
                  <Stack spacing={2}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-70">المبلغ المتبقي</span>
                      <Typography variant="h4" fontWeight="900">
                        {remainingAmount.toLocaleString()} ₪
                      </Typography>
                    </div>
                    {isOverPaid && (
                      <Typography
                        variant="caption"
                        className="flex items-center gap-1"
                      >
                        <ErrorOutlineRoundedIcon sx={{ fontSize: 14 }} /> المبلغ
                        المدفوع أكبر من الإجمالي
                      </Typography>
                    )}
                  </Stack>
                </Box>

                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: "1.5rem",
                    p: 2,
                    borderStyle: "dashed",
                    bgcolor: "white",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    gutterBottom
                  >
                    حالة السداد
                  </Typography>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${remainingAmount === 0 && total > 0 ? "bg-green-500" : "bg-amber-500 animate-pulse"}`}
                    />
                    <span className="font-black text-slate-700">
                      {remainingAmount === 0 && total > 0
                        ? "مدفوعة بالكامل"
                        : "يوجد مبالغ مستحقة"}
                    </span>
                  </div>
                </Card>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ p: 2, bgcolor: "white", borderTop: "1px solid #f1f5f9" }}
      >
        <ButtonComponent
          label="إغلاق"
          onClick={handleClose}
          className="bg-slate-100 h-full text-slate-500 shadow-none hover:bg-slate-200 py-4"
        />
        <ButtonComponent
          label="حفظ وطباعة الفاتورة"
          disabled={items.length === 0 || !customer}
          className="flex-1 py-4 bg-blue-600 shadow-xl shadow-blue-200 h-full"
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddInvoiceDialog;
