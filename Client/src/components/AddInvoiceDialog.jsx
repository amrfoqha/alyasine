import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
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
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { toast } from "react-hot-toast";

// مكوناتك المخصصة
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
  const [paymentType, setPaymentType] = useState("cash");
  const [paidAmount, setPaidAmount] = useState(0);
  const [products, setProducts] = useState([]);

  // الأصناف
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("آجل (غير مدفوع)");

  // الحسابات المالية
  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );
  const remainingAmount = total - (Number(paidAmount) || 0);

  const getStatusColor = () => {
    if (paidAmount === 0) return "#f44336"; // أحمر
    if (paidAmount < total) return "#ff9800"; // برتقالي
    return "#4caf50"; // أخضر
  };

  const addItem = () => {
    if (!selectedProduct || !quantity || quantity <= 0)
      return toast.error("أكمل بيانات الصنف بشكل صحيح");
    if (quantity > selectedProduct.quantity)
      return toast.error(`عذراً، المتوفر فقط ${selectedProduct.quantity}`);

    const isExist = items.find((i) => i.product._id === selectedProduct._id);
    if (isExist)
      return toast.error("هذا المنتج مضاف بالفعل، قم بتعديله أو حذفه");

    const newItem = {
      product: selectedProduct,
      price: selectedProduct.sellPrice,
      quantity: Number(quantity),
    };
    setItems([...items, newItem]);
    setSelectedProduct(null);
    setQuantity("");
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const handleClose = () => {
    setOpen(false);
    setItems([]);
    setPaidAmount(0);
    setCustomer(null);
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
          quantity: i.quantity,
          price: i.price,
        })),
        paidAmount: Number(paidAmount),
        paymentType: paymentType._id,
      };
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
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        // تأكد هنا: هل البيانات هي المصفوفة أم موجودة داخل data.products؟
        setProducts(data);
      } catch (err) {
        console.error("خطأ في جلب المنتجات:", err);
        toast.error("فشل تحميل قائمة المنتجات");
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);
  useEffect(() => {
    if (total > 0) {
      setStatus(
        Number(paidAmount) === Number(total)
          ? "بالكامل مدفوع"
          : Number(paidAmount) < Number(total) && Number(paidAmount) > 0
            ? "مدفوع جزئياً"
            : "آجل (غير مدفوع)",
      );
    }
  }, [paidAmount, total]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle
        component="div"
        sx={{
          bgcolor: "#1a237e",
          color: "white",
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <InventoryIcon />
        <Typography variant="h6" fontWeight="bold">
          نظام الفواتير - إصدار فاتورة بيع
        </Typography>
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit} dir="rtl">
        <DialogContent sx={{ p: 4 }}>
          {/* القسم الأول: بيانات العميل والدفع */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <SelectComponent
                label="العميل"
                options={customers}
                value={customer?._id}
                onChange={setCustomer}
                optionLabel="name"
                placeholder="اختر العميل..."
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <SelectComponent
                label="طريقة الدفع"
                options={[
                  { _id: "cash", name: "نقداً (Cash)" },
                  { _id: "bank", name: "تحويل بنكي" },
                  { _id: "check", name: "شيك" },
                ]}
                value={paymentType?._id}
                onChange={setPaymentType}
                optionLabel="name"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <InputComponent
                label="المبلغ المدفوع"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Card
                variant="outlined"
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderColor: getStatusColor(),
                  borderWidth: 2,
                }}
              >
                <Typography variant="caption" display="block">
                  حالة السداد
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: getStatusColor(), fontWeight: "bold" }}
                >
                  {status}
                </Typography>
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ mb: 3 }}>إضافة منتجات للفاتورة</Divider>

          {/* القسم الثاني: شريط إضافة الأصناف */}
          <Box sx={{ p: 2, bgcolor: "#f9f9f9", borderRadius: 2, mb: 3 }}>
            <Grid
              container
              spacing={2}
              alignItems="center"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 justify-between"
            >
              <Grid item xs={12} md={4}>
                <SelectComponent
                  label="البحث عن منتج"
                  options={products}
                  value={selectedProduct?._id}
                  onChange={setSelectedProduct}
                  optionLabel="name"
                />
              </Grid>
              <Grid item xs={12} md={4} className="flex">
                <label
                  htmlFor="sellPrice"
                  className="flex items-center text-lg font-bold"
                >
                  سعر
                  <span className="text-gray-500 text-sm">
                    {" "}
                    ({selectedProduct?.unit})
                  </span>
                </label>
                <InputComponent
                  value={selectedProduct?.sellPrice || ""}
                  disabled
                  name={"sellPrice"}
                  className={"max-w-24"}
                />
              </Grid>
              <Grid item xs={12} md={4} className="flex ">
                <label
                  htmlFor="quantity"
                  className="flex items-center text-lg font-bold"
                >
                  الكمية
                  <span className="text-gray-500 text-sm">
                    {" "}
                    ({selectedProduct?.unit})
                  </span>
                </label>
                <InputComponent
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className={"max-w-24"}
                  name={"quantity"}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption">الإجمالي الفرعي</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {(
                    (selectedProduct?.sellPrice || 0) * (Number(quantity) || 0)
                  ).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="caption">المخزون</Typography>
                <Typography variant="subtitle1" fontWeight="bold">
                  {selectedProduct?.quantity || 0}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <ButtonComponent
                  label="أضف للجدول"
                  type="button"
                  onClick={addItem}
                  className="bg-indigo-600 w-full"
                  icon={<AddShoppingCartIcon />}
                  disabled={
                    selectedProduct?.quantity < Number(quantity) ||
                    !selectedProduct ||
                    !quantity ||
                    !Number(quantity) ||
                    !selectedProduct?.sellPrice
                  }
                />
              </Grid>
            </Grid>
          </Box>

          <TableContainer
            component={Paper}
            variant="outlined"
            sx={{ mb: 3, maxHeight: 400 }}
          >
            <Table stickyHeader>
              <TableBody>
                <TableRow
                  sx={{ "& th": { bgcolor: "#a8a8a8", fontWeight: "bold" } }}
                >
                  <TableCell align="right">#</TableCell>
                  <TableCell align="right">اسم المنتج</TableCell>
                  <TableCell align="center">السعر</TableCell>
                  <TableCell align="center">الكمية</TableCell>
                  <TableCell align="center">الإجمالي</TableCell>
                  <TableCell align="center">إجراء</TableCell>
                </TableRow>
              </TableBody>
              <TableBody>
                {items.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      align="center"
                      sx={{ py: 3, color: "gray" }}
                    >
                      لا توجد أصناف مضافة بعد
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((item, i) => (
                    <TableRow key={i} hover>
                      <TableCell align="right">{i + 1}</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 500 }}>
                        {item.product.name}
                      </TableCell>
                      <TableCell align="center">
                        {item.price.toLocaleString()}
                      </TableCell>

                      <TableCell align="center">
                        {item.product.unit} {item.quantity}
                      </TableCell>
                      <TableCell align="center">
                        {(item.price * item.quantity).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="error"
                          onClick={() => removeItem(i)}
                          size="small"
                        >
                          <DeleteSweepIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Card
              sx={{ p: 3, bgcolor: "#1a237e", color: "white", minWidth: 300 }}
            >
              <Box
                sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
              >
                <Typography>إجمالي الفاتورة:</Typography>
                <Typography variant="h6">{total.toLocaleString()}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #ffffff33",
                  pt: 1,
                }}
              >
                <Typography>المتبقي (ديون):</Typography>
                <Typography
                  variant="h6"
                  color={remainingAmount > 0 ? "#ffccbc" : "inherit"}
                >
                  {remainingAmount.toLocaleString()}
                </Typography>
              </Box>
            </Card>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: "#f8f9fa" }}>
          <ButtonComponent
            type="button"
            label="إلغاء العملية"
            onClick={handleClose}
          />
          <ButtonComponent
            label="حفظ وطباعة الفاتورة"
            type="submit"
            className="bg-indigo-900 px-8"
            disabled={items.length === 0 || !customer}
          />
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddInvoiceDialog;
