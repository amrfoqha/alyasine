import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
const ProductRoutes = () => {
  return (
    <div className="bg-gray-50/50 min-h-screen w-full" dir="rtl">
      <Header title="المنتجات" />
      <Outlet />
    </div>
  );
};

export default ProductRoutes;
