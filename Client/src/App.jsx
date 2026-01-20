import React from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Routes, Route, redirect } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./context/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";
import ProductsPage from "./pages/ProductsPage";
import StockInPage from "./pages/StockInPage";
import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/NotFoundPage";
import CustomerPage from "./pages/CustomerPage";
import { Auth } from "./context/Auth";
import { useContext } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import InvoicePage from "./pages/InvoicePage";
function App() {
  const { loading } = useContext(Auth);
  if (loading) {
    return <LoadingOverlay />;
  }
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="product/:id" element={<ProductsPage />} />
          <Route path="stockin" element={<StockInPage />} />
          <Route path="customer" element={<CustomerPage />} />
          <Route path="invoice" element={<InvoicePage />} />
          {/* <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} /> */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
