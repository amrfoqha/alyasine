import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpg";
// استيراد الأيقونات لجعل الشكل احترافياً
import {
  DashboardRounded,
  Inventory2Rounded,
  MoveToInboxRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  PeopleAltRounded,
} from "@mui/icons-material";

const NavButton = ({
  navigate,
  path,
  label,
  icon: Icon,
  currentPath,
  isMobile,
}) => {
  const isActive = currentPath === path;

  return (
    <li className="px-3">
      <button
        onClick={() => navigate(path)}
        className={`
          relative flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-300 group
          ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-gray-400 hover:bg-white/5 hover:text-white"}
        `}
      >
        {/* أيقونة الزر */}
        <div
          className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-400"} transition-colors`}
        >
          <Icon fontSize={isMobile ? "medium" : "small"} />
        </div>

        {/* النص - يختفي في وضع الموبايل */}
        {!isMobile && (
          <span className="font-bold text-sm tracking-wide whitespace-nowrap">
            {label}
          </span>
        )}

        {/* مؤشر جانبي صغير عند التفعيل */}
        {isActive && !isMobile && (
          <motion.div
            layoutId="activeSideBar"
            className="absolute -left-3 w-1.5 h-8 bg-blue-400 rounded-r-full shadow-[0_0_15px_#60a5fa]"
          />
        )}
      </button>
    </li>
  );
};

const SideBarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { path: "/dashboard", label: "لوحة التحكم", icon: DashboardRounded },
    { path: "/inventory", label: "إدارة المخزون", icon: Inventory2Rounded },
    { path: "/stockin", label: "سجل الوارد", icon: MoveToInboxRounded },
    { path: "/payments", label: "حساب الدفعات", icon: PaymentsRounded },
    { path: "/invoice", label: "نظام الفواتير", icon: ReceiptLongRounded },
    { path: "/customer", label: "قائمة الزبائن", icon: PeopleAltRounded },
  ];

  return (
    <motion.div
      initial={false}
      animate={{ width: isMobile ? "80px" : "280px" }}
      className="min-h-screen bg-[#0f172a] text-white flex flex-col relative border-l border-white/5 shadow-2xl z-[1000]"
      dir="rtl"
    >
      {/* Logo Area */}
      <div className="sticky top-0">
        <div className="p-6 mb-4">
          {!isMobile ? (
            <div className="flex items-center gap-3">
              <img src={logo} alt="logo" className="w-18 h-18" />
              <span className="font-black text-2xl -tracking-widest mr-2 mt-2">
                شايش<div className="text-blue-500 mr-4">الياسين</div>
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-xl mx-auto shadow-lg shadow-blue-600/30">
              S
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <NavButton
                key={item.path}
                navigate={navigate}
                path={item.path}
                label={item.label}
                icon={item.icon}
                currentPath={currentPath}
                isMobile={isMobile}
              />
            ))}
          </ul>
        </nav>
      </div>

      {/* Footer Area / Logout */}
      <div
        className={`p-4 mt-auto border-t border-white/5 bg-black/20 sticky bottom-0 ${isMobile ? "flex justify-center" : ""}`}
      >
        <LogoutButton showLabel={!isMobile} className="w-full" />
      </div>
    </motion.div>
  );
};

export default SideBarComponent;
