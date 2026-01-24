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
} from "@mui/material";

// Components & API
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import RecentActivityTable from "../components/RecentActivityTable";
import LoadingOverlay from "../components/LoadingOverlay";
import { getDashboardStats } from "../API/DashboardAPI";
import { useNavigate } from "react-router-dom";

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
  });
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
          totalPayments: data.totalPayments,
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

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

      <main className="p-4 md:p-8 max-w-7xl mx-auto mt-[-30px]">
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
                value={stats.totalReceived + stats.totalPayments}
                symbol="₪"
                icon={<AttachMoney sx={{ fontSize: 35 }} />}
                color="green"
              />
              <DashboardCard
                title="ديون العملاء"
                value={stats.totalDebt}
                symbol="₪"
                icon={<Warning sx={{ fontSize: 35 }} />}
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
                      {stats.stockIn[0]?.name || "تحميل..."}
                    </Typography>
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
          {/* القسم الثاني: إحصائيات المخزون والعملاء */}
          <Grid container spacing={4} className="mb-10">
            <Grid item xs={12} lg={8}>
              <div className="flex items-center justify-between mb-4">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Inventory className="text-slate-400" />
                  <Typography variant="h6" fontWeight="bold">
                    آخر حركات المخازن
                  </Typography>
                </Stack>
                <Button
                  size="small"
                  className="text-indigo-600"
                  onClick={() => navigate("/stockin")}
                >
                  عرض الكل
                </Button>
              </div>
              <Paper className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <RecentActivityTable data={stats.stockIn} />
              </Paper>
            </Grid>

            <Grid item xs={12} lg={4}>
              <Typography variant="h6" fontWeight="bold" className="mb-4">
                نظرة سريعة
              </Typography>
              <Stack spacing={2}>
                <Paper className="p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <People />
                  </div>
                  <Box>
                    <Typography variant="h5" fontWeight="900">
                      {stats.customersCount}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      عميل مسجل
                    </Typography>
                  </Box>
                </Paper>

                <Paper className="p-5 rounded-2xl border border-slate-100 flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Inventory />
                  </div>
                  <Box>
                    <Typography variant="h5" fontWeight="900">
                      {stats.totalProducts}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      صنف في المستودع
                    </Typography>
                  </Box>
                </Paper>

                {/* بطاقة التنبيه المحدثة */}
                <Paper className="p-5 rounded-2xl bg-linear-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-100">
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {stats.countOutOfStock || "0"}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        أصناف منتهية
                      </Typography>
                    </Box>
                    <Warning sx={{ fontSize: 40, opacity: 0.5 }} />
                  </Stack>
                </Paper>
              </Stack>
            </Grid>
          </Grid>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
