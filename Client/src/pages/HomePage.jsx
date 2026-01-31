import React, { useState } from "react";
import SideBarComponent from "../components/SideBarComponent";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-row-reverse min-h-screen bg-[#f8fafc]">
      <SideBarComponent mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 transition-all duration-300 w-full">
        <Outlet context={{ mobileOpen, setMobileOpen }} />
      </div>
    </div>
  );
};

export default HomePage;
