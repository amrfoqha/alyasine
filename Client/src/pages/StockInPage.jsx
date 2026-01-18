import React, { useState } from "react";
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
import { motion } from "framer-motion";
import Header from "../components/Header";
import AddStockDialog from "../components/AddStockDialog";
import { useNavigate } from "react-router-dom";
const StockInPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
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
      <AddStockDialog open={open} setOpen={setOpen} />
      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center"
      >
        <TextField
          placeholder="ابحث باسم المنتج أو المورد..."
          variant="outlined"
          size="small"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 font-bold text-gray-600">التاريخ</th>
                <th className="p-4 font-bold text-gray-600">المنتج</th>
                <th className="p-4 font-bold text-gray-600">الفئة</th>
                <th className="p-4 font-bold text-gray-600">الكمية</th>
                <th className="p-4 font-bold text-gray-600">التكلفة</th>
                <th className="p-4 font-bold text-gray-600">المورد</th>
                <th className="p-4 font-bold text-gray-600">المجموع</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* صف تجريبي */}
              <tr className="hover:bg-blue-50/50 transition-colors text-sm md:text-base">
                <td className="p-4 text-gray-500">2024-05-15</td>
                <td className="p-4">
                  <Typography variant="body2" fontWeight="bold">
                    رخام تركي نخب أول
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    لون: رمادي | سمك: 3سم
                  </Typography>
                </td>
                <td className="p-4">
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs">
                    رخام
                  </span>
                </td>
                <td className="p-4 font-mono text-blue-600">150 م²</td>
                <td className="p-4 text-gray-700">85 ₪</td>
                <td className="p-4">
                  <Chip
                    label="شركة الخليج"
                    size="small"
                    variant="outlined"
                    color="primary"
                  />
                </td>
                <td className="p-4 font-bold text-green-600">12,750 ₪</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default StockInPage;
