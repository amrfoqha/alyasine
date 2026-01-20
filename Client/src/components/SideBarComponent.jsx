import { useState, useEffect } from "react";
import LogoutButton from "./LogoutButton";
import { useNavigate, useLocation } from "react-router-dom";

const NavButton = ({ navigate, path, label, setCurrentPath, currentPath }) => {
  return (
    <li>
      <button
        onClick={() => {
          navigate(path);
          setCurrentPath(path);
        }}
        className="text-white hover:text-gray-300 cursor-pointer hover:bg-gray-900 p-4 w-full "
        style={{
          backgroundColor: currentPath === path ? "#101828" : "transparent",
        }}
      >
        {label}
      </button>
    </li>
  );
};

const SideBarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(() => {
    if (location.pathname === "/") {
      return "/dashboard";
    }
    return location.pathname;
  });
  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);
  return (
    <div className="w-64 min-h-screen bg-gray-900/90 text-white flex flex-col">
      <div className="flex flex-col justify-between sticky top-0 z-50  min-h-screen py-5">
        <ul className="flex flex-col gap-2 text-xl pt-13">
          <NavButton
            navigate={navigate}
            path="/dashboard"
            label="لوحة التحكم"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
          <NavButton
            navigate={navigate}
            path="/inventory"
            label="المخزون"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
          <NavButton
            navigate={navigate}
            path="/stockin"
            label="الوارد"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
          <NavButton
            navigate={navigate}
            path="/expense"
            label="المبيعات / الصادر"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
          <NavButton
            navigate={navigate}
            path="/invoice"
            label="إدارة الفواتير"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
          <NavButton
            navigate={navigate}
            path="/customer"
            label="الزبائن"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
        </ul>
        <div className="w-full px-4 mt-auto">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default SideBarComponent;
