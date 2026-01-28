import React from "react";
import { Chip, Typography } from "@mui/material";

const RecentActivityTable = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto w-full min-h-[380px] max-h-[380px]">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-gray-500 text-sm">المنتج</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">الكمية</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">
              المورد/التكلفة
            </th>
            <th className="p-4 font-semibold text-gray-500 text-sm">التاريخ</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">ملاحظات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 h-full">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-colors group h-full "
              >
                <td className="p-4 h-full">
                  <p className="font-bold text-gray-500 group-hover:text-black transition-colors">
                    {item.productId?.name || "منتج غير معروف"}
                  </p>
                  <Typography variant="caption" color="textSecondary">
                    {item.productId?.category?.name}
                  </Typography>
                </td>
                <td className="p-4 h-full">
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm group-hover:text-black transition-colors">
                    {item.quantity} {item.productId?.unit}
                  </span>
                </td>
                <td className="p-4 text-gray-600 h-full">
                  <Chip
                    label={`₪${item.costPrice}`}
                    size="small"
                    color="success"
                    variant="outlined"
                  />
                </td>
                <td className="p-4 text-gray-400 text-sm h-full group-hover:text-black transition-colors">
                  {item.createdAt ? item.createdAt.split("T")[0] : item.date}
                </td>
                <td className="p-4 text-gray-400 text-sm h-full group-hover:text-black transition-colors">
                  {item.note || "-"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-400">
                لا توجد بيانات حديثة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentActivityTable;
