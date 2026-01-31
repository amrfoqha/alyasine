import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerStatement } from "../API/CustomerAPI";
import Header from "../components/Header";
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
import { motion } from "framer-motion";

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
        console.log(response);
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

  if (loading) return <LoadingOverlay />;
  if (!data) return <div className="text-center p-10">العميل غير موجود</div>;

  const { customer, ledgerEntries } = data;

  // Ledger entries are already sorted by date from backend (oldest first)
  // We reverse them for display (newest first)
  const allTransactions = [...ledgerEntries].reverse();

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
              title="إجمالي الديوان (الفواتير)"
              value={`${customer.orders} طلبية`}
              icon={<TrendingUpRounded sx={{ fontSize: 40 }} />}
              color="bg-blue-50 text-blue-600"
            />
          </Grid>
          <Grid>
            <SummaryCard
              title="معدل الائتمان"
              value={`نشط`}
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
                الرصيد الافتتاحي
              </th>
              <th className="p-4 bg-slate-50 border-e-2 border-slate-800">
                إجمالي حركة المدين (+)
              </th>
              <th className="p-4 bg-slate-50 border-e-2 border-slate-800">
                إجمالي حركة الدائن (-)
              </th>
              <th className="p-4 bg-slate-900 text-white">
                الرصيد النهائي الحالي
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                0 ₪
              </td>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                {ledgerEntries.reduce((sum, e) => sum + e.debit, 0)} ₪
              </td>
              <td className="p-4 bg-slate-50 border-e-2 border-slate-800">
                {ledgerEntries.reduce((sum, e) => sum + e.credit, 0)} ₪
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
  const date = (tx.date || tx.createdAt).split("T")[0];
  const navigate = useNavigate();

  const getTypeStyle = () => {
    switch (tx.type) {
      case "invoice":
        return {
          color: "text-blue-700",
          label: "فاتورة",
          icon: <DescriptionRounded fontSize="small" />,
        };
      case "payment":
        return {
          color: "text-green-700",
          label: "دفعة",
          icon: <PaymentsRounded fontSize="small" />,
        };
      case "check_return":
        return {
          color: "text-red-700",
          label: "شيك راجع",
          icon: <TrendingUpRounded fontSize="small" />,
        };
      case "invoice_deleted":
        return {
          color: "text-orange-700",
          label: "حذف فاتورة",
          icon: <TrendingDownRounded fontSize="small" />,
        };
      case "payment_deleted":
        return {
          color: "text-orange-700",
          label: "حذف دفعة",
          icon: <TrendingUpRounded fontSize="small" />,
        };
      default:
        return {
          color: "text-slate-700",
          label: tx.type,
          icon: <DescriptionRounded fontSize="small" />,
        };
    }
  };

  const style = getTypeStyle();

  const renderDescription = () => {
    if (tx.description) return tx.description;

    if (tx.type === "invoice") {
      return (
        <div className="flex flex-col">
          <span>فاتورة مبيعات</span>
          {tx.details?.code && (
            <span className="text-[10px] text-blue-500">
              #{tx.details.code}
            </span>
          )}
        </div>
      );
    }

    if (tx.type === "payment") {
      const method =
        tx.details?.method === "check"
          ? "شيك"
          : tx.details?.method === "bank"
            ? "تحويل بنكي"
            : "نقدي";
      return (
        <div className="flex flex-col">
          <span>دفعة {method}</span>
          {tx.details?.method === "check" && tx.details?.checkDetails && (
            <span className="text-[10px] text-green-600 font-mono">
              رقم: {tx.details.checkDetails.checkNumber} |{" "}
              {tx.details.checkDetails.bankName}
            </span>
          )}
        </div>
      );
    }

    return `${style.label} رقم ${tx.refId?.slice(-6)}`;
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
      <td className="py-6 px-8 font-mono text-sm text-slate-600">{date}</td>
      <td className="py-6 px-8 font-bold">
        <span className={`${style.color} flex items-center gap-2`}>
          {style.icon}
          {style.label}
        </span>
      </td>
      <td className="py-6 px-8 text-sm text-slate-600 font-bold">
        {renderDescription()}
      </td>
      <td
        className={`py-6 px-8 text-center font-black text-lg ${tx.debit > 0 ? "text-red-700 bg-red-50/20" : "text-slate-300"}`}
      >
        {tx.debit > 0 ? `${tx.debit} ₪` : "-"}
      </td>
      <td
        className={`py-6 px-8 text-center font-black text-lg ${tx.credit > 0 ? "text-green-800 bg-green-50/20" : "text-slate-400"}`}
      >
        {tx.credit > 0 ? `${tx.credit} ₪` : "-"}
      </td>
      <td className="py-6 px-8 text-center font-black text-lg bg-slate-50/50 border-x border-slate-100">
        {tx.balanceAfter} ₪
      </td>
      <td className="py-6 px-8 text-center no-print">
        {tx.type === "invoice" && (
          <ButtonComponent
            onClick={() => navigate(`/invoice/${tx.refId}`)}
            className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 px-4! py-2! rounded-xl! text-[11px]! min-w-fit! shadow-none! border gap-1.5!"
            label="عرض الفاتورة"
            icon={<DescriptionRounded sx={{ fontSize: 14 }} />}
          />
        )}
      </td>
    </tr>
  );
};

export default CustomerStatementPage;
