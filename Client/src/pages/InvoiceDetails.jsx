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
        className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-2xl border border-gray-100 font-sans relative"
        dir="rtl"
        id="invoicePage"
      >
        {/* علامة مائية اختيارية (Optional Watermark) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none">
          <h1 className="text-[200px] font-black rotate-45 text-gray-400 uppercase">
            الأصلية
          </h1>
        </div>

        {/* HEADER: معلومات الشركة */}
        <div className="flex justify-between items-start border-b-4 border-blue-900 pb-4 relative z-10">
          <div className="text-right">
            <h2 className="text-4xl font-black text-blue-900 mb-2">
              شايش الياسين
            </h2>
            <div className="flex gap-2">
              <p className="text-gray-700 text-sm">السجل التجاري: 123456789</p>
              <p className="text-gray-700 text-sm">الرقم الضريبي: 987654321</p>
            </div>
            <p className="text-gray-700 text-sm">
              العنوان: فلسطين، نابلس، ديرشرف
            </p>
            <p className="text-gray-700 text-sm italic">
              هاتف: 059XXXXXXX | بريد: info@store.ps
            </p>
          </div>
          <div className="text-left bg-blue-900 text-white p-4 rounded-bl-3xl min-w-[200px]">
            <h1 className="text-3xl font-bold mb-2">فاتورة ضريبية</h1>
            <p className="text-sm opacity-90 font-mono">رقم: {invoice.code}</p>
            <p className="text-sm opacity-90">
              تاريخ: {new Date(invoice.date).toLocaleDateString("ar-EG")}
            </p>
          </div>
        </div>

        {/* CUSTOMER & DETAILS: معلومات العميل */}
        <div className="grid grid-cols-2 gap-10 mt-4">
          <div className="border-r-2 border-gray-100 pr-4">
            <h4 className="text-blue-900 font-bold mb-3 uppercase tracking-wider underline">
              بيانات العميل:
            </h4>
            <p className="text-xl font-bold text-gray-800">
              {invoice.customer.name}
            </p>
            <p className="text-gray-600 mt-1">
              العنوان: {invoice.customer.address || "غير متوفر"}
            </p>
            <p className="text-gray-600">الجوال: {invoice.customer.phone}</p>
          </div>
          <div className="flex flex-col justify-center items-end">
            {/* QR Code Placeholder - يمكن ربطه بمكتبة QRCode */}
            <div className="w-24 h-24 bg-gray-200 flex items-center justify-center border border-gray-300 text-[10px] text-gray-500 text-center">
              QR CODE <br /> التحقق الرقمي
            </div>
          </div>
        </div>

        {/* TABLE: قائمة الأصناف */}
        <div className="mt-4">
          <table className="w-full text-right overflow-hidden rounded-t-xl">
            <thead>
              <tr className="bg-blue-900 text-white text-sm">
                <th className="py-2 px-4 border-l border-blue-800">#</th>
                <th className="py-2 px-4 border-l border-blue-800">
                  بيان الصنف
                </th>
                <th className="py-2 px-4 border-l border-blue-800 text-center">
                  الكمية
                </th>
                <th className="py-2 px-4 border-l border-blue-800 text-center">
                  سعر الوحدة
                </th>
                <th className="py-2 px-4 text-center">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 bg-white">
              {invoice.items.map((item, i) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-100 odd:bg-gray-50"
                >
                  <td className="py-2 px-4 text-center border-l border-gray-100">
                    {i + 1}
                  </td>
                  <td className="py-2 px-4 font-medium text-gray-900 border-l border-gray-100">
                    {item.product.name}
                  </td>
                  <td className="py-2 px-4 text-center border-l border-gray-100 font-mono italic">
                    {item.quantity} {item.product.unit}
                  </td>
                  <td className="py-2 px-4 text-center border-l border-gray-100 font-mono">
                    {formatCurrency(item.price)}
                  </td>
                  <td className="py-2 px-4 text-center font-bold text-blue-900">
                    {formatCurrency(item.quantity * item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SUMMARY: ملخص الحسابات */}
        <div className="mt-10 grid grid-cols-2 gap-8">
          <div className="text-gray-600 text-sm leading-relaxed border border-dashed border-gray-300 p-4 rounded-lg">
            <p className="font-bold mb-2">الشروط والأحكام:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>البضاعة المباعة لا ترد ولا تستبدل بعد 3 أيام.</li>
              <li>يجب إبراز الفاتورة الأصلية عند الاستبدال.</li>
              <li>الأسعار تشمل ضريبة القيمة المضافة القانونية.</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span>المجموع قبل الضريبة:</span>
              <span className="font-mono">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-blue-200">
              <span>ضريبة القيمة المضافة (16%):</span>
              <span className="font-mono">{formatCurrency(taxAmount)}</span>
            </div>
            <div className="flex justify-between py-4 text-2xl font-black text-blue-900">
              <span>الإجمالي النهائي:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            <div className="mt-4 p-2 bg-white text-xs border border-blue-200 text-center font-bold text-gray-500 rounded">
              فقط {invoice.total} شيكل لا غير
            </div>
          </div>
        </div>

        {/* SIGNATURES: التوقيعات */}
        <div className="mt-10 grid grid-cols-2 gap-20 text-center ">
          <div>
            <div className="border-t border-gray-400 mt-2 pt-2 text-xs text-gray-700 font-bold italic">
              ختم الشركة
            </div>
          </div>
          <div className="flex flex-row gap-10 justify-between px-10">
            <div className="border-t border-gray-400 mt-2 pt-2 text-xs text-gray-700 font-bold italic">
              توقيع المحاسب
            </div>
            <div className="border-t border-gray-400 mt-2 pt-2 text-xs text-gray-700 font-bold italic">
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
      /* إخفاء كل شيء في الصفحة */
      body * {
        visibility: hidden;
      }
      /* إظهار الفاتورة فقط وكل ما بداخلها */
      #invoicePage, #invoicePage * {
        visibility: visible;
      }
      /* تحديد مكان الفاتورة في الصفحة المطبوعة */
      #invoicePage {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      /* إخفاء الأزرار يدوياً للتأكيد */
      .no-print {
        display: none !important;
      }
    }
  `}</style>
    </div>
  );
};

export default InvoiceDetails;
