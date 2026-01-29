import React from "react";
import { Chip, Typography } from "@mui/material";

const ChecksTable = ({ checks = [], setChecks = () => {} }) => {
  console.log(checks);
  return (
    <div className="overflow-x-auto w-full min-h-[200px] max-h-[380px]">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50">
            <th className="p-4 font-semibold text-gray-500 text-sm">
              رقم الشيك
            </th>
            <th className="p-4 font-semibold text-gray-500 text-sm">
              صاحب الشيك
            </th>
            <th className="p-4 font-semibold text-gray-500 text-sm">
              فاتورة/دفعة
            </th>
            <th className="p-4 font-semibold text-gray-500 text-sm">المبلغ</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">
              تاريخ الصرف
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {checks.length > 0 ? (
            checks.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="p-4">
                  <span className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded text-sm group-hover:text-black transition-colors">
                    {item.checkDetails.checkNumber || "غير معروف"}
                  </span>
                </td>
                <td className="p-4 text-gray-600 ">
                  <Chip
                    label={item.customer.name || "غير معروف"}
                    size="small"
                    color="success"
                    variant="outlined"
                    className="group-hover:text-black transition-colors"
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-gray-700 group-hover:text-black transition-colors">
                    {item.type || "غير معروف"}
                  </p>
                  <Typography variant="caption" color="textSecondary">
                    {item.code || "منتج غير معروف"}
                  </Typography>
                </td>
                <td className="p-4 text-gray-400 text-sm">
                  <Chip
                    label={`${item.amount} ₪`}
                    size="small"
                    color="success"
                    variant="outlined"
                    className="group-hover:text-black transition-colors"
                  />
                </td>
                <td className="p-4 text-gray-400 text-sm group-hover:text-black transition-colors">
                  {item.date ? item.date.split("T")[0] : item.date}
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

export default ChecksTable;
