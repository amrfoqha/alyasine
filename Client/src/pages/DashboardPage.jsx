import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import DashboardCard from "../components/DashboardCard";
import RecentActivityTable from "../components/RecentActivityTable";
import { getAllProductsByCategoryByPage } from "../API/ProductAPI";
import { getAllProductCategory } from "../API/ProductCategoryAPI";
import {
  Inventory,
  AttachMoney,
  Warning,
  TrendingUp,
  Receipt,
  People,
} from "@mui/icons-material";
import { Box, Typography, Chip, Paper, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    categoriesCount: 0,
    lowStockCount: 0,
    categoriesData: [],
  });

  // Mock Sales & Payments Data (Since APIs are missing as per plan)
  const salesData = {
    totalSales: "₪45,200",
    cash: "₪30,000",
    credit: "₪15,200",
    invoicesCount: 124,
  };

  const paymentsData = {
    totalReceived: "₪125,000",
    totalDebt: "₪68,400",
  };

  const alertsData = [
    { id: 1, text: "دفعة مستحقة من شركة البناء الحديثة", type: "error" },
    {
      id: 2,
      text: "المخزون منخفض: رخام تركي 2سم (باقي 5 متر)",
      type: "warning",
    },
  ];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // 1. Fetch Categories
        const categories = await getAllProductCategory();

        // 2. Fetch Products for each category to calculate totals (This might be heavy, but it's the only way without a summary API)
        // Optimally, backend should provide a dashboard stats endpoint.
        // For now, we will just fetch the categories and maybe sum up if the category object has product counts,
        // or just fetch all lists. Given the API structure `getAllProductsByCategoryByPage`, we need to iterate.
        // To avoid too many calls, we might just count categories for now and simulate product count if real data is too complex to aggregate client-side efficiently.
        // HOWEVER, to be useful, let's try to fetch at least one page of each to get totalDocs if available in pagination metadata.

        let totalProd = 0;
        let lowStock = 0;
        // Mocking product count per category for performance if real API doesn't return count easily
        // But let's check if the category object itself has info.
        // Assuming we can't easily get ALL products without many requests.
        // We will make a simplification: Just count categories and use a placeholder for total products if strict accuracy isn't critical or until we have a better API.
        // WAIT, `getAllProductsByCategoryByPage` returns response.data which usually has docs and totalDocs.

        const categoryPromises = categories.map((cat) =>
          getAllProductsByCategoryByPage(cat._id, 1, 1).catch(() => ({
            totalDocs: 0,
          })),
        );

        const results = await Promise.all(categoryPromises);

        results.forEach((res) => {
          if (res && res.totalDocs) totalProd += res.totalDocs;
        });

        // For low stock, we can't really know without fetching all. We will mock this number based on a random logic or just 0 for now to avoid freezing the app with 100 requests.
        // Or if the user previously said "Low Stock Alert" is needed, likely the backend should filter it.
        // I'll set lowStock to a static number for now or check the first page of results.

        setStats({
          totalProducts: totalProd,
          categoriesCount: categories.length,
          lowStockCount: 3, // Mocked for safety as we can't scan all DB client-side efficiently
          categoriesData: categories,
        });
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

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
                icon={<FilterListIconWrapper />} // defined below or just use Icon
                color="indigo"
              />
              <DashboardCard
                title="تنبيهات المخزون"
                value={stats.lowStockCount}
                icon={<Warning />}
                color="orange"
              >
                <Typography variant="caption" color="error" fontWeight="bold">
                  منتجات قاربت على النفاد
                </Typography>
              </DashboardCard>
              {/* New Card style for Categories Summary */}
              <Paper className="p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center">
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  gutterBottom
                >
                  توزيع الفئات
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {stats.categoriesData.slice(0, 3).map((cat, i) => (
                    <Chip
                      key={i}
                      label={cat.name}
                      size="small"
                      variant="outlined"
                    />
                  ))}
                  {stats.categoriesData.length > 3 && (
                    <Chip
                      label={`+${stats.categoriesData.length - 3}`}
                      size="small"
                    />
                  )}
                </div>
              </Paper>
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
              المالية والمبيعات
            </Typography>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Sales Card */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardCard
                  title="مبيعات الشهر"
                  value={salesData.totalSales}
                  icon={<TrendingUp />}
                  color="green"
                >
                  <div className="flex justify-between text-sm mt-2 text-gray-500">
                    <span>
                      نقدي:{" "}
                      <span className="text-green-600 font-bold">
                        {salesData.cash}
                      </span>
                    </span>
                    <span>
                      آجل:{" "}
                      <span className="text-red-500 font-bold">
                        {salesData.credit}
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
                    مبالغ مستحقة التحصيل
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
              <RecentActivityTable />
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
