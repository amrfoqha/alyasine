import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerStatement } from "../API/CustomerAPI";
import Header from "../components/Header";
import { motion } from "framer-motion";
import {
  DescriptionRounded,
  PaymentsRounded,
  AccountBalanceRounded,
  TrendingDownRounded,
  TrendingUpRounded,
  PersonRounded,
  CalendarMonthRounded,
} from "@mui/icons-material";
import { Typography, Box, Grid, Paper, Divider, Chip } from "@mui/material";
import LoadingOverlay from "../components/LoadingOverlay";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";
import ButtonComponent from "../components/ButtonComponent";

const CustomerStatementPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
  });

  const handleFilter = (e) => {
    e.preventDefault();
    setFilter({ startDate, endDate });
  };

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        setLoading(true);
        const response = await getCustomerStatement(
          id,
          filter.startDate,
          filter.endDate,
        );
        setData(response);
      } catch (error) {
        console.error("Error fetching statement:", error);
        toast.error("حدث خطأ أثناء جلب كشف الحساب");
      } finally {
        setLoading(false);
      }
    };
    fetchStatement();
  }, [id, filter.startDate, filter.endDate]);

  // if (loading) return <LoadingOverlay />;
  if (!data) return <div className="text-center p-10">العميل غير موجود</div>;

  const { customer, invoices, payments } = data;

  const totalInvoicesValue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const totalPayedValue = invoices.reduce(
    (sum, inv) => sum + inv.paidAmount,
    0,
  );
  const totalPaymentsValue = payments.reduce((sum, p) => sum + p.amount, 0);

  // Combine, sort by date and calculate running balance
  const allTransactions = [
    ...invoices.map((inv) => ({
      ...inv,
      type: "invoice",
      sortDate: new Date(inv.date),
    })),
    ...payments.map((p) => ({
      ...p,
      type: "payment",
      sortDate: new Date(p.date),
    })),
  ]
    .sort((a, b) => {
      const dateDiff = a.sortDate - b.sortDate;
      if (dateDiff !== 0) return dateDiff;

      if (a.type !== b.type) {
        return a.type === "invoice" ? -1 : 1;
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    }) // Sort oldest to newest for calculation
    .reduce((acc, tx) => {
      const prevBalance =
        acc.length > 0 ? acc[acc.length - 1].runningBalance : 0;
      // الرصيد الجاري = الرصيد السابق + (الإجمالي - المدفوع في الفاتورة) للفواتير
      // أو الرصيد السابق - مبلغ الدفعة للمدفوعات
      const amount =
        tx.type === "invoice" ? tx.total - (tx.paidAmount || 0) : -tx.amount;
      acc.push({ ...tx, runningBalance: prevBalance + amount });
      return acc;
    }, [])
    .reverse();

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full pb-10 font-sans" dir="rtl">
      {/* CSS for Print Optimization */}
      <style>{`
        @media print {
          @page { size: A4; margin: 15mm; }
          body * { visibility: hidden; }
          #statementPage, #statementPage * { visibility: visible; }
          #statementPage {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
          }
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-header { display: block !important; }
          .print-signature { display: flex !important; }
          .shadow-xl, .shadow-sm, .shadow-md { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
          .bg-white { background: transparent !important; }
          .bg-slate-50, .bg-slate-800 { background-color: #f8fafc !important; color: black !important; }
          table { border-collapse: collapse !important; width: 100% !important; }
          th, td { border: 1px solid #cbd5e1 !important; padding: 10px !important; font-size: 12px !important; }
          .rounded-2xl, .rounded-[2.5rem], .rounded-[2rem], .rounded-xl { border-radius: 0 !important; }
          .text-blue-600, .text-green-600, .text-red-600 { color: black !important; font-weight: bold !important; }
        }
        .print-header { display: none; }
        .print-signature { display: none; }
      `}</style>

      <Header title="كشف حساب عميل" />
      <main
        className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-20 font-sans"
        dir="rtl"
        id="statementPage"
      >
        {/* Screen Header (Hidden on Print) */}
        <div className="flex justify-between items-center mb-8 no-print">
          <div className="flex items-center gap-4">
            <BackButton />
            <div>
              <Typography variant="h4" className="font-black text-slate-800">
                كشف حساب عميل
              </Typography>
              <Typography variant="body2" className="text-slate-500 font-bold">
                عرض تقرير مالي مفصل للعميل {customer.name}
              </Typography>
            </div>
          </div>
          <ButtonComponent
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-700 transition-all flex items-center gap-2"
          >
            <DescriptionRounded fontSize="small" />
            طباعة كشف الحساب
          </ButtonComponent>
        </div>

        {/* Corporate Print Header (Visible only on Print) */}
        <div className="print-header mb-10 border-b-4 border-slate-800 pb-6 text-right">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black text-slate-900 mb-2">
                {" "}
                شركة الياسين للتجارة والمقاولات
              </h1>
              <p className="text-sm text-slate-600 font-bold">
                قسم المحاسبة - كشف حساب تفصيلي
              </p>
            </div>
            <div className="text-left font-mono">
              <p>تاريخ الاستخراج: {new Date().toLocaleDateString("ar-EG")}</p>
              <p>كود العميل: {customer.code}</p>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-8 text-sm">
            <div className="bg-slate-50 p-4 border border-slate-200 text-right">
              <p className="font-black mb-1">بيانات العميل (السيد/ة):</p>
              <p className="font-bold text-lg">{customer.name}</p>
              <p>هاتف: {customer.phone}</p>
              <p>العنوان: {customer.address}</p>
            </div>
            <div className="bg-slate-900 text-white p-4 border border-slate-800 flex flex-col justify-center items-center">
              <p className="text-xs opacity-70 mb-1">الرصيد النهائي المستحق</p>
              <p className="text-3xl font-black">{customer.balance} ₪</p>
            </div>
          </div>
        </div>

        {/* Summary Cards (Screen Version) */}
        <Grid container spacing={4} className="mb-10 no-print">
          <Grid>
            <SummaryCard
              title="الرصيد القائم"
              value={`${customer.balance} ₪`}
              icon={<AccountBalanceRounded sx={{ fontSize: 40 }} />}
              color="bg-red-50 text-red-600"
            />
          </Grid>
          <Grid>
            <SummaryCard
              title="إجمالي الفواتير"
              value={`${totalInvoicesValue} ₪`}
              icon={<TrendingUpRounded sx={{ fontSize: 40 }} />}
              color="bg-blue-50 text-blue-600"
            />
          </Grid>
          <Grid>
            <SummaryCard
              title="إجمالي المدفوعات"
              value={`${totalPaymentsValue} ₪`}
              icon={<TrendingDownRounded sx={{ fontSize: 40 }} />}
              color="bg-green-50 text-green-600"
            />
          </Grid>
        </Grid>

        {/* Date Filter Section */}
        <section className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 no-print">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <CalendarMonthRounded className="text-slate-400" />
              <Typography className="font-black text-slate-701 text-sm">
                تصفية حسب التاريخ:
              </Typography>
            </div>

            <div className="flex items-center gap-4 flex-1 min-w-[300px]">
              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">
                  من تاريخ
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <label className="text-[10px] font-black text-slate-400 mr-2">
                  إلى تاريخ
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all w-full"
                />
              </div>

              <ButtonComponent
                onClick={(e) => {
                  handleFilter(e);
                }}
                className={
                  "mt-5 text-b-500 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-black transition-all"
                }
              >
                فلترة
              </ButtonComponent>
              <ButtonComponent
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                  setFilter({ startDate: "", endDate: "" });
                }}
                className={
                  "mt-5 text-b-500 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-black transition-all"
                }
              >
                مسح الفلتر
              </ButtonComponent>
            </div>
          </div>
        </section>

        {/* Transactions Table */}
        <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-100 border border-slate-100 overflow-hidden print:border-slate-800">
          <div className="p-8 bg-slate-50/50 border-b border-slate-100 no-print">
            <Typography variant="h6" className="font-black text-slate-800">
              سجل الحركات المالية
            </Typography>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead className="bg-slate-50 text-slate-800 text-xs font-black uppercase tracking-widest border-b border-slate-300">
                <tr>
                  <th className="py-6 px-8">التاريخ</th>
                  <th className="py-6 px-8">النوع</th>
                  <th className="py-6 px-8">البيان / التفاصيل</th>
                  <th className="py-6 px-8 text-center text-red-600">
                    مدين (+)
                  </th>
                  <th className="py-6 px-8 text-center text-green-700">
                    دائن (-)
                  </th>
                  <th className="py-6 px-8 text-center text-slate-900 border-x border-slate-200 bg-slate-100/50">
                    الرصيد
                  </th>
                  <th className="py-6 px-8 text-center no-print">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {allTransactions.map((tx, idx) => (
                  <TransactionRow key={idx} tx={tx} />
                ))}
                {allTransactions.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-20 text-center text-slate-400 font-bold font-sans"
                    >
                      لا توجد عمليات مسجلة لهذا العميل حتى الآن
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Print Footer Summary */}
        {/* make it as table */}
        <table className="print-header mt-10 border-2 border-slate-800 text-center uppercase text-sm font-black">
          <thead>
            <tr>
              <th className="p-4 bg-slate-50 border-e-2 border-slate-800">
                إجمالي الفواتير (+)
              </th>
              <th className="p-4 bg-slate-50 border-e-2 border-slate-800">
                القيمة المدفوعة من الفواتير (-)
              </th>
              <th className="p-4 bg-slate-50 border-e-2 border-slate-800">
                إجمالي المدفوعات (-)
              </th>
              <th className="p-4 bg-slate-900 text-white">
                صافي الرصيد النهائي
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                {totalInvoicesValue} ₪
              </td>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                {totalPayedValue} ₪
              </td>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                {totalPaymentsValue} ₪
              </td>
              <td className="p-4 bg-slate-900 text-white">
                {customer.balance} ₪
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature Section for Print */}
        <div className="print-signature mt-20 flex flex-row justify-between gap-10 px-10 text-sm font-bold">
          <div className="text-center flex flex-col items-center">
            <div className="border-b border-slate-400 w-48 mb-2"></div>
            <p>توقيع المحاسب المسئول</p>
          </div>
          <div className="text-center flex flex-col items-center">
            <div className="border-b border-slate-400 w-48 mb-2"></div>
            <p>توقيع وختم العميل</p>
          </div>
        </div>

        <div className="print-header mt-20 text-center text-[10px] text-slate-400 italic font-sans">
          صدر هذا التقرير آلياً بواسطة نظام "الياسين" المالي.
        </div>
      </main>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-4xl border border-slate-100 flex items-center justify-between shadow-sm gap-6"
  >
    <div className="flex flex-col items-start justify-between gap-2">
      <Typography
        variant="body2"
        className="text-slate-400 font-black mb-1 uppercase tracking-widest text-[10px]"
      >
        {title}
      </Typography>
      <Typography variant="h5" className="font-black text-slate-800">
        {value}
      </Typography>
    </div>
    <div className={`p-4 rounded-2xl ${color}`}>{icon}</div>
  </motion.div>
);

