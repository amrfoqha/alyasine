import React, { useState, useEffect, useCallback } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import {
  People,
  GroupWorkRounded,
  PersonAddAlt1Rounded,
  Add,
  Money,
} from "@mui/icons-material";
import ButtonComponent from "../components/ButtonComponent";
import SearchBox from "../components/SearchBox";
import ChecksTable from "../components/ChecksTable";
import UsePagination from "../context/UsePagination";
import SelectComponent from "../components/SelectComponent";
import { getChecks } from "../API/ChecksAPI";
import EditCheckDialog from "../components/EditCheckDialog";
import { useNavigate } from "react-router-dom";

const ChecksPage = () => {
  const [checksCount, setChecksCount] = useState(0);
  const [checks, setChecks] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [checkStatus, setCheckStatus] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [limit] = useState(4);
  const [selectedCheck, setSelectedCheck] = useState(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const fetchChecks = useCallback(async () => {
    try {
      const response = await getChecks(
        page,
        limit,
        searchQuery,
        checkStatus?._id,
      );
      setChecks(response.AllChecks);
      setChecksCount(response.totalCount);
      setTotalPages(response.totalPages);
      setTotalAmount(response.totalAmount);
      setDueAmount(response.dueAmount);
      setDueCount(response.dueCount);
    } catch (error) {
      console.error("Error fetching checks:", error);
    }
  }, [page, limit, searchQuery, checkStatus]);

  useEffect(() => {
    fetchChecks();
  }, [fetchChecks]);

  return (
    <div className="bg-[#f8fafc] min-h-screen w-full font-sans pb-10" dir="rtl">
      <Header title="إدارة الشيكات" />
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* بطاقة إجمالي الشيكات */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between overflow-hidden relative group"
          >
            <div className="z-10">
              <Typography
                variant="h5"
                className="text-gray-400 font-black tracking-widest"
              >
                إحصائيات الشيكات
              </Typography>
              <Typography
                variant="h2"
                className="font-black text-gray-800 my-1"
              >
                {checksCount || 0}
              </Typography>
              <Typography variant="body2" className="text-gray-500 font-bold">
                إجمالي الشيكات: {totalAmount.toLocaleString()} ₪
              </Typography>
              <div className="mt-2 space-y-1">
                <Typography variant="body2" className="text-red-500 font-bold">
                  شيكات مستحقة: {dueCount || 0}
                </Typography>
                <Typography variant="body2" className="text-red-600 font-black">
                  بقيمة: {dueAmount.toLocaleString()} ₪
                </Typography>
              </div>
            </div>
            <div className="bg-blue-50 p-6 rounded-full text-blue-600 z-10 group-hover:scale-110 group-hover:rotate-y-360 transition-transform duration-900">
              <Money sx={{ fontSize: 60 }} />
            </div>
            {/* زخرفة خلفية */}
            <div className="absolute -right-10 -bottom-10 text-gray-50 opacity-10">
              <GroupWorkRounded sx={{ fontSize: 200 }} />
            </div>
          </motion.div>

          {/* بطاقة الإجراءات السريعة */}
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 flex flex-col justify-center items-center text-center group">
            <div className="bg-white/20 p-4 rounded-2xl mb-4 group-hover:scale-110 group-hover:rotate-360 transition-transform duration-500 ease-in-out">
              <PersonAddAlt1Rounded
                className="text-white"
                sx={{ fontSize: 40 }}
              />
            </div>
            <Typography variant="h6" className="text-white font-bold mb-4">
              إدارة التدفقات المالية
            </Typography>
            <Typography
              variant="body2"
              className="text-white/80 mb-6 text-xs px-4"
            >
              يمكنك تحديث حالة الشيكات المستحقة مباشرة من الجدول أدناه
            </Typography>
            <ButtonComponent
              onClick={() => navigate("/payments")}
              label="عرض سجل المدفوعات"
              icon={<Money />}
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
          <div className="p-6 md:p-8 bg-gray-50/50 border-b border-gray-100 flex flex-col md:flex-row  items-center md:justify-between gap-6 md:w-full w-full">
            <SearchBox
              onChange={handleSearch}
              placeholder="ابحث عن شيك بالاسم، رقم الشيك..."
            />
            <SelectComponent
              label="حالة الشيك"
              name="checkStatus"
              value={checkStatus?._id}
              onChange={setCheckStatus}
              options={[
                { _id: "", label: "الكل" },
                { _id: "pending", label: "قيد الانتظار" },
                { _id: "cleared", label: "تم الصرف" },
                { _id: "returned", label: "تم الارتجاع" },
              ]}
              optionLabel="label"
              optionValue="_id"
            />
          </div>

          {/* جدول الشيكات بتغليف متجاوب */}
          <div className="p-2 md:p-6 overflow-x-auto min-h-[400px]">
            <ChecksTable
              checks={checks}
              setOpen={setOpenEdit}
              setSelectedCheck={setSelectedCheck}
              fullWidth={true}
            />
          </div>

          {/* الترقيم */}
          <div className="py-8 flex justify-center border-t border-gray-50">
            <div className="bg-gray-50 px-8 py-2 rounded-2xl border border-gray-100">
              <UsePagination
                Page={page}
                setPage={setPage}
                totalPages={totalPages}
              />
            </div>
          </div>
        </motion.section>
      </main>

      <EditCheckDialog
        open={openEdit}
        setOpen={setOpenEdit}
        check={selectedCheck}
        fetchChecks={fetchChecks}
      />
    </div>
  );
};

export default ChecksPage;
