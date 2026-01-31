import { Typography } from "@mui/material";
import React from "react";
import { motion } from "framer-motion";

const StockInTable = ({ stockIn }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full"
    >
      {/* 1. تصميم الجدول للشاشات الكبيرة (Desktop) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-right border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">التاريخ</th>
              <th className="px-6 py-4 font-bold">بيانات المنتج</th>
              <th className="px-6 py-4 font-bold text-center">الفئة</th>
              <th className="px-6 py-4 font-bold text-center">الكمية</th>
              <th className="px-6 py-4 font-bold text-center">التكلفة</th>
              <th className="px-6 py-4 font-bold">ملاحظات</th>
              <th className="px-6 py-4 font-bold text-left">المجموع</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {stockIn.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50/40 transition-all duration-200 group bg-white shadow-sm rounded-2xl"
              >
                {/* ... نفس كود الـ td الذي كتبناه سابقاً ... */}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-bold font-mono">
                      {item.date.split("T")[0]}
                    </span>
                    <span className="text-[10px] text-gray-400 text-right">
                      بتوقيت النظام
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: 800,
                      color: "#1e293b",
                      textAlign: "right",
                    }}
                  >
                    {item.productId.name}
                  </Typography>
                  <div className="flex flex-wrap gap-1 mt-1 justify-start">
                    {Object.entries(item.productId.attributes).map(
                      ([key, value], idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md border border-gray-200 uppercase"
                        >
                          {key}: {value}
                        </span>
                      ),
                    )}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-xl text-xs font-bold border border-indigo-100 uppercase">
                    {item.productId.category.name}
                  </span>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-blue-700 font-black text-lg font-mono leading-none">
                      {item.quantity}
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold">
                      {item.productId.unit}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5 text-center font-mono font-bold text-gray-600">
                  ₪ {item.costPrice.toLocaleString()}
                </td>
                <td className="px-6 py-5 max-w-[150px] text-gray-400 text-xs truncate">
                  {item.note || "—"}
                </td>
                <td className="px-6 py-5 text-left">
                  <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-black font-mono text-md border border-emerald-100">
                    ₪ {(item.quantity * item.costPrice).toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 2. تصميم البطاقات للشاشات الصغيرة (Mobile) */}
      <div className="md:hidden space-y-4 px-2">
        {stockIn.map((item, index) => (
          <motion.div
            key={index}
            whileTap={{ scale: 0.98 }}
            className="bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden"
          >
            {/* زخرفة جانبية للحالة */}
            <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>

            <div className="flex justify-between items-start mr-2">
              <div>
                <Typography variant="h6" fontWeight="900" color="#1e293b">
                  {item.productId.name}
                </Typography>
                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
                  {item.productId.category.name}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs font-mono font-bold text-gray-400">
                  {item.date.split("T")[0]}
                </p>
                <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-black text-sm mt-1">
                  ₪ {(item.quantity * item.costPrice).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl mr-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  الكمية
                </span>
                <span className="font-mono font-black text-blue-600 italic">
                  {item.quantity}{" "}
                  <small className="text-[8px] opacity-70">
                    {item.productId.unit}
                  </small>
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 font-bold uppercase">
                  تكلفة الوحدة
                </span>
                <span className="font-mono font-black text-gray-700 leading-none mt-1">
                  ₪ {item.costPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {item.note && (
              <div className="mr-2 border-r-2 border-gray-100 pr-3">
                <span className="text-[10px] text-gray-300 font-bold uppercase block mb-1">
                  ملاحظات
                </span>
                <p className="text-xs text-gray-500 italic">{item.note}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* حالة الجدول الفارغ */}
      {stockIn.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-300">
          <span className="text-6xl mb-4 animate-bounce">📭</span>
          <p className="font-bold tracking-widest text-sm uppercase">
            لا توجد بيانات توريد حالياً
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default StockInTable;