const TransactionRow = ({ tx }) => {
  const isInvoice = tx.type === "invoice";
  const date = (tx.date || tx.createdAt).split("T")[0];
  const navigate = useNavigate();

  return (
    <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
      <td className="py-6 px-8 font-mono text-sm text-slate-600">{date}</td>
      <td className="py-6 px-8 font-bold">
        {isInvoice ? (
          <span className="text-blue-700 flex items-center gap-2">
            <DescriptionRounded fontSize="small" />
            فاتورة
          </span>
        ) : (
          <span className="text-green-700 flex items-center gap-2">
            <PaymentsRounded fontSize="small" />
            دفعة
          </span>
        )}
      </td>
      <td className="py-6 px-8 text-sm text-slate-600 font-bold">
        <span className="flex items-center gap-2">
          {isInvoice ? "فاتورة" : "دفعة"}
          {` رقم ${tx.code}`}
        </span>
        {!isInvoice && tx.note}
        {tx.method === "check" && tx.checkDetails && (
          <div className="text-[11px] text-blue-600 mt-1 font-black">
            شيك: {tx.checkDetails.checkNumber} | بنك: {tx.checkDetails.bankName}{" "}
            | استحقاق: {tx.checkDetails.dueDate?.split("T")[0]}
          </div>
        )}
        {!isInvoice && tx.method === "bank" && (
          <div className="text-[11px] text-indigo-600 mt-1 font-black">
            تحويل بنكي
          </div>
        )}
      </td>
      <td
        className={`py-6 px-8 text-center font-black text-lg ${isInvoice ? "text-red-700 bg-red-50/20" : "text-slate-300"}`}
      >
        {isInvoice ? `${tx.total} ₪` : "-"}
      </td>
      <td
        className={`py-6 px-8 text-center font-black text-lg ${!isInvoice ? "text-green-800 bg-green-50/20" : "text-slate-400"}`}
      >
        {!isInvoice ? `${tx.amount} ₪` : `${tx.paidAmount} ₪`}
        {isInvoice && (
          <div className="mt-1">
            <Chip
              label={
                tx.status === "paid"
                  ? "مدفوعة"
                  : tx.status === "partial"
                    ? "جزئي"
                    : "غير مدفوع"
              }
              color={
                tx.status === "paid"
                  ? "success"
                  : tx.status === "partial"
                    ? "warning"
                    : "error"
              }
              variant="outlined"
              size="small"
              className="font-black text-[9px] h-5"
            />
          </div>
        )}
      </td>
      <td className="py-6 px-8 text-center font-black text-lg bg-slate-50/50 border-x border-slate-100">
        {tx.runningBalance} ₪
      </td>
      <td className="py-6 px-8 text-center no-print">
        <ButtonComponent
          onClick={() => (isInvoice ? navigate(`/invoice/${tx._id}`) : null)}
          className={`px-4! py-2! rounded-xl! text-[11px]! min-w-fit! shadow-none! border gap-1.5! ${
            isInvoice
              ? "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              : "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100"
          }`}
          label={isInvoice ? "عرض الفاتورة" : "عرض الإيصال"}
          icon={
            isInvoice ? (
              <DescriptionRounded sx={{ fontSize: 14 }} />
            ) : (
              <PaymentsRounded sx={{ fontSize: 14 }} />
            )
          }
        />
      </td>
    </tr>
  );
};

export default CustomerStatementPage;
