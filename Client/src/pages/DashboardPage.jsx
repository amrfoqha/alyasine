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
} from "@mui/material";

// Components & API
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import RecentActivityTable from "../components/RecentActivityTable";
import LoadingOverlay from "../components/LoadingOverlay";
import { getDashboardStats } from "../API/DashboardAPI";
import { useNavigate } from "react-router-dom";
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
          AllChecks: data.AllChecks,
          AllChecksCount: data.AllChecksCount,
          AllChecksAmount: data.AllChecksAmount,
        });
        console.log(data.AllChecksAmount, data.AllChecksCount);
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

      <main className="p-4 md:p-8 max-w-8xl mx-auto mt-[-30px]">
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
                    {/* give me a symbol/icon for sand clock or sand watch */}
                    <Money sx={{ fontSize: 40, opacity: 0.5 }} />
                  </div>
                }
              />
            </div>
          </section>
          {/* القسم الثاني: إحصائيات المخزون والعملاء */}
          <div className="flex gap-8 mb-10 px-4" dir="rtl">
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

            <div className="w-full">
              <div className="flex items-center justify-between mb-4 px-4">
                <Stack direction="row" gap={2} alignItems="center">
                  <Inventory className="text-slate-400" />
                  <Typography variant="h6" fontWeight="bold">
                    آثار الشيكات
                  </Typography>
                </Stack>
                <Button
                  size="large"
                  className="text-indigo-600"
                  onClick={() => navigate("/payments")}
                >
                  عرض الكل
                </Button>
              </div>
              <Paper className="rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <ChecksTable data={stats.AllChecks} />
              </Paper>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
