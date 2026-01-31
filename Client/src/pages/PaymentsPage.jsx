import React, { useEffect, useState } from "react";
import AddPaymentDialog from "../components/AddPaymentDialog";
import Header from "../components/Header";
import { getPayments } from "../API/PaymentAPI";
import PaymentsTable from "../components/PaymentsTable";
import UsePagination from "../context/UsePagination";

const PaymentsPage = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [totalPayments, setTotalPayments] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [countPendingCheck, setCountPendingCheck] = useState(0);
  const [totalCheckPendingAmount, setTotalCheckPendingAmount] = useState(0);
  const [open, setOpen] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      const res = await getPayments(page, limit, search);
      setPayments(res.payments);
      setPage(res.pagination.page);
      setTotalPages(res.pagination.totalPages);
      setTotalPayments(res.pagination.totalPayments);
      setTotalAmount(res.pagination.totalAmount);
      setCountPendingCheck(res.pagination.countPendingCheck);
      setTotalCheckPendingAmount(res.pagination.totalCheckPendingAmount);
    };
    fetchPayments();
  }, [page, limit, search]);
  return (
    <div className="flex flex-col min-h-[80vh] w-full bg-gray-50" dir="rtl">
      <Header title="سجل المدفوعات العام" />
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 " dir="rtl">
        {/* Header */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">
              سجل المدفوعات العام
            </h1>
            <p className="text-gray-500 mt-1 font-medium">
              إدارة ومراقبة التدفقات المالية الواردة والصادرة
            </p>
          </div>
          <div className="flex gap-2">
            <button
              className="bg-white border-2 border-gray-200 p-2 rounded-xl hover:bg-gray-50 transition"
              title="تحميل كشف PDF"
            >
              📄
            </button>
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-blue-200 transition-all flex items-center gap-2"
            >
              <span className="text-xl">+</span> إضافة دفعة جديدة
            </button>
          </div>
        </div>
        {/* Stats Section - البطاقات الذكية */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard
            title="إجمالي المحصل"
            amount={totalAmount}
            color="bg-green-600"
            icon="💰"
            trend="+12% هذا الشهر"
          />
          <StatCard
            title="دفعات قيد الانتظار"
            amount={totalCheckPendingAmount}
            color="bg-amber-500"
            icon="⏳"
            trend={countPendingCheck}
          />
          <StatCard
            title="متوسط الدفعة"
            amount={(totalAmount / totalPayments).toFixed(2)}
            color="bg-blue-600"
            icon="📊"
            trend="معدل مستقر"
          />
          <StatCard
            title="إجمالي المطالبات"
            amount="20,000"
            color="bg-gray-900"
            icon="📈"
            trend="نسبة التحصيل 62%"
          />
        </div>
        {/* Table Section */}
        <PaymentsTable
          payments={payments}
          setPayments={setPayments}
          setSearch={setSearch}
        />
        <AddPaymentDialog
          open={open}
          handleClose={() => setOpen(false)}
          setPayments={setPayments}
        />
        <div className="py-8 flex justify-center border-t border-gray-50">
          <div className="bg-gray-50 px-8 py-2 rounded-2xl border border-gray-100">
            <UsePagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// مكونات فرعية صغيرة (Sub-components) لترتيب الكود
const StatCard = ({ title, amount, color, icon, trend }) => (
  <div
    className={`${color} p-6 rounded-4xl text-white shadow-lg relative overflow-hidden group`}
  >
    <div className="relative z-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-[10px] bg-white/20 py-1 px-2 rounded-full backdrop-blur-md">
          {trend}
        </span>
      </div>
      <p className="text-sm opacity-80 font-medium">{title}</p>
      <h2 className="text-3xl font-black mt-1">
        {amount} <span className="text-sm font-normal">₪</span>
      </h2>
    </div>
    <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

export default PaymentsPage;
