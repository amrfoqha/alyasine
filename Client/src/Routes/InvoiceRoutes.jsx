import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
const InvoiceRoutes = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen w-full" dir="rtl">
      <Header title="الفواتير" />
      <Outlet />
    </div>
  );
};

export default InvoiceRoutes;
