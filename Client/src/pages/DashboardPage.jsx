import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
  Inventory,
  AttachMoney,
  Warning,
  TrendingUp,
  Receipt,
  People,
  Money,
  MoneyOff,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Grid,
  Button,
  Skeleton,
  Chip,
  Avatar,
  Divider,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Components & API
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import RecentActivityTable from "../components/RecentActivityTable";
import RecentFinancialActivity from "../components/RecentFinancialActivity";
import LoadingOverlay from "../components/LoadingOverlay";
import {
  getDashboardStats,
  getProductStockoutReport,
} from "../API/DashboardAPI";
import { getProductsName } from "../API/ProductAPI";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import ChecksTable from "../components/ChecksTable";
import { Check, Sandwich, Timer } from "lucide-react";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    stockIn: [],
    customersCount: 0,
    totalSales: 0,
    totalMovements: 0,
    totalReceived: 0,
    totalDebt: 0,
    AllChecks: [],
    AllChecksCount: 0,
    AllChecksAmount: 0,
    recentFinancialActivity: [],
    salesTrend: [],
    topCustomers: [],
    topSellingProduct: null,
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [loadingProductStats, setLoadingProductStats] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardStats();
        setStats({
          totalProducts: data.productsCount,
          categoriesCount: data.productCategoriesCount,
          stockIn: data.lastStockIn,
          customersCount: data.customersCount,
          totalSales: data.totalSales,
          totalMovements: data.totalMovements,
          totalReceived: data.totalReceived,
          totalDebt: data.totalDepts,
          countOutOfStock: data.countOutOfStock,
          AllChecks: data.AllChecks,
          AllChecksCount: data.AllChecksCount,
          AllChecksAmount: data.AllChecksAmount,
          recentFinancialActivity: data.recentFinancialActivity,
          salesTrend: data.salesTrend,
          topCustomers: data.topCustomers,
          topSellingProduct: data.topSellingProduct,
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();

    const fetchProducts = async () => {
      try {
        const data = await getProductsName();
        setProducts(data.map((p) => ({ value: p._id, label: p.name })));
      } catch (error) {
        console.error("Fetch Products Error:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = async (option) => {
    setSelectedProduct(option);
    if (!option) {
      setProductStats(null);
      return;
    }
    setLoadingProductStats(true);
    try {
      const data = await getProductStockoutReport(option.value);
      setProductStats(data);
    } catch (error) {
      console.error("Fetch Product Stats Error:", error);
    } finally {
      setLoadingProductStats(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 },
    },
  };

  if (loading) return <LoadingOverlay open={true} />;

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-10" dir="rtl">
      <Header title="مركز القيادة" />

      <main className="p-4 md:p-8 max-w-8xl mx-auto mt-4 md:mt-[-30px]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* رسالة الترحيب والوصول السريع */}
          <Box className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <Box>
              <Typography
                variant="h4"
                fontWeight="900"
                sx={{ color: "#1e293b", letterSpacing: -1 }}
              >
                أهلاً بك مجدداً 👋
              </Typography>
              <Typography variant="body1" color="text.secondary">
                إليك ملخص شامل لأداء نشاطك التجاري اليوم
              </Typography>
            </Box>
          </Box>
          {/* القسم الأول: الأداء المالي (The Big Numbers) */}
          <section className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DashboardCard
                title="إجمالي المبيعات"
                value={stats.totalSales}
                symbol="₪"
                icon={<TrendingUp sx={{ fontSize: 35 }} />}
                color="indigo"
                trend="+12% عن الشهر الماضي"
              />

              <DashboardCard
                title="التحصيل المالي"
                value={stats.totalReceived}
                symbol="₪"
                icon={<AttachMoney sx={{ fontSize: 35 }} />}
                color="green"
                subtitle="صافي المبالغ المستلمة"
              />
              <DashboardCard
                title="ديون العملاء"
                value={stats.totalDebt}
                symbol="₪"
                icon={<MoneyOff sx={{ fontSize: 35 }} />}
                color="red"
                subtitle="تتطلب متابعة عاجلة"
              />
            </div>
          </section>
          <section className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="text-indigo-600" />
              <Typography variant="h5" fontWeight="900" color="#1e293b">
                تحليلات الأداء الذكية
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <DashboardCard
                title="الأرباح المتوقعة"
                value={Math.ceil(stats.totalSales * 0.25)}
                symbol="₪"
                icon={<AttachMoney sx={{ color: "#10b981" }} />}
                color="green"
              >
                <span
                  className="flex flex-row-reverse justify-start gap-2 text-gray-400"
                  dir="ltr"
                >
                  <label htmlFor="">:تحصيل المبيعات</label>
                  <span>{`₪${stats.totalSales.toLocaleString()}`}</span>
                </span>
              </DashboardCard>

              <Paper className="p-5 rounded-3xl border border-slate-100 shadow-sm bg-white hover:shadow-md transition-all">
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight="bold"
                      color="text.secondary"
                    >
                      المنتج الأكثر مبيعاً
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="900"
                      sx={{ mt: 1, color: "#1e293b" }}
                    >
                      {stats.topSellingProduct?.name || "تحميل البيانات..."}
                    </Typography>
                    {stats.topSellingProduct && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                      >
                        تم بيع {stats.topSellingProduct.totalQuantitySold}{" "}
                        {stats.topSellingProduct.unit || "وحدة"}
                      </Typography>
                    )}
                    <Chip
                      label="الأكثر طلباً"
                      size="small"
                      className="mt-2 bg-orange-50 text-orange-600 font-bold"
                    />
                  </Box>
                  <div className="p-3 bg-orange-50 rounded-2xl">
                    <Inventory className="text-orange-500" />
                  </div>
                </Stack>
              </Paper>

              {/* 3. كارت معدل الفواتير اليومي */}
              <DashboardCard
                title="متوسط العمليات"
                value={`${(stats.totalMovements / 30).toFixed(2)}`}
                icon={<Receipt sx={{ color: "#6366f1" }} />}
                color="indigo"
                subtitle="عملية بيع / يومياً"
              >
                <span
                  className="flex flex-row-reverse justify-start gap-2 text-gray-400 text-xs"
                  dir="rtl"
                >
                  <label htmlFor="">
                    مقياس يوضح مدى "نشاط" المحل التجاري بشكل شهري.
                  </label>
                </span>
                <span
                  className="flex flex-row-reverse justify-start gap-2 text-gray-400 text-xs"
                  dir="ltr"
                >
                  <label htmlFor="">:إجمالي العمليات</label>
                  <span>{stats.totalMovements}</span>
                </span>
              </DashboardCard>
            </div>
          </section>
          <section className="flex flex-col gap-8 mb-10 px-4 w-full" dir="rtl">
            <Typography variant="h6" fontWeight="bold" className="mb-4">
              نظرة سريعة
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 w-full justify-between">
              <DashboardCard
                title={"عميل مسجل"}
                value={stats.customersCount}
                icon={
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <People />
                  </div>
                }
              />
              <DashboardCard
                title={"صنف في المستودع"}
                value={stats.totalProducts}
                icon={
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Inventory />
                  </div>
                }
              />

              <DashboardCard
                title={"أصناف منتهية"}
                value={stats.countOutOfStock || "0"}
                icon={
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <Warning sx={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                }
              />
              <DashboardCard
                title={"عدد الشيكات غير المحصلة"}
                value={stats.AllChecksCount || "0"}
                icon={
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    {/* give me a symbol/icon for sand clock or sand watch */}
                    <Timer sx={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                }
              />
              <DashboardCard
                title={"إجمالي الشيكات غير المحصلة"}
                value={stats.AllChecksAmount || "0"}
                icon={
                  <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                    <Money sx={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                }
              />
            </div>
          </section>

          {/* تحليل أداء الأصناف */}
          <section className="mb-10 px-4" dir="rtl">
            <Paper className="p-8 rounded-3xl border border-slate-100 shadow-sm bg-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <Stack direction="row" gap={2} alignItems="center">
                  <div className="p-3 bg-indigo-50 rounded-2xl">
                    <TrendingUp className="text-indigo-600" />
                  </div>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      تحليل أداء الصنف
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      اختر صنفاً لعرض إحصائيات المبيعات الخاصة به
                    </Typography>
                  </Box>
                </Stack>
                <div className="w-full md:w-80" dir="rtl">
                  <Select
                    options={products}
                    value={selectedProduct}
                    onChange={handleProductChange}
                    placeholder="ابحث عن صنف..."
                    isClearable
                    className="text-right"
                    noOptionsMessage={() => "لا توجد نتائج"}
                  />
                </div>
              </div>

              {loadingProductStats ? (
                <Stack
                  direction="row"
                  spacing={4}
                  justifyContent="center"
                  py={4}
                >
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={100}
                    className="rounded-2xl"
                  />
                  <Skeleton
                    variant="rounded"
                    width={200}
                    height={100}
                    className="rounded-2xl"
                  />
                </Stack>
              ) : productStats ? (
                <Grid container spacing={4}>
                  <Grid item xs={12} md={3}>
                    <Box className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="text.secondary"
                        display="block"
                        mb={1}
                      >
                        إجمالي الكمية المباعة
                      </Typography>
                      <Typography variant="h4" fontWeight="900" color="primary">
                        {productStats.totalQuantity.toLocaleString()}{" "}
                        <Typography variant="caption" color="text.secondary">
                          {productStats.product?.unit || ""}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        منذ بداية العمل
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="text.secondary"
                        display="block"
                        mb={1}
                      >
                        إجمالي الإيرادات
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="900"
                        color="success.main"
                      >
                        ₪{productStats.totalRevenue.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        القيمة الإجمالية للمبيعات
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="text.secondary"
                        display="block"
                        mb={1}
                      >
                        عدد الفواتير
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="900"
                        color="warning.main"
                      >
                        {productStats.invoiceCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        مرات التكرار في الفواتير
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                      <Typography
                        variant="caption"
                        fontWeight="bold"
                        color="indigo.700"
                        display="block"
                        mb={1}
                      >
                        الكمية الحالية المتوفرة
                      </Typography>
                      <Typography
                        variant="h4"
                        fontWeight="900"
                        color="indigo.900"
                      >
                        {productStats.product?.quantity || 0}{" "}
                        <Typography variant="caption" color="indigo.700">
                          {productStats.product?.unit || ""}
                        </Typography>
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        المخزون الفعلي بالمستودع
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Box className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Inventory
                    className="text-slate-300 mb-2"
                    sx={{ fontSize: 40 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    يرجى اختيار صنف من القائمة أعلاه لعرض التحليلات
                  </Typography>
                </Box>
              )}
            </Paper>
          </section>

          <section
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10 px-4"
            dir="rtl"
          >
            <Paper className="lg:col-span-2 p-6 rounded-3xl border border-slate-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="text-indigo-600" />
                <Typography variant="h6" fontWeight="bold">
                  إحصائيات المبيعات الشهرية
                </Typography>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.salesTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey={(item) => `${item._id.month}/${item._id.year}`}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12, fill: "#64748b" }}
                    />
                    <Tooltip
                      contentStyle={{ borderRadius: "12px", border: "none" }}
                      cursor={{ fill: "#f8fafc" }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {stats.salesTrend.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            index === stats.salesTrend.length - 1
                              ? "#6366f1"
                              : "#e2e8f0"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Paper>

            <Paper className="p-6 rounded-3xl border border-slate-100 shadow-sm bg-white">
              <div className="flex items-center gap-2 mb-6">
                <People className="text-orange-600" />
                <Typography variant="h6" fontWeight="bold">
                  أبرز العملاء (حسب الرصيد)
                </Typography>
              </div>
              <Stack spacing={3}>
                {stats.topCustomers.map((customer, index) => (
                  <Box
                    key={customer._id}
                    className="flex items-center justify-between group p-2 rounded-xl"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: index === 0 ? "#fef3c7" : "#f1f5f9",
                          color: index === 0 ? "#d97706" : "#475569",
                          fontWeight: "bold",
                        }}
                      >
                        {index + 1}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="bold">
                          {customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          كود: {customer.code}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2" fontWeight="900" color="error">
                      ₪{customer.balance.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </section>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 px-4 w-full"
            dir="rtl"
          >
            <div className="w-full">
              <div className="flex items-center justify-between mb-4 px-4">
                <Stack direction="row" gap={2} alignItems="center">
                  <Receipt className="text-slate-400" />
                  <Typography variant="h6" fontWeight="bold">
                    آخر الحركات المالية
                  </Typography>
                </Stack>
              </div>
              <Paper className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <RecentFinancialActivity data={stats.recentFinancialActivity} />
              </Paper>
            </div>

            <div className="w-full">
              <div className="flex items-center justify-between mb-4 px-4">
                <Stack direction="row" gap={2} alignItems="center">
                  <Inventory className="text-slate-400" />
                  <Typography variant="h6" fontWeight="bold">
                    آخر حركات المخازن
                  </Typography>
                </Stack>
                <Button
                  size="large"
                  className="text-indigo-600"
                  onClick={() => navigate("/stockin")}
                >
                  عرض الكل
                </Button>
              </div>
              <Paper className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <RecentActivityTable data={stats.stockIn} />
              </Paper>
            </div>
          </div>

          <section className="px-4 mb-10" dir="rtl">
            <div className="flex items-center justify-between mb-4 px-4">
              <Stack direction="row" gap={2} alignItems="center">
                <Check className="text-slate-400" />
                <Typography variant="h6" fontWeight="bold">
                  آثار الشيكات المعلقة
                </Typography>
              </Stack>
              <Button
                size="large"
                className="text-indigo-600"
                onClick={() => navigate("/checks")}
              >
                عرض الكل
              </Button>
            </div>
            <Paper className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <ChecksTable checks={stats.AllChecks} />
            </Paper>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
