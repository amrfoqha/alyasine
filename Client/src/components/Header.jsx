import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useContext } from "react";
import { Auth } from "../context/Auth";
import { IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { useOutletContext } from "react-router-dom";

const Header = ({ title }) => {
  const [dateTime, setDateTime] = useState(new Date());
  const { user } = useContext(Auth);

  // Try to get context safely, in case Header is used outside HomePage (unlikely but good practice)
  const context = useOutletContext();
  const setMobileOpen = context?.setMobileOpen;

  // تحديث الوقت كل دقيقة لإعطاء طابع حي للنظام
  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formattedDate = dateTime.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-40 w-full px-4 md:px-8 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200 flex justify-between items-center transition-all duration-300">
      {/* جهة اليمين: العنوان والقائمة */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-4"
      >
        {/* زر القائمة للموبايل */}
        <div className="lg:hidden">
          <IconButton onClick={() => setMobileOpen && setMobileOpen(true)}>
            <MenuIcon className="text-gray-700" />
          </IconButton>
        </div>

        <div className="h-8 w-1.5 bg-blue-600 rounded-full hidden md:block"></div>
        <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
          {title}
        </h1>
      </motion.div>

      {/* جهة اليسار: معلومات إضافية وملف شخصي */}
      <div className="flex items-center gap-6">
        {/* التاريخ - يختفي على الشاشات الصغيرة */}
        <div className="hidden lg:flex flex-col text-left border-l border-gray-100 pl-6">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            التاريخ الحالي
          </span>
          <span className="text-sm font-bold text-gray-600 font-mono">
            {formattedDate}
          </span>
        </div>

        <div className="flex items-center gap-3 bg-gray-500/5 p-2 pr-4 rounded-2xl border border-gray-100">
          <div className="text-right hidden sm:block">
            <p className="text-md font-black text-gray-800 leading-none">
              {user.name}
            </p>
            <p className="text-[14px] text-green-500 font-bold mt-1">
              متصل الآن
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-linear-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
