import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import RecentActivityTable from "../components/RecentActivityTable";
import {
  Inventory,
  AttachMoney,
  Warning,
  TrendingUp,
  Receipt,
  People,
} from "@mui/icons-material";
import { Box, Typography, Chip, Paper } from "@mui/material";
import { motion } from "framer-motion";
import LoadingOverlay from "../components/LoadingOverlay";
import { getDashboardStats } from "../API/DashboardAPI";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    stockIn: [],
    customersCount: 0,
  });
  const [recentStrockIn, setRecentStockIn] = useState([]);
  const [salesData, setSalesData] = useState({
    totalSales: 0,
    cash: 0,
    credit: 0,
    invoicesCount: 0,
  });

  const [paymentsData, setPaymentsData] = useState({
    totalReceived: "₪0",
    totalDebt: "₪0",
  });

  const alertsData = [
    { id: 1, text: "ميزة التنبيهات قيد التطوير", type: "warning" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardStats();
        console.log(data);
        setStats({
          totalProducts: data.productsCount,
          categoriesCount: data.productCategoriesCount,
          stockIn: data.lastStockIn,
          customersCount: data.customersCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen w-full" dir="rtl">
      <Header title="لوحة التحكم" />

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* Section 1: Stock Overview */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Inventory color="primary" />
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                نظرة عامة على المخزون
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <DashboardCard
                title="إجمالي المنتجات"
                value={stats.totalProducts}
                icon={<Inventory />}
                color="blue"
              />
              <DashboardCard
                title="عدد الفئات"
                value={stats.categoriesCount}
                icon={<FilterListIconWrapper />}
                color="indigo"
              />
              <DashboardCard
                title="تنبيهات المخزون"
                value={0}
                icon={<Warning />}
                color="orange"
              >
                <Typography variant="caption" color="error" fontWeight="bold">
                  منتجات قاربت على النفاد
                </Typography>
              </DashboardCard>
              {/* New Card style for Categories Summary */}
              <DashboardCard
                title="عدد العملاء"
                value={stats.customersCount}
                icon={<People />}
                color="indigo"
              />
            </div>
          </section>

          {/* Section 2: Financials (Sales & Payments) */}
          <section>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="text.primary"
              sx={{ mb: 4, display: "flex", alignItems: "center", gap: 1 }}
            >
              <AttachMoney color="success" />
              المالية والمبيعات (تقديري)
            </Typography>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Card */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  title="مبيعات (آخر 100 حركة)"
                  value={`₪${salesData.totalSales.toLocaleString()}`}
                  icon={<TrendingUp />}
                  color="green"
                >
                  <div className="flex justify-between text-sm mt-2 text-gray-500">
                    <span>
                      عدد الحركات:{" "}
                      <span className="text-green-600 font-bold">
                        {salesData.invoicesCount}
                      </span>
                    </span>
                  </div>
                </DashboardCard>

                <DashboardCard
                  title="ديون العملاء"
                  value={paymentsData.totalDebt}
                  icon={<People />}
                  color="red"
                >
                  <Typography variant="caption" color="text.secondary">
                    مبالغ مستحقة التحصيل (قيد التطوير)
                  </Typography>
                </DashboardCard>
              </div>

              {/* Quick Alerts Logic */}
              <Paper className="p-5 rounded-2xl border border-red-100 bg-red-50/30">
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  gutterBottom
                  color="error"
                  sx={{ display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Warning fontSize="small" />
                  تنبيهات عاجلة
                </Typography>
                <div className="flex flex-col gap-3 mt-2">
                  {alertsData.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-2 bg-white p-3 rounded-lg border border-red-100 shadow-sm"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${alert.type === "error" ? "bg-red-500" : "bg-orange-500"}`}
                      />
                      <Typography
                        variant="body2"
                        fontWeight={500}
                        color="text.primary"
                      >
                        {alert.text}
                      </Typography>
                    </div>
                  ))}
                </div>
              </Paper>
            </div>
          </section>

          {/* Section 3: Recent Stock In */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Receipt color="primary" />
              <Typography variant="h5" fontWeight="bold">
                آخر المدخلات (Stock In)
              </Typography>
            </div>
            <Paper className="rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <RecentActivityTable data={stats.stockIn} />
            </Paper>
          </section>
        </motion.div>
      </main>
    </div>
  );
};

const FilterListIconWrapper = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    fill="currentColor"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z" />
  </svg>
);

export default DashboardPage;
