import SearchBox from "./SearchBox";
import DeleteButton from "./DeleteButton";
import { deletePayment } from "../API/PaymentAPI";
import toast from "react-hot-toast";

const PaymentsTable = ({ payments, setPayments, setSearch }) => {
  return (
    <div className="max-w-7xl mx-auto bg-white rounded-4xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
        <h3 className="font-bold text-gray-800 text-lg">
          آخر العمليات المالية
        </h3>
        <SearchBox
          placeholder="بحث عن دافع، شيك، أو تفاصيل..."
          className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm w-64 outline-none focus:border-blue-500 shadow-sm"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wider">
              <th className="py-5 px-8 text-right">الجهة / البيان</th>
              <th className="py-5 px-8 text-center">التاريخ</th>
              <th className="py-5 px-8 text-center">الطريقة</th>
              <th className="py-5 px-8 text-center">المبلغ</th>
              <th className="py-5 px-8 text-center">العمليات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <PaymentRow
                key={payment._id}
                payment={payment}
                onDelete={async (id) => {
                  try {
                    await deletePayment(id);
                    setPayments((prev) => prev.filter((p) => p._id !== id));
                    toast.success("تم حذف الدفعة بنجاح");
                  } catch (err) {
                    console.error("Delete Error:", err);
                    toast.error("خطأ أثناء حذف الدفعة");
                  }
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentRow = ({ payment, onDelete }) => (
  <tr className="hover:bg-blue-50/30 transition-colors group">
    <td className="py-5 px-8">
      <div className="font-bold text-gray-800">{payment.customer?.name}</div>
      <div className="text-xs text-gray-400 mt-0.5">
        {payment.note || "لا يوجد بيان"}
      </div>
      <div className="text-xs text-blue-500 font-mono mt-0.5">
        {payment.code}
      </div>
    </td>
    <td className="py-5 px-8 text-center text-gray-500 font-mono text-sm">
      {payment.date?.split("T")[0]}
    </td>
    <td className="py-5 px-8 text-center">
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
        {payment.method === "cash"
          ? "💵 نقداً"
          : payment.method === "bank"
            ? "🏦 بنكي"
            : "🎫 شيك"}
      </span>
      {payment.method === "check" && payment.checkDetails && (
        <div className="text-[10px] text-blue-600 mt-1 font-black">
          {payment.checkDetails.checkNumber} | {payment.checkDetails.bankName}
          <br />
          استحقاق: {payment.checkDetails.dueDate?.split("T")[0]}
          {payment.checkDetails.status === "returned" && (
            <span className="text-red-500 block"> (راجع)</span>
          )}
        </div>
      )}
    </td>
    <td className="py-5 px-8 text-center font-black text-blue-900 font-mono text-lg">
      {payment.amount} ₪
    </td>
    <td className="py-5 px-8 text-center">
      <DeleteButton
        handleDelete={() => {
          if (
            window.confirm(
              "هل أنت متأكد من حذف هذه الدفعة؟ سيعاد احتساب رصيد العميل.",
            )
          ) {
            onDelete(payment._id);
          }
        }}
        label="حذف"
      />
    </td>
  </tr>
);

export default PaymentsTable;
