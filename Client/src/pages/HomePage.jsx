import React from "react";
import SideBarComponent from "../components/SideBarComponent";
import { Outlet } from "react-router-dom";
const HomePage = () => {
  return (
    <div className="flex flex-row-reverse  ">
      <SideBarComponent />
      <Outlet />
    </div>
  );
};

export default HomePage;
