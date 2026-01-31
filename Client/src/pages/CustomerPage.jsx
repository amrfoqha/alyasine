import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import {
  People,
  Add,
  PersonAddAlt1Rounded,
  GroupWorkRounded,
} from "@mui/icons-material";
import { Box, Typography, Stack } from "@mui/material";
import { motion } from "framer-motion";
import ButtonComponent from "../components/ButtonComponent";
import SearchBox from "../components/SearchBox";
import CustomerTable from "../components/CustomerTable";
import UsePagination from "../context/UsePagination";
import AddCustomerDialog from "../components/AddCustomerDialog";
import { getCustomers } from "../API/CustomerAPI";

const CustomerPage = () => {
  const [Page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 5;
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customersCount, setCustomersCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomers(Page, limit, search);
        setCustomers(response.customers);
        setTotalPages(response.pagination.totalPages);
        setCustomersCount(response.pagination.customersCount);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };
    fetchCustomers();
  }, [Page, limit, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
    setPage(1);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full font-sans pb-10" dir="rtl">
      <Header title="إدارة الزبائن" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        {/* قسم الملخص والإجراءات السريعة */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* بطاقة إجمالي العملاء */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative group"
          >
            <div className="z-10">
              <Typography
                variant="h5"
                className="text-gray-400 font-black tracking-widest"
              >
                إحصائيات القاعدة
              </Typography>
              <Typography
                variant="h2"
                className="font-black text-gray-800 my-1"
              >
                {customersCount}
              </Typography>
              <Typography variant="body2" className="text-gray-500 font-bold">
                عميل مسجل في النظام حالياً
              </Typography>
            </div>
            <div className="bg-blue-50 p-6 rounded-full text-blue-600 z-10 group-hover:scale-110 group-hover:rotate-y-360 transition-transform duration-900">
              <People sx={{ fontSize: 60 }} />
            </div>
            {/* زخرفة خلفية */}
            <div className="absolute -right-10 -bottom-10 text-gray-50 opacity-10">
              <GroupWorkRounded sx={{ fontSize: 200 }} />
            </div>
          </motion.div>

          {/* بطاقة إضافة عميل جديد */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col justify-center items-center text-center group">
            <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-360 transition-transform duration-500 ease-in-out">
              <PersonAddAlt1Rounded
                className="text-white"
                sx={{ fontSize: 40 }}
              />
            </div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              هل لديك عميل جديد؟
            </Typography>
            <ButtonComponent
              onClick={() => setOpen(true)}
              label="إضافة عميل"
              icon={<Add />}
              className="bg-white text-blue-700 hover:bg-blue-50 w-full rounded-2xl py-4 shadow-none active:scale-95"
            />
          </div>
        </section>

        {/* منطقة البحث والفلترة */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full">
              <SearchBox
                onChange={handleSearch}
                placeholder="ابحث عن عميل بالاسم، رقم الهاتف، أو العنوان..."
              />
            </div>
          </div>

          {/* جدول العملاء بتغليف متجاوب */}
          <div className="p-2 md:p-6 overflow-x-auto min-h-[400px]">
            <CustomerTable customers={customers} setCustomers={setCustomers} />
          </div>

          {/* الترقيم */}
          <div className="py-8 flex justify-center border-t border-gray-50">
            <div className="bg-gray-50 px-8 py-2 rounded-2xl border border-gray-100">
              <UsePagination
                Page={Page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </motion.section>
      </main>

      <AddCustomerDialog
        open={open}
        setOpen={setOpen}
        setCustomers={setCustomers}
      />
    </div>
  );
};

export default CustomerPage;
