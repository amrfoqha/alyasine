import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import {
  ReceiptLongRounded,
  AddCircleOutlineRounded,
  PostAddRounded,
  AnalyticsRounded,
} from "@mui/icons-material";
import { Typography, Box } from "@mui/material";
import ButtonComponent from "../components/ButtonComponent";
import AddInvoiceDialog from "../components/AddInvoiceDialog";
import InvoiceTable from "../components/InvoiceTable";
import UsePagination from "../context/UsePagination";
import { getInvoices } from "../API/InvoiceAPI";
import SearchBox from "../components/SearchBox";
import { getAllCustomers } from "../API/CustomerAPI";

const InvoicePage = () => {
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoicesCount, setInvoicesCount] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState("");
  const limit = 5;

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getInvoices(page, limit, search);
        setInvoices(response.invoices);
        setInvoicesCount(response.totalInvoices);
        setTotalPages(response.pagination.totalPages);

        const customersData = await getAllCustomers();
        setCustomers(customersData);
      } catch (error) {
        console.error("Error fetching invoices:", error);
      }
    };
    fetchInvoices();
  }, [page, limit, search]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
      {/* قسم الملخصات والإجراءات */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* بطاقة إجمالي الفواتير */}
        <motion.div
          whileHover={{ y: -5 }}
          className="md:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between relative overflow-hidden group"
        >
          <div className="z-10">
            <Typography
              variant="h4"
              className="text-gray-400 font-black tracking-widest uppercase"
            >
              ملخص المبيعات
            </Typography>
            <Typography variant="h3" className="font-black text-gray-800 my-1">
              {invoicesCount}
            </Typography>
            <Typography variant="body2" className="text-gray-500 font-bold">
              فاتورة صادرة في السجل المالي
            </Typography>
          </div>
          <div className="bg-indigo-50 p-6 rounded-[2rem] text-indigo-600 z-10 shadow-inner group-hover:scale-110 group-hover:rotate-y-360 transition-transform duration-900 ease-in-out">
            <ReceiptLongRounded sx={{ fontSize: 60 }} />
          </div>
          {/* أيقونة خلفية زخرفية */}
          <AnalyticsRounded
            className="absolute -right-8 -bottom-8 text-gray-50 opacity-20"
            sx={{ fontSize: 200 }}
          />
        </motion.div>

        {/* بطاقة الإجراء السريع */}
        <div className="bg-linear-to-br from-slate-800 to-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200 flex flex-col justify-center items-center text-center group">
          <div className="bg-white/10 p-4 rounded-2xl mb-4 group-hover:rotate-360 transition-transform duration-700 ease-in-out">
            <PostAddRounded className="text-white" sx={{ fontSize: 40 }} />
          </div>
          <Typography variant="h6" className="text-white font-bold mb-4">
            إنشاء فاتورة بيع
          </Typography>
          <ButtonComponent
            onClick={() => setOpen(true)}
            label="إصدار فاتورة جديدة"
            icon={<AddCircleOutlineRounded />}
            className="bg-white text-slate-900 hover:bg-blue-50 w-full rounded-2xl py-4 shadow-none font-black"
          />
        </div>
      </section>

      {/* قسم الجدول والبحث */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
      >
        {/* شريط البحث المطور */}
        <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          <div className="w-full">
            <SearchBox
              onChange={handleSearch}
              placeholder="ابحث برقم الفاتورة، الزبون، أو رقم الشيك..."
            />
          </div>
        </div>

        {/* الجدول المتجاوب */}
        <div className="p-2 md:p-6 overflow-x-auto min-h-[400px]">
          <InvoiceTable invoices={invoices} setInvoices={setInvoices} />
        </div>

        {/* الترقيم الاحترافي */}
        <div className="py-8 flex justify-center border-t border-gray-50">
          <div className="bg-gray-50 px-8 py-2 rounded-2xl border border-gray-100">
            <UsePagination
              page={page}
              setPage={setPage}
              totalPages={totalPages}
            />
          </div>
        </div>
      </motion.section>
      <AddInvoiceDialog
        open={open}
        setOpen={setOpen}
        setInvoices={setInvoices}
        customers={customers}
        setInvoicesCount={setInvoicesCount}
      />
    </main>
  );
};

export default InvoicePage;
