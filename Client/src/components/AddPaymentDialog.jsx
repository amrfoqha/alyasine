import React, { useEffect } from "react";
import { Dialog, DialogContent, Fade } from "@mui/material";
import { motion } from "framer-motion";
import {
  CloseRounded,
  PaymentsRounded,
  AccountBalanceWalletRounded,
  EventNoteRounded,
  DescriptionRounded,
  PersonRounded,
} from "@mui/icons-material";
import { useState } from "react";
import { createPayment } from "../API/PaymentAPI";
import SelectComponent from "./SelectComponent";
import { getAllCustomers, getCustomers } from "../API/CustomerAPI";
import toast from "react-hot-toast";

const AddPaymentDialog = ({ open, handleClose, setPayments }) => {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    amount: 0,
    date: new Date().toISOString().split("T")[0],
    method: "cash",
    note: "بلا",
    customer: "",
    checkDetails: {
      checkNumber: "",
      bankName: "",
      dueDate: "",
    },
  });
  const [errors, setErrors] = useState({
    amount: "",
    date: "",
    method: "",
    note: "",
    customer: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(form);
      const payload = {
        ...form,
        amount: Number(form.amount),
        customer: form.customer,
      };

      if (form.method === "check") {
        if (
          !form.checkDetails.checkNumber ||
          !form.checkDetails.bankName ||
          !form.checkDetails.dueDate
        ) {
          toast.error("يرجى ملء جميع بيانات الشيك");
          return;
        }
      } else {
        delete payload.checkDetails;
      }

      const res = await createPayment(payload);
      console.log(res);
      setPayments((prev) => [...prev, res]);
      toast.success("تم إضافة الدفعة بنجاح");
      handleClose();
    } catch (error) {
      console.log(error);
      toast.error("حدث خطأ أثناء إضافة الدفعة");
      toast.error(error.message);
    }
  };

  const validateAmount = (e) => {
    if (e.target.value <= 0) {
      setErrors((prev) => ({
        ...prev,
        amount: "المبلغ يجب أن يكون أكبر من صفر",
      }));
    } else {
      setErrors((prev) => ({ ...prev, amount: "" }));
    }
  };

  const validateDate = (e) => {
    if (!e.target.value) {
      setErrors((prev) => ({ ...prev, date: "التاريخ مطلوب" }));
    } else {
      const date = new Date(e.target.value);
      const today = new Date();
      if (date > today) {
        setErrors((prev) => ({
          ...prev,
          date: "التاريخ لا يمكن أن يكون في المستقبل",
        }));
      } else {
        setErrors((prev) => ({ ...prev, date: "" }));
      }
    }
  };

  const validateMethod = (e) => {
    if (!e) {
      setErrors((prev) => ({ ...prev, method: "طريقة الدفع مطلوبة" }));
    } else {
      setErrors((prev) => ({ ...prev, method: "" }));
    }
  };

  const validateCustomer = (e) => {
    if (!e) {
      setErrors((prev) => ({ ...prev, customer: "العميل مطلوب" }));
    } else {
      setErrors((prev) => ({ ...prev, customer: "" }));
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      const res = await getAllCustomers();
      setCustomers(res);
    };
    fetchCustomers();
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      transitionDuration={400}
      maxWidth="sm"
    >
      <div className="bg-white flex flex-col font-sans" dir="rtl">
        {/* Header - تدرج لوني عصري */}
        <div className="bg-linear-to-l from-slate-900 via-slate-800 to-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-2 mb-1">
              <PaymentsRounded className="text-blue-400" />
              <h3 className="text-xl font-black">إضافة دفعة مالية</h3>
            </div>
            <p className="text-xs text-slate-400">
              قم بتوثيق العمليات المالية بدقة لضمان توازن السجلات
            </p>
          </div>
          <button
            onClick={handleClose}
            className="z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-white"
          >
            <CloseRounded />
          </button>

          {/* زخرفة خلفية */}
          <PaymentsRounded
            className="absolute -left-4 -bottom-4 text-white/5"
            sx={{ fontSize: 120 }}
          />
        </div>

        <DialogContent className="p-0">
          <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* حقل المبلغ */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                  <AccountBalanceWalletRounded
                    className="text-blue-500"
                    fontSize="small"
                  />
                  المبلغ (₪)
                </label>
                <input
                  required
                  type="number"
                  placeholder="0.00"
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono text-xl bg-slate-50/50"
                  onChange={(e) => {
                    validateAmount(e);
                    setForm((prev) => ({ ...prev, amount: e.target.value }));
                  }}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm">{errors.amount}</p>
                )}
              </div>

              {/* حقل التاريخ */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                  <EventNoteRounded
                    className="text-blue-500"
                    fontSize="small"
                  />
                  تاريخ الدفعة
                </label>
                <input
                  required
                  type="date"
                  defaultValue={new Date().toISOString().split("T")[0]}
                  className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 text-slate-600 font-bold"
                  onChange={(e) => {
                    validateDate(e);
                    setForm((prev) => ({ ...prev, date: e.target.value }));
                  }}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date}</p>
                )}
              </div>
            </div>

            {/* اسم الدافع */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                <PersonRounded className="text-blue-500" fontSize="small" />
                اسم الدافع / الجهة
              </label>
              <SelectComponent
                options={customers}
                value={form.customer}
                onChange={(e) => {
                  validateCustomer(e);
                  setForm({ ...form, customer: e._id });
                }}
                placeholder="اختر العميل ..."
                className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 text-slate-600 font-bold"
              />
              {errors.customer && (
                <p className="text-red-500 text-sm">{errors.customer}</p>
              )}
            </div>

            {/* طريقة الدفع */}
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-700 block px-1">
                طريقة الدفع
              </label>
              <select
                value={form.method}
                onChange={(e) => {
                  validateMethod(e.target.value);
                  setForm({ ...form, method: e.target.value });
                }}
                className="w-full border-2 border-slate-100 rounded-2xl p-4 bg-slate-50/50 outline-none focus:border-blue-500 transition-all font-bold text-slate-600 appearance-none cursor-pointer"
              >
                <option value="cash">💵 نقدي (Cash)</option>
                <option value="bank">🏦 تحويل بنكي</option>
                <option value="check">🎫 شيك برسم التحصيل</option>
              </select>
            </div>

            {/* تفاصيل الشيك - يظهر فقط عند اختيار شيك */}
            {form.method === "check" && (
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-black text-blue-800 block px-1">
                    بيانات الشيك
                  </label>
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="رقم الشيك"
                    value={form.checkDetails.checkNumber}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        checkDetails: {
                          ...form.checkDetails,
                          checkNumber: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white font-mono text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="اسم البنك"
                    value={form.checkDetails.bankName}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        checkDetails: {
                          ...form.checkDetails,
                          bankName: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-sm"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-blue-600 block px-1">
                    تاريخ استحقاق الشيك
                  </label>
                  <input
                    type="date"
                    value={form.checkDetails.dueDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        checkDetails: {
                          ...form.checkDetails,
                          dueDate: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-blue-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500/20 outline-none bg-white text-sm font-bold text-slate-600"
                  />
                </div>
              </div>
            )}

            {/* ملاحظات */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-black text-slate-700">
                <DescriptionRounded
                  className="text-blue-500"
                  fontSize="small"
                />
                بيان الدفعة (ملاحظات)
              </label>
              <textarea
                value={form.note}
                onChange={(e) => {
                  setForm({ ...form, note: e.target.value });
                }}
                rows="2"
                placeholder="اكتب تفاصيل إضافية عن هذه الدفعة..."
                className="w-full border-2 border-slate-100 rounded-2xl p-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-slate-50/50 resize-none"
              ></textarea>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className={`flex-2 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-xl shadow-blue-200 transition-all ${
                  errors.length > 0 ||
                  errors.amount ||
                  errors.date ||
                  errors.customer ||
                  errors.method
                    ? " cursor-not-allowed bg-slate-200"
                    : "hover:bg-blue-700 cursor-pointer"
                }`}
                disabled={
                  errors.length > 0 ||
                  errors.amount ||
                  errors.date ||
                  errors.customer ||
                  errors.method
                }
              >
                {errors.length > 0 ||
                errors.amount ||
                errors.date ||
                errors.customer ||
                errors.method
                  ? "يرجى ملء جميع الحقول المطلوبة"
                  : "تأكيد وحفظ الدفعة"}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleClose}
                className=" cursor-pointer flex-1 bg-slate-50 text-slate-500 py-4 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-200"
              >
                إلغاء
              </motion.button>
            </div>
          </form>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default AddPaymentDialog;
