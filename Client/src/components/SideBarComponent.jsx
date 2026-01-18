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
        className="text-white hover:text-gray-300 cursor-pointer hover:bg-gray-700 p-4 w-full "
        style={{
          backgroundColor: currentPath === path ? "#3b3b3b" : "transparent",
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
    <div className="w-42 min-h-screen bg-gray-800 text-white ">
      <div className="flex flex-col justify-between h-full py-5  ">
        <ul className="flex flex-col gap-8 text-center text-xl pt-4 sticky top-0">
          <NavButton
            navigate={navigate}
            path="/dashboard"
            label="Dashboard"
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
            path="/settings"
            label="Settings"
            setCurrentPath={setCurrentPath}
            currentPath={currentPath}
          />
        </ul>
        <div className="w-full px-6 sticky bottom-0">
          <LogoutButton className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default SideBarComponent;
