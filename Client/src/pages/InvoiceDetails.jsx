import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById } from "../API/InvoiceAPI";
import BackButton from "../components/BackButton";

const InvoiceDetails = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const invoiceData = await getInvoiceById(id);
        console.log(invoiceData);
        setInvoice(invoiceData);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };
    fetchInvoice();
  }, [id]);

  if (!invoice)
    return (
      <div
        className="flex justify-center items-center h-screen font-sans"
        dir="rtl"
      >
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div>
      </div>
    );

  // حسابات الضريبة (فرضاً 16%)
  const subtotal = invoice.total / 1.16;
  const taxAmount = invoice.total - subtotal;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("ar-PS", {
      style: "currency",
      currency: "ILS",
    }).format(amount);
  };

  return (
    <div>
      <div
        className="bg-gray-50/50 w-full pt-12 pl-20 flex justify-start"
        dir="ltr"
      >
        <BackButton />
      </div>
      <div
        className="max-w-4xl mx-auto my-4 p-4 bg-white shadow-2xl border border-gray-100 font-sans relative"
        dir="rtl"
        id="invoicePage"
      >
        {/* علامة مائية اختيارية (Optional Watermark) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <h1 className="text-[120px] font-black rotate-45 text-gray-400 uppercase">
            الأصلية
          </h1>
        </div>

        {/* HEADER: معلومات الشركة */}
        <div className="flex justify-between items-start border-b-2 border-blue-900 pb-2 relative z-10">
          <div className="text-right">
            <h2 className="text-2xl font-black text-blue-900 mb-1">
              شركة الياسين للتجارة والمقاولات
            </h2>
            <div className="flex gap-2">
              <p className="text-gray-700 text-[10px]">
                السجل التجاري: 123456789
              </p>
              <p className="text-gray-700 text-[10px]">
                الرقم الضريبي: 987654321
              </p>
            </div>
            <p className="text-gray-700 text-[10px]">
              العنوان: فلسطين، نابلس، ديرشرف
            </p>
            <p className="text-gray-700 text-[10px] italic">
              هاتف: 059XXXXXXX | بريد: info@store.ps
            </p>
          </div>
          <div className="text-left bg-blue-900 text-white p-2 rounded-bl-2xl min-w-[150px]">
            <h1 className="text-xl font-bold mb-1">فاتورة ضريبية</h1>
            <p className="text-[10px] opacity-90 font-mono">
              رقم: {invoice.code}
            </p>
            <p className="text-[10px] opacity-90">
              تاريخ: {new Date(invoice.date).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        {/* CUSTOMER & DETAILS: معلومات العميل */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="border-r-2 border-gray-100 pr-4">
            <h4 className="text-blue-900 text-[10px] font-bold mb-1 uppercase tracking-wider underline">
              بيانات العميل:
            </h4>
            <p className="text-lg font-bold text-gray-800 leading-tight">
              {invoice.customer.name}
            </p>
            <p className="text-gray-600 text-[10px] mt-0.5">
              العنوان: {invoice.customer.address || "غير متوفر"}
            </p>
            <p className="text-gray-600 text-[10px]">
              الجوال: {invoice.customer.phone}
            </p>
          </div>
          <div className="flex flex-col justify-center items-end">
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center border border-gray-300 text-[8px] text-gray-500 text-center">
              QR CODE <br /> التحقق الرقمي
            </div>
          </div>
        </div>

        {/* TABLE: قائمة الأصناف */}
        <div className="mt-2 text-[11px]">
          <table className="w-full text-right overflow-hidden rounded-t-lg">
            <thead>
              <tr className="bg-blue-900 text-white">
                <th className="py-1 px-3 border-l border-blue-800">#</th>
                <th className="py-1 px-3 border-l border-blue-800">
                  بيان الصنف
                </th>
                <th className="py-1 px-3 border-l border-blue-800 text-center">
                  الكمية
                </th>
                <th className="py-1 px-3 border-l border-blue-800 text-center">
                  سعر الوحدة
                </th>
                <th className="py-1 px-3 text-center">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 bg-white">
              {invoice.items.map((item, i) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 odd:bg-gray-50"
                >
                  <td className="py-1 px-3 text-center border-l border-gray-100">
                    {i + 1}
                  </td>
                  <td className="py-1 px-3 font-medium text-gray-900 border-l border-gray-100">
                    {item.product.name}
                  </td>
                  <td className="py-1 px-3 text-center border-l border-gray-100 font-mono italic">
                    {item.quantity} {item.product.unit}
                  </td>
                  <td className="py-1 px-3 text-center border-l border-gray-100 font-mono">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-1 px-3 text-center font-bold text-blue-900">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY: ملخص الحسابات */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div className="space-y-2">
            {/* الشروط والأحكام */}
            <div className="text-gray-600 text-[10px] leading-tight border border-dashed border-gray-300 p-2 rounded-lg">
              <p className="font-bold mb-1">الشروط والأحكام:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام.</li>
                <li>يجب إبراز الفاتورة الأصلية عند الاستبدال.</li>
                <li>الأسعار تشمل ضريبة القيمة المضافة القانونية.</li>
              </ul>
            </div>

            {/* تفاصيل الدفع (Payment Details) */}
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
              <h5 className="font-black text-slate-800 text-[11px] mb-1 underline decoration-blue-500 underline-offset-2">
                معلومات السداد:
              </h5>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                <p className="text-slate-500 font-bold">طريقة الدفع:</p>
                <p className="font-black text-blue-900">
                  {invoice.paymentType === "cash"
                    ? "نقداً (Cash)"
                    : invoice.paymentType === "bank"
                      ? "حوالة بنكية"
                      : "شيك"}
                </p>
                {invoice.paymentType === "check" && invoice.checkDetails && (
                  <>
                    <p className="text-slate-500 font-bold">رقم الشيك:</p>
                    <p className="font-mono font-black">
                      {invoice.checkDetails.checkNumber}
                    </p>
                    <p className="text-slate-500 font-bold">البنك:</p>
                    <p className="font-black">
                      {invoice.checkDetails.bankName}
                    </p>
                    <p className="text-slate-500 font-bold">الاستحقاق:</p>
                    <p className="font-mono font-black text-red-600">
                      {new Date(
                        invoice.checkDetails.dueDate,
                      ).toLocaleDateString("ar-EG")}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm">
            <div className="flex justify-between py-1 border-b border-blue-200 text-[11px]">
              <span className="text-slate-600 font-bold">
                المجموع قبل الضريبة:
              </span>
              <span className="font-mono font-black">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-blue-200 text-[11px]">
              <span className="text-slate-600 font-bold">
                ضريبة القيمة المضافة (16%):
              </span>
              <span className="font-mono font-black">
                {formatCurrency(taxAmount)}
              </span>
            </div>
            <div className="flex justify-between py-2 text-xl font-black text-blue-900 border-b-2 border-blue-200">
              <span>الإجمالي النهائي:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>

            {/* تفاصيل المدفوع والمتبقي (Paid & Remaining) */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[11px]">
                <span className="text-green-700 font-bold">
                  المبلغ المدفوع:
                </span>
                <span className="font-mono font-black text-green-700">
                  {formatCurrency(invoice.paidAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-red-700 font-bold">المبلغ المتبقي:</span>
                <span className="font-mono font-black text-red-700">
                  {formatCurrency(
                    Math.max(0, invoice.total - (invoice.paidAmount || 0)),
                  )}
                </span>
              </div>
            </div>

            <div className="mt-2 p-1 bg-blue-900 text-white text-[9px] text-center font-bold rounded uppercase tracking-widest">
              فقط {invoice.remainingAmount} شيكل لا غير
            </div>
          </div>
        </div>

        {/* SIGNATURES: التوقيعات */}
        <div className="mt-6 grid grid-cols-2 gap-10 text-center ">
          <div>
            <div className="border-t border-gray-400 mt-1 pt-1 text-[10px] text-gray-700 font-bold italic">
              ختم الشركة
            </div>
          </div>
          <div className="flex flex-row gap-6 justify-between px-6">
            <div className="border-t border-gray-400 mt-1 pt-1 text-[10px] text-gray-700 font-bold italic">
              توقيع المحاسب
            </div>
            <div className="border-t border-gray-400 mt-1 pt-1 text-[10px] text-gray-700 font-bold italic">
              توقيع المستلم
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="mt-5 flex justify-center gap-6 no-print">
          <button
            onClick={() => window.print()}
            className="bg-gray-800 hover:bg-black text-white font-bold py-3 px-10 rounded-lg shadow-xl flex items-center gap-3 transition duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              ></path>
            </svg>
            طباعة نهائية
          </button>
        </div>
      </div>
      <style>{`
    @media print {
      @page { size: A4; margin: 10mm; }
      body * {
        visibility: hidden;
      }
      #invoicePage, #invoicePage * {
        visibility: visible;
      }
      #invoicePage {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        box-shadow: none !important;
        border: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .no-print {
        display: none !important;
      }
      /* تحسين الألوان للطباعة */
      .bg-blue-900 { background-color: #1e3a8a !important; color: white !important; -webkit-print-color-adjust: exact; }
      .bg-blue-50 { background-color: #eff6ff !important; -webkit-print-color-adjust: exact; }
      .text-blue-900 { color: #1e3a8a !important; }
      .border-blue-900 { border-color: #1e3a8a !important; }
      
      /* منع تقطيع الصفوف وترك بصمة الصفحة */
      tr { page-break-inside: avoid; }
      h2, h1, p { margin: 2px 0 !important; }
    }
  `}</style>
    </div>
  );
};

export default InvoiceDetails;
