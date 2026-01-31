import React from "react";
import ButtonComponent from "./ButtonComponent";
import { deleteInvoice } from "../API/InvoiceAPI";
import DeleteButton from "./DeleteButton";
import { BookIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const InvoiceTable = ({ invoices, setInvoices }) => {
  const navigate = useNavigate();
  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف الفاتورة؟")) return;
    try {
      await deleteInvoice(id);
      setInvoices(invoices.filter((i) => i._id !== id));
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الحذف");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto  w-full overflow-x-auto rounded-xl bg-white shadow-lg border border-gray-100  h-120"
    >
      <table className="w-full text-center" dir="rtl">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="p-4 text-gray-600 font-bold">إسم الزبون</th>
            <th className="p-4 text-gray-600 font-bold">رقم الفاتورة</th>
            <th className="p-4 text-gray-600 font-bold">تاريخ الفاتورة</th>
            <th className="p-4 text-gray-600 font-bold">إجمالي</th>
            <th className="p-4 text-gray-600 font-bold">الدفع</th>
            <th className="p-4 text-gray-600 font-bold">الباقي</th>
            <th className="p-4 text-gray-600 font-bold">العمليات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {invoices.map((inv) => (
            <tr
              key={inv._id}
              className="hover:bg-blue-50/30 transition-colors duration-200"
            >
              <td className="p-4 flex flex-col gap-2">
                <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-sm">
                  {inv.customer?.name}
                </span>
                <div className="text-xs text-gray-500 italic">
                  {inv.customer?.phone}
                </div>
              </td>
              <td className="p-4">{inv.code}</td>
              <td className="p-4">{inv.createdAt.split("T")[0]}</td>
              <td className="p-4">
                <span className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm">
                  ${inv.total}
                </span>
              </td>
              <td className="p-4">
                <span className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
                  ${inv.paidAmount || 0}
                </span>
              </td>
              <td className="p-4">
                <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
                  ${inv.remainingAmount}
                </span>
              </td>
              <td className="p-4 ">
                <div className="flex items-center justify-center gap-4 px-3 py-1 h-full">
                  <DeleteButton
                    label="حذف"
                    className="bg-red-500 "
                    handleDelete={() => handleDelete(inv._id)}
                  />
                  <ButtonComponent
                    label="عرض الفاتورة"
                    type="button"
                    icon={<BookIcon className="w-5 h-5" />}
                    className="flex items-center gap-1"
                    onClick={() => navigate(`/invoice/${inv._id}`)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
};

export default InvoiceTable;
