import { useNavigate, useLocation } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { motion } from "framer-motion";
import logo from "../assets/logo.jpg";
import { Drawer, useMediaQuery } from "@mui/material";

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
  isCollapsed,
  onClick,
}) => {
  const isActive = currentPath === path;

  return (
    <li className="px-3">
      <button
        onClick={() => {
          navigate(path);
          if (onClick) onClick();
        }}
        className={`
          relative flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-300 group
          ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50" : "text-gray-400 hover:bg-white/5 hover:text-white"}
        `}
      >
        {/* أيقونة الزر */}
        <div
          className={`${isActive ? "text-white" : "text-gray-500 group-hover:text-blue-400"} transition-colors`}
        >
          <Icon fontSize={isCollapsed ? "medium" : "small"} />
        </div>

        {/* النص - يختفي في وضع القائمة المصغرة */}
        {!isCollapsed && (
          <span className="font-bold text-sm tracking-wide whitespace-nowrap">
            {label}
          </span>
        )}

        {/* مؤشر جانبي صغير عند التفعيل */}
        {isActive && !isCollapsed && (
          <motion.div
            layoutId="activeSideBar"
            className="absolute -left-3 w-1.5 h-8 bg-blue-400 rounded-r-full shadow-[0_0_15px_#60a5fa]"
          />
        )}
      </button>
    </li>
  );
};

const SidebarContent = ({
  navigate,
  currentPath,
  isCollapsed,
  menuItems,
  onClose,
}) => {
  return (
    <div
      className="h-full bg-[#0f172a] text-white flex flex-col relative border-l border-white/5 shadow-2xl"
      dir="rtl"
    >
      {/* Logo Area */}
      <div className="p-6 mb-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="w-18 h-18" />
            <span className="font-black text-xl -tracking-widest mr-2 mt-2">
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
      <nav className="flex-1 overflow-y-auto custom-scrollbar">
        <ul className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavButton
              key={item.path}
              navigate={navigate}
              path={item.path}
              label={item.label}
              icon={item.icon}
              currentPath={currentPath}
              isCollapsed={isCollapsed}
              onClick={onClose}
            />
          ))}
        </ul>
      </nav>

      {/* Footer Area / Logout */}
      <div
        className={`p-4 mt-auto border-t border-white/5 bg-black/20 sticky bottom-0 ${isCollapsed ? "flex justify-center" : ""}`}
      >
        <LogoutButton showLabel={!isCollapsed} className="w-full" />
      </div>
    </div>
  );
};

const SideBarComponent = ({ mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Use MUI theme/media query for consistent breakpoints
  // We'll consider mobile as below 'lg' (1024px) for the drawer behavior
  // But purely for the implementation asked:
  // Desktop (> 1024px): Permanent sidebar
  // Mobile (< 1024px): Drawer
  // This matches the previous logic: window.innerWidth < 1024
  const isMobile = useMediaQuery("(max-width:1024px)");

  const menuItems = [
    { path: "/dashboard", label: "لوحة التحكم", icon: DashboardRounded },
    { path: "/inventory", label: "إدارة المخزون", icon: Inventory2Rounded },
    { path: "/stockin", label: "سجل الوارد", icon: MoveToInboxRounded },
    { path: "/payments", label: "حساب الدفعات", icon: PaymentsRounded },
    { path: "/invoice", label: "نظام الفواتير", icon: ReceiptLongRounded },
    { path: "/customer", label: "قائمة الزبائن", icon: PeopleAltRounded },
  ];

  const handleDrawerToggle = () => {
    if (setMobileOpen) setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          anchor="right" // RTL support
          sx={{
            display: { xs: "block", lg: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 280,
              backgroundColor: "#0f172a",
              border: "none",
            },
          }}
        >
          <SidebarContent
            navigate={navigate}
            currentPath={currentPath}
            isCollapsed={false}
            menuItems={menuItems}
            onClose={handleDrawerToggle}
          />
        </Drawer>
      )}

      {/* Desktop Permanent Sidebar */}
      {!isMobile && (
        <motion.div
          initial={false}
          animate={{ width: "280px" }}
          className="hidden lg:flex min-h-screen z-1000 sticky top-0 h-screen"
        >
          <div className="w-full h-full">
            <SidebarContent
              navigate={navigate}
              currentPath={currentPath}
              isCollapsed={false}
              menuItems={menuItems}
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default SideBarComponent;
