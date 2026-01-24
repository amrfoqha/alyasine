import React, { useState, useEffect } from "react";
import { Box, Typography, Chip, Stack } from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { motion } from "framer-motion";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { getStockIn } from "../API/StockAPI";
import UsePagination from "../context/UsePagination";
import StockInTable from "../components/StockInTable";
import SearchBox from "../components/SearchBox";

const StockInPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stockIn, setStockIn] = useState([]);
  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchStockIn = async () => {
      try {
        const response = await getStockIn(Page, limit, search);
        setStockIn(response.stockIn);
        setTotalPages(response.pagination.totalPages);
        setTotalResults(
          response.pagination.totalItems || response.stockIn.length,
        );
      } catch (error) {
        console.error("Error fetching stock in:", error);
      }
    };
    fetchStockIn();
  }, [Page, limit, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full font-sans pb-10" dir="rtl">
      <Header title="حركة الوارد" />

      {/* Header Section */}
      <Box sx={{ px: { xs: 4, md: 8 }, pt: 6, pb: 4 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={3}
        >
          <Box>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              sx={{ mb: 1 }}
              className="flex items-center gap-2"
            >
              <div className="bg-blue-600 p-2  rounded-xl text-white shadow-lg shadow-blue-200">
                <LocalShippingRoundedIcon fontSize="small" />
              </div>
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, color: "#1e293b", letterSpacing: -1 }}
              >
                سجل الشحنات الواردة
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ color: "#64748b", fontWeight: 500 }}
            >
              متابعة تدفق المنتجات الجديدة إلى المخازن وتوثيق الموردين.
            </Typography>
          </Box>

          <motion.button
            whileHover={{ scale: 1.05, translateY: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/inventory")}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-[1.2rem] font-bold shadow-xl shadow-slate-200 transition-all"
          >
            <AddBoxIcon />
            تسجيل توريد جديد
          </motion.button>
        </Stack>
      </Box>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 md:mx-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* Toolbar */}
        <div className="p-6 md:p-8 bg-gray-50/30 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between items-center">
          <div className="w-full lg:w-2/3">
            <SearchBox
              onChange={handleSearch}
              placeholder="ابحث برقم الشحنة، اسم المورد، أو كود المنتج..."
            />
          </div>

          <Stack
            direction="row"
            spacing={2}
            className="w-full lg:w-auto justify-end"
          >
            <Chip
              icon={<FilterListIcon sx={{ fontSize: "18px !important" }} />}
              label="تصفية النتائج"
              onClick={() => {}}
              clickable
              sx={{
                height: 48,
                borderRadius: "16px",
                px: 2,
                bgcolor: "white",
                border: "1px solid #e2e8f0",
                fontWeight: 700,
                color: "#475569",
                "&:hover": { bgcolor: "#f1f5f9" },
              }}
            />
          </Stack>
        </div>

        {/* Table Area */}
        <div className="p-2 md:p-6 min-h-[400px]">
          <StockInTable stockIn={stockIn} />
        </div>

        {/* Pagination Footer */}
        <div className="py-8 flex flex-col items-center gap-4 border-t border-gray-50 bg-gray-50/20">
          <div className="bg-white px-6 py-2 rounded-2xl border border-gray-100 shadow-sm">
            <UsePagination
              Page={Page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", fontWeight: 700 }}
          >
            عرض {stockIn.length} من أصل {totalResults} شحنة مسجلة
          </Typography>
        </div>
      </motion.div>
    </div>
  );
};

export default StockInPage;
