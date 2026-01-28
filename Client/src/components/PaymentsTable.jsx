import React from "react";
import SearchBox from "./SearchBox";

const PaymentsTable = ({ payments, setSearch }) => {
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
              <th className="py-5 px-8">الجهة / البيان</th>
              <th className="py-5 px-8 text-center">التاريخ</th>
              <th className="py-5 px-8 text-center">الطريقة</th>
              <th className="py-5 px-8 text-center">المبلغ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {payments.map((payment) => (
              <PaymentRow
                key={payment._id}
                name={payment.customer?.name}
                desc={payment.note}
                date={payment.date.split("T")[0]}
                type={payment.method}
                amount={payment.amount}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const PaymentRow = ({ name, desc, date, type, amount }) => (
  <tr className="hover:bg-blue-50/30 transition-colors group">
    <td className="py-5 px-8">
      <div className="font-bold text-gray-800">{name}</div>
      <div className="text-xs text-gray-400 mt-0.5">{desc || "لا يوجد"}</div>
    </td>
    <td className="py-5 px-8 text-center text-gray-500 font-mono text-sm">
      {date}
    </td>
    <td className="py-5 px-8 text-center">
      <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">
        {type}
      </span>
    </td>
    <td className="py-5 px-8 text-center font-black text-blue-900 font-mono">
      {amount} ₪
    </td>
  </tr>
);

export default PaymentsTable;
