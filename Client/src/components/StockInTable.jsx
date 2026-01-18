import { Chip, Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const StockInTable = ({ stockIn }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col justify-center items-center"
    >
      <div className="overflow-x-auto w-full">
        <table className="w-full text-right border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 font-bold text-gray-600">التاريخ</th>
              <th className="p-4 font-bold text-gray-600">المنتج</th>
              <th className="p-4 font-bold text-gray-600">الفئة</th>
              <th className="p-4 font-bold text-gray-600">الكمية</th>
              <th className="p-4 font-bold text-gray-600">التكلفة</th>
              <th className="p-4 font-bold text-gray-600">ملاحظات</th>
              <th className="p-4 font-bold text-gray-600">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stockIn.map((stockIn) => (
              <tr className="hover:bg-blue-50/50 transition-colors text-sm md:text-base">
                <td className="p-4 text-gray-500">
                  {stockIn.date.split("T")[0]}
                </td>
                <td className="p-4">
                  <Typography variant="body2" fontWeight="bold">
                    {stockIn.productId.name}
                  </Typography>

                  {Object.entries(stockIn.productId.attributes).length > 0 ? (
                    Object.entries(stockIn.productId.attributes).map(
                      ([key, value], index) => (
                        <Typography variant="caption" color="textSecondary">
                          {key}: {value}
                          {index ===
                          Object.entries(stockIn.productId.attributes).length -
                            1
                            ? ""
                            : " | "}
                        </Typography>
                      ),
                    )
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      لا يوجد
                    </Typography>
                  )}
                </td>
                <td className="p-4">
                  <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs">
                    {stockIn.productId.category.name}
                  </span>
                </td>
                <td className="p-4 font-mono text-blue-600">
                  {stockIn.quantity} {stockIn.productId.unit}
                </td>
                <td className="p-4 text-gray-700 ">
                  <Chip
                    label={`₪ ${stockIn.costPrice}`}
                    size="small"
                    variant="filled"
                    color="success"
                  />
                </td>
                <td className="p-4">{stockIn.note}</td>
                <td className="p-4 font-bold text-green-600">
                  <Chip
                    label={`₪ ${stockIn.quantity * stockIn.costPrice}`}
                    size="small"
                    variant="filled"
                    color="warning"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StockInTable;
