import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { motion, observeTimeline } from "framer-motion";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { getStockIn } from "../API/StockAPI";
import UsePagination from "../context/UsePagination";
import StockInTable from "../components/StockInTable";

const StockInPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [stockIn, setStockIn] = useState([]);
  const [allStockIn, setAllStockIn] = useState([]);
  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;

  useEffect(() => {
    const fetchStockIn = async () => {
      try {
        const response = await getStockIn(Page, limit, search);
        setStockIn(response.stockIn);
        setAllStockIn(response.stockIn);
        setTotalPages(response.pagination.totalPages);
      } catch (error) {
        console.error("Error fetching stock in:", error);
      }
    };
    fetchStockIn();
  }, [Page, limit, search]);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearch(searchValue);
    setPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full " dir="rtl">
      <Header title="التوريدات" />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 8,
          mt: 4,
          px: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="primary">
          سجل التوريدات (Stock In)
        </Typography>
        <button
          onClick={() => navigate("/inventory")}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-all shadow-lg"
        >
          <AddBoxIcon />
          إضافة شحنة جديدة
        </button>
      </Box>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center"
      >
        <TextField
          placeholder="ابحث باسم المنتج..."
          variant="outlined"
          size="small"
          fullWidth
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
        <Chip
          icon={<FilterListIcon />}
          label="تصفية حسب الفئة"
          onClick={() => {}}
          clickable
          variant="outlined"
          sx={{ maxWidth: 400, px: 2, py: 1, fontSize: "1rem" }}
        />
      </motion.div>

      <StockInTable stockIn={stockIn} />
      <div className="flex justify-center mt-5">
        <UsePagination Page={Page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default StockInPage;
