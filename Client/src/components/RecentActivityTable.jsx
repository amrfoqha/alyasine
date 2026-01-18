import React from "react";
import { Chip } from "@mui/material";

const RecentActivityTable = () => {
  // Mock Data
  const recentInput = [
    {
      id: 1,
      productName: "رخام إيطالي كرارا",
      quantity: "50 م²",
      supplier: "شركة النور",
      date: "2024-05-20",
      type: "stockIn",
    },
    {
      id: 2,
      productName: "جرانيت مصري",
      quantity: "120 م²",
      supplier: "المروة للاحجار",
      date: "2024-05-19",
      type: "stockIn",
    },
    {
      id: 3,
      productName: "سيراميك أبيض 60*60",
      quantity: "200 كرتونة",
      supplier: "سيراميك رأس الخيمة",
      date: "2024-05-18",
      type: "stockIn",
    },
    {
      id: 4,
      productName: "لاصق سيراميك",
      quantity: "50 شوال",
      supplier: "مواد بناء القدس",
      date: "2024-05-18",
      type: "stockIn",
    },
    {
      id: 5,
      productName: "فواصل تمدد",
      quantity: "1000 قطعة",
      supplier: "شركة النور",
      date: "2024-05-17",
      type: "stockIn",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-gray-500 text-sm">المنتج</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">الكمية</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">المورد</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {recentInput.map((item) => (
            <tr
              key={item.id}
              className="hover:bg-gray-50 transition-colors group"
            >
              <td className="p-4">
                <p className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {item.productName}
                </p>
              </td>
              <td className="p-4">
                <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm">
                  {item.quantity}
                </span>
              </td>
              <td className="p-4 text-gray-600">{item.supplier}</td>
              <td className="p-4 text-gray-400 text-sm">{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
