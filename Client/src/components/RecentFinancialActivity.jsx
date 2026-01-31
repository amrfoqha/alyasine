import React from "react";
import { Chip, Typography, Stack, Box } from "@mui/material";
import {
  Receipt,
  Payment,
  DeleteForever,
  AssignmentReturn,
} from "@mui/icons-material";

const typeStyles = {
  invoice: {
    label: "فاتورة",
    color: "primary",
    icon: <Receipt sx={{ fontSize: 16 }} />,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  payment: {
    label: "دفعة",
    color: "success",
    icon: <Payment sx={{ fontSize: 16 }} />,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  invoice_deleted: {
    label: "حذف فاتورة",
    color: "error",
    icon: <DeleteForever sx={{ fontSize: 16 }} />,
    bg: "bg-red-50",
    text: "text-red-600",
  },
  payment_deleted: {
    label: "حذف دفعة",
    color: "error",
    icon: <DeleteForever sx={{ fontSize: 16 }} />,
    bg: "bg-red-50",
    text: "text-red-600",
  },
  check_return: {
    label: "شيك راجع",
    color: "warning",
    icon: <AssignmentReturn sx={{ fontSize: 16 }} />,
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
};

const RecentFinancialActivity = ({ data = [] }) => {
  return (
    <div className="overflow-x-auto w-full min-h-[380px] max-h-[450px]">
      <table className="w-full text-right border-collapse">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
            <th className="p-4 font-semibold text-gray-500 text-sm">التوع</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">العميل</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">المبلغ</th>
            <th className="p-4 font-semibold text-gray-500 text-sm">التاريخ</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.length > 0 ? (
            data.map((item) => {
              const style = typeStyles[item.type] || {
                label: item.type,
                color: "default",
                bg: "bg-gray-50",
                text: "text-gray-600",
              };
              return (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="p-4">
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Box
                        className={`${style.bg} ${style.text} p-1.5 rounded-lg flex items-center justify-center`}
                      >
                        {style.icon}
                      </Box>
                      <span className={`text-sm font-bold ${style.text}`}>
                        {style.label}
                      </span>
                    </Stack>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-700 group-hover:text-black transition-colors">
                      {item.customer?.name || "عميل غير معروف"}
                    </p>
                    <Typography variant="caption" color="textSecondary">
                      {item.customer?.code}
                    </Typography>
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-mono font-bold ${item.credit > 0 ? "text-green-600" : "text-blue-600"}`}
                    >
                      ₪{item.credit > 0 ? item.credit : item.debit}
                    </span>
                  </td>
                  <td className="p-4 text-gray-400 text-xs group-hover:text-black transition-colors">
                    {new Date(item.date).toLocaleDateString("ar-EG")}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" className="p-8 text-center text-gray-400">
                لا توجد حركات مالية حديثة
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentFinancialActivity;
