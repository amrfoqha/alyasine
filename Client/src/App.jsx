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
import InvoiceDetails from "./pages/InvoiceDetails";
import InvoiceRoutes from "./Routes/InvoiceRoutes";
import PaymentsPage from "./pages/PaymentsPage";
import CustomerStatementPage from "./pages/CustomerStatementPage";
import ChecksPage from "./pages/ChecksPage";
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
          <Route
            path="customer/:id/statement"
            element={<CustomerStatementPage />}
          />
          <Route path="invoice" element={<InvoiceRoutes />}>
            <Route index element={<InvoicePage />} />
            <Route path=":id" element={<InvoiceDetails />} />
          </Route>
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="checks" element={<ChecksPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
