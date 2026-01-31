import React from "react";
import { Chip, Typography } from "@mui/material";
import ButtonComponent from "./ButtonComponent";
import { Money } from "@mui/icons-material";
import { Edit2 } from "lucide-react";

const ChecksTable = ({
  checks = [],
  fullWidth = false,
  setOpen = () => {},
  setSelectedCheck = () => {},
}) => {
  const checkdueTime = (item) => {
    return (
      new Date(item.checkDetails.dueDate).getTime() <= new Date().getTime()
    );
  };
  const checkStatus = (item) => {
    if (item.checkDetails.status === "pending") {
      return "قيد الانتظار";
    } else if (item.checkDetails.status === "cleared") {
      return "مدفوع";
    } else if (item.checkDetails.status === "returned") {
      return "مرتجع";
    } else {
      return "غير معروف";
    }
  };
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
            {fullWidth && (
              <th className="p-4 font-semibold text-gray-500 text-sm">
                حالة الشيك
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {checks.length > 0 ? (
            checks.map((item) => (
              <tr
                key={item._id}
                className={`${checkdueTime(item) ? "bg-green-100" : ""} hover:bg-gray-50 transition-colors group`}
              >
                <td className="p-4">
                  <div className="font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded-2xl text-sm group-hover:text-black transition-colors w-fit">
                    {item.checkDetails.checkNumber || "غير معروف"}
                  </div>
                  <Typography variant="caption" color="textSecondary">
                    بنك: {item.checkDetails.bankName || "غير معروف"}
                  </Typography>
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
                  {item.checkDetails.dueDate
                    ? item.checkDetails.dueDate.split("T")[0]
                    : item.checkDetails.dueDate}
                </td>

                {fullWidth &&
                  (checkdueTime(item) ? (
                    <td className="p-4 text-gray-400 text-sm group-hover:text-black transition-colors">
                      {item.checkDetails.status === "returned" ? (
                        <span>{checkStatus(item)}</span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedCheck(item);
                            setOpen(true);
                          }}
                          className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-200 text-sm font-semibold shadow-sm"
                        >
                          <Edit2 size={16} />
                          تعديل
                        </button>
                      )}
                    </td>
                  ) : (
                    <td className="p-4 text-red-600 text-sm group-hover:text-black transition-colors">
                      <span>{checkStatus(item)}</span>
                    </td>
                  ))}
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
